import { requireNativeModule } from "expo-modules-core";
import { Platform } from "react-native";

export type ExecResult = {
  stdout: string;
  stderr: string;
  exitCode: number;
};

type ExecBridgeNative = {
  execCommand: (command: string, cwd: string, timeoutMs: number) => Promise<ExecResult>;
};

let cached: ExecBridgeNative | null = null;

function getNative(): ExecBridgeNative {
  if (cached) return cached;
  if (Platform.OS === "web") {
    cached = {
      async execCommand(): Promise<ExecResult> {
        return {
          stdout: "",
          stderr: "exec-bridge is not available on web",
          exitCode: -1,
        };
      },
    };
  } else {
    cached = requireNativeModule("ExecBridge") as ExecBridgeNative;
  }
  return cached;
}

export async function execCommand(
  command: string,
  cwd?: string,
  timeoutMs: number = 30000,
): Promise<ExecResult> {
  return getNative().execCommand(command, cwd ?? "", timeoutMs);
}
