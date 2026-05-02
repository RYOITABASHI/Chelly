import { useEffect, useState } from "react";
import { ActivityIndicator, Pressable, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { File } from "expo-file-system";
import { useSettingsStore } from "@/store/settings-store";

function resolvePreviewPath(path: string, cwd: string): string {
  if (path.startsWith("file://")) return path;
  if (path.startsWith("/")) return `file://${path}`;
  return `file://${cwd.replace(/\/+$/, "")}/${path.replace(/^\.?\//, "")}`;
}

export default function PreviewScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ path?: string }>();
  const filePath = typeof params.path === "string" ? params.path : "";
  const cwd = useSettingsStore((s) => s.currentCwd);
  const [html, setHtml] = useState<string>("");
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    if (!filePath || !filePath.endsWith(".html")) {
      setError("HTML preview file is missing.");
      setLoading(false);
      return;
    }

    const fileUri = resolvePreviewPath(filePath, cwd);
    new File(fileUri).text()
      .then((result) => {
        if (cancelled) return;
        setHtml(result);
      })
      .catch((err: unknown) => {
        if (!cancelled) setError(err instanceof Error ? err.message : String(err));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [cwd, filePath]);

  return (
    <>
      <Stack.Screen options={{ presentation: "modal", headerShown: false }} />
      <View className="flex-1 bg-black">
        <View className="bg-zinc-950 border-b border-zinc-800 px-4 pt-12 pb-3 flex-row items-center">
          <Pressable onPress={() => router.back()} className="pr-4 py-2 active:opacity-70">
            <Text className="text-emerald-400 text-base">← Back</Text>
          </Pressable>
          <View className="flex-1">
            <Text className="text-white font-bold">Chelly Preview</Text>
            <Text className="text-zinc-500 text-xs" numberOfLines={1}>
              {filePath}
            </Text>
          </View>
        </View>

        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator color="#10b981" />
            <Text className="text-zinc-500 text-xs mt-3">Loading artwork...</Text>
          </View>
        ) : error ? (
          <View className="flex-1 items-center justify-center px-6">
            <Text className="text-red-400 text-center">{error}</Text>
          </View>
        ) : (
          <WebView
            originWhitelist={["*"]}
            source={{ html, baseUrl: resolvePreviewPath(filePath, cwd) }}
            javaScriptEnabled
            domStorageEnabled
            allowsInlineMediaPlayback
            mediaPlaybackRequiresUserAction={false}
            className="flex-1 bg-black"
          />
        )}
      </View>
    </>
  );
}
