import { useEffect, useMemo, useState } from "react";
import { ActivityIndicator, Pressable, ScrollView, Text, View } from "react-native";
import { Stack, useLocalSearchParams, useRouter } from "expo-router";
import { WebView } from "react-native-webview";
import { File } from "expo-file-system";
import { useSettingsStore } from "@/store/settings-store";
import { buildLearningInsight } from "@/lib/learning-insights";

type PreviewTab = "play" | "mechanism" | "code" | "tweak";

const TABS: Array<{ id: PreviewTab; label: string }> = [
  { id: "play", label: "作品" },
  { id: "mechanism", label: "しくみ" },
  { id: "code", label: "コード" },
  { id: "tweak", label: "改造" },
];

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
  const [activeTab, setActiveTab] = useState<PreviewTab>("play");
  const insight = useMemo(() => buildLearningInsight(filePath, html), [filePath, html]);

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
          <View className="flex-1">
            <View className="flex-row gap-2 px-4 py-3 border-b border-zinc-900">
              {TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-full border ${
                      selected ? "bg-emerald-500 border-emerald-400" : "bg-zinc-950 border-zinc-800"
                    }`}
                  >
                    <Text className={selected ? "text-black font-bold" : "text-zinc-400"}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            {activeTab === "play" ? (
              <WebView
                originWhitelist={["*"]}
                source={{ html, baseUrl: resolvePreviewPath(filePath, cwd) }}
                javaScriptEnabled
                domStorageEnabled
                allowsInlineMediaPlayback
                mediaPlaybackRequiresUserAction={false}
                className="flex-1 bg-black"
              />
            ) : activeTab === "mechanism" ? (
              <ScrollView className="flex-1" contentContainerClassName="px-5 py-5 gap-4">
                <View>
                  <Text className="text-white text-2xl font-bold">{insight.title}</Text>
                  <Text className="text-zinc-500 mt-2">
                    作ったあとに、作品がどう動いているかを分解して見ます。
                  </Text>
                </View>

                <View className="flex-row flex-wrap gap-2">
                  {insight.concepts.map((concept) => (
                    <View key={concept} className="px-3 py-2 rounded-full bg-zinc-900 border border-zinc-800">
                      <Text className="text-emerald-300 text-xs font-bold">{concept}</Text>
                    </View>
                  ))}
                </View>

                {insight.mechanisms.map((item) => (
                  <View key={item.title} className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
                    <Text className="text-white font-bold text-lg">{item.title}</Text>
                    <Text className="text-zinc-400 mt-2 leading-6">{item.body}</Text>
                    {item.codeHint ? (
                      <View className="mt-3 rounded-xl bg-black border border-zinc-800 p-3">
                        <Text className="text-emerald-300 font-mono text-xs">{item.codeHint}</Text>
                      </View>
                    ) : null}
                  </View>
                ))}

                <View className="rounded-2xl bg-zinc-950 border border-violet-900 p-4">
                  <Text className="text-violet-300 font-bold text-lg">ノードで考えると</Text>
                  {insight.nodeMap.map((node) => (
                    <View key={node.label} className="mt-3">
                      <Text className="text-white font-bold">{node.label}</Text>
                      <Text className="text-zinc-400 mt-1 leading-6">{node.body}</Text>
                    </View>
                  ))}
                </View>
              </ScrollView>
            ) : activeTab === "code" ? (
              <ScrollView className="flex-1" contentContainerClassName="p-4">
                <Text className="text-zinc-500 mb-3">
                  この作品を動かしているHTML/CSS/JavaScriptです。まずは「知っている単語」を探します。
                </Text>
                <View className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
                  <Text selectable className="text-zinc-200 font-mono text-xs leading-5">
                    {html}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <ScrollView className="flex-1" contentContainerClassName="px-5 py-5 gap-4">
                <View>
                  <Text className="text-white text-2xl font-bold">次に改造できるところ</Text>
                  <Text className="text-zinc-500 mt-2">
                    作品を壊さずに試しやすい変更点です。あとでAIに「ここを変えて」と頼める導線にします。
                  </Text>
                </View>
                {insight.tweaks.map((tweak) => (
                  <View key={tweak.title} className="rounded-2xl bg-zinc-950 border border-zinc-800 p-4">
                    <Text className="text-white font-bold text-lg">{tweak.title}</Text>
                    <Text className="text-zinc-400 mt-2 leading-6">{tweak.body}</Text>
                    <View className="mt-3 rounded-xl bg-black border border-zinc-800 p-3">
                      <Text className="text-sky-300 font-mono text-xs">{tweak.target}</Text>
                    </View>
                  </View>
                ))}
              </ScrollView>
            )}
          </View>
        )}
      </View>
    </>
  );
}
