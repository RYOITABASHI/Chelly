import { execCommand } from "@/modules/exec-bridge";
import { classifyCommand, getBlockMessage } from "@/lib/command-safety";
import type { CommandExecution } from "@/store/chat-store";

export type AiCommand = { cmd: string; desc: string };

export async function executeCommandList(
  commands: AiCommand[],
  cwd: string,
): Promise<CommandExecution[]> {
  const results: CommandExecution[] = [];

  for (const { cmd } of commands) {
    const safety = classifyCommand(cmd);

    if (safety === "BLOCKED" || safety === "DESTRUCTIVE") {
      results.push({
        command: cmd,
        output: safety === "BLOCKED" ? getBlockMessage() : "教育モードでは破壊的な操作は実行できません。",
        exitCode: 1,
        isCollapsed: false,
      });
      continue;
    }

    try {
      const result = await execCommand(cmd, cwd, 30000);
      const output = [result.stdout, result.stderr].filter(Boolean).join("\n");
      results.push({
        command: cmd,
        output: output || "(no output)",
        exitCode: result.exitCode,
        isCollapsed: false,
      });
    } catch (err) {
      results.push({
        command: cmd,
        output: err instanceof Error ? err.message : String(err),
        exitCode: 1,
        isCollapsed: false,
      });
    }
  }

  return results;
}
