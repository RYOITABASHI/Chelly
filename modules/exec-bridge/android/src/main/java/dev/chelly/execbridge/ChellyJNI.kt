package dev.chelly.execbridge

import java.io.File
import java.util.concurrent.TimeUnit

object ChellyJNI {
    @JvmStatic
    fun execSubprocess(
        linkerPath: String,
        bashPath: String,
        ldLibPath: String,
        homePath: String,
        cwd: String,
        command: String,
        timeoutMs: Int
    ): Array<String> {
        val workDir = File(if (cwd.isNotEmpty()) cwd else homePath)
        workDir.mkdirs()

        val commandLine = if (bashPath.endsWith(".so")) {
            listOf(linkerPath, bashPath, "-c", command)
        } else {
            listOf(bashPath, "-c", command)
        }
        val processBuilder = ProcessBuilder(commandLine)
            .directory(workDir)
            .redirectInput(ProcessBuilder.Redirect.PIPE)
        processBuilder.environment().apply {
            put("HOME", homePath)
            put("TERM", "dumb")
            put("LANG", "en_US.UTF-8")
            put("LD_LIBRARY_PATH", ldLibPath)
            put("SHELL", bashPath)
            put(
                "PATH",
                listOf(
                    "$homePath/chelly/bin",
                    "$homePath/.local/bin",
                    ldLibPath,
                    "$ldLibPath/node_modules/npm/bin",
                    "$ldLibPath/node_modules/.bin",
                    "/system/bin",
                    "/system/xbin",
                    "/usr/bin",
                    "/usr/sbin",
                    "/bin",
                    "/sbin",
                ).joinToString(":")
            )
            val preload = File(ldLibPath, "libexec_wrapper.so")
            if (bashPath.endsWith(".so") && preload.exists()) {
                put("LD_PRELOAD", preload.absolutePath)
            } else {
                remove("LD_PRELOAD")
            }
        }

        val process = processBuilder.start()
        val stdout = StringBuilder()
        val stderr = StringBuilder()
        val stdoutReader = Thread {
            process.inputStream.bufferedReader().use { stdout.append(it.readText()) }
        }
        val stderrReader = Thread {
            process.errorStream.bufferedReader().use { stderr.append(it.readText()) }
        }
        stdoutReader.start()
        stderrReader.start()

        process.outputStream.close()
        val completed = process.waitFor(timeoutMs.coerceAtLeast(1000).toLong(), TimeUnit.MILLISECONDS)
        if (!completed) {
            process.destroyForcibly()
            process.waitFor(2, TimeUnit.SECONDS)
            return arrayOf("124", "", "Command timed out after ${timeoutMs}ms")
        }

        stdoutReader.join(1000)
        stderrReader.join(1000)
        return arrayOf(process.exitValue().toString(), stdout.toString(), stderr.toString())
    }
}
