import { useState } from "react";
import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import type { CommandExecution } from "@/store/chat-store";
import { extractFirstPreviewPath } from "@/lib/preview-artifact";

type Props = { executions: CommandExecution[] };

export function ExecutionCard({ executions }: Props) {
  const [expanded, setExpanded] = useState(false);
  const router = useRouter();
  const allSuccess = executions.every((e) => e.exitCode === 0);
  const previewPath = extractFirstPreviewPath(executions.map((e) => e.output));

  return (
    <View className="mt-2">
      {previewPath ? (
        <Pressable
          onPress={() =>
            router.push({
              pathname: "/preview",
              params: { path: previewPath },
            })
          }
          className="bg-emerald-600 rounded-xl px-4 py-3 mb-2 active:opacity-70"
        >
          <Text className="text-white font-bold text-sm text-center">
            ▶ 作品を開く
          </Text>
        </Pressable>
      ) : null}

      <Pressable onPress={() => setExpanded(!expanded)}>
      <View className="bg-zinc-800/50 rounded-lg p-3 border border-zinc-700/50">
        <View className="flex-row items-center gap-2">
          <Text className={allSuccess ? "text-green-400" : "text-red-400"}>
            {allSuccess ? "\u2713" : "\u2717"}
          </Text>
          <Text className="text-zinc-400 text-xs">
            {executions.length} step{executions.length > 1 ? "s" : ""} completed
          </Text>
          <Text className="text-zinc-500 text-xs ml-auto">
            {expanded ? "\u25B2" : "\u25BC"}
          </Text>
        </View>
        {expanded &&
          executions.map((e, i) => (
            <View key={i} className="mt-2 border-t border-zinc-700/30 pt-2">
              <Text className="text-zinc-500 text-xs font-mono">
                $ {e.command}
              </Text>
              {e.output ? (
                <Text
                  className="text-zinc-300 text-xs font-mono mt-1"
                  numberOfLines={20}
                >
                  {e.output.slice(0, 1000)}
                </Text>
              ) : null}
              {e.exitCode !== 0 && (
                <Text className="text-red-400 text-xs mt-1">
                  Exit code: {e.exitCode}
                </Text>
              )}
            </View>
          ))}
      </View>
      </Pressable>
    </View>
  );
}
