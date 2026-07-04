import { useState } from "react";
import { View, Text, TextInput, Pressable, ScrollView } from "react-native";
import { useRouter, Stack } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingsStore } from "@/store/settings-store";

type Provider = "gemini" | "claude" | "groq" | "cerebras" | "perplexity" | "local" | "browser-gemma";

const CLOUD_PROVIDERS: { id: Exclude<Provider, "local">; label: string; keyField: string }[] = [
  { id: "gemini", label: "Gemini", keyField: "geminiApiKey" },
  { id: "claude", label: "Claude", keyField: "claudeApiKey" },
  { id: "groq", label: "Groq", keyField: "groqApiKey" },
  { id: "cerebras", label: "Cerebras", keyField: "cerebrasApiKey" },
  { id: "perplexity", label: "Perplexity", keyField: "perplexityApiKey" },
];

export default function SettingsScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const settings = useSettingsStore();
  const [showKeys, setShowKeys] = useState<Record<string, boolean>>({});

  const toggleShowKey = (id: string) =>
    setShowKeys((prev) => ({ ...prev, [id]: !prev[id] }));

  const getKeyValue = (p: (typeof CLOUD_PROVIDERS)[number]): string => {
    return (settings as any)[p.keyField] ?? "";
  };

  const handleKeyChange = async (p: (typeof CLOUD_PROVIDERS)[number], value: string) => {
    await settings.setApiKey(p.id, value);
  };

  const handleLocalChange = (
    field: "localLlmUrl" | "localModel" | "browserGemmaModel",
    value: string,
  ) => {
    useSettingsStore.setState({ [field]: value } as any);
    settings.save();
  };

  return (
    <>
      <Stack.Screen options={{ presentation: "modal", headerShown: false }} />
      <ScrollView
        className="flex-1 bg-black"
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        keyboardShouldPersistTaps="handled"
      >
        <View style={{ paddingTop: insets.top + 12 }} className="px-5">
          {/* Header */}
          <View className="flex-row items-center justify-between mb-6">
            <Pressable onPress={() => router.back()} className="p-2 active:opacity-60">
              <Text className="text-indigo-400 text-base">{"\u2190"} Back</Text>
            </Pressable>
            <Text className="text-white text-lg font-bold font-mono">Settings</Text>
            <View className="w-16" />
          </View>

          {/* Local AI */}
          <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-3">
            Local AI
          </Text>
          <View className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-6">
            <Pressable
              onPress={() => settings.setActiveProvider("local")}
              className={`flex-row items-center px-4 py-3 rounded-xl border mb-4 ${
                settings.activeProvider === "local"
                  ? "border-emerald-500 bg-emerald-600/10"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <View
                className={`w-4 h-4 rounded-full border-2 mr-3 items-center justify-center ${
                  settings.activeProvider === "local" ? "border-emerald-500" : "border-zinc-600"
                }`}
              >
                {settings.activeProvider === "local" && (
                  <View className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-zinc-100 text-sm font-bold">Bundled Gemma local</Text>
                <Text className="text-zinc-500 text-xs mt-1">
                  端末内のAIを優先して、APIキーなしで始めます。
                </Text>
              </View>
            </Pressable>

            <Text className="text-zinc-400 text-xs font-mono mb-2">Local AI URL</Text>
            <TextInput
              value={settings.localLlmUrl}
              onChangeText={(v) => handleLocalChange("localLlmUrl", v)}
              placeholder="http://127.0.0.1:11434"
              placeholderTextColor="#3f3f46"
              className="text-white text-sm font-mono bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700/50 mb-3"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text className="text-zinc-400 text-xs font-mono mb-2">Model</Text>
            <TextInput
              value={settings.localModel}
              onChangeText={(v) => handleLocalChange("localModel", v)}
              placeholder="gemma4:latest"
              placeholderTextColor="#3f3f46"
              className="text-white text-sm font-mono bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700/50"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Browser Gemma */}
          <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-3">
            Experimental Browser AI
          </Text>
          <View className="bg-zinc-900 rounded-xl p-4 border border-zinc-800 mb-6">
            <Pressable
              onPress={() => settings.setActiveProvider("browser-gemma")}
              className={`flex-row items-center px-4 py-3 rounded-xl border mb-4 ${
                settings.activeProvider === "browser-gemma"
                  ? "border-emerald-500 bg-emerald-600/10"
                  : "border-zinc-800 bg-zinc-950"
              }`}
            >
              <View
                className={`w-4 h-4 rounded-full border-2 mr-3 items-center justify-center ${
                  settings.activeProvider === "browser-gemma" ? "border-emerald-500" : "border-zinc-600"
                }`}
              >
                {settings.activeProvider === "browser-gemma" && (
                  <View className="w-2 h-2 rounded-full bg-emerald-500" />
                )}
              </View>
              <View className="flex-1">
                <Text className="text-zinc-100 text-sm font-bold">Browser Gemma WebGPU</Text>
                <Text className="text-zinc-500 text-xs mt-1">
                  開発テスト用。対応ブラウザではモデルをブラウザ内で読み込みます。
                </Text>
              </View>
            </Pressable>

            <Text className="text-zinc-400 text-xs font-mono mb-2">Hugging Face model ID</Text>
            <TextInput
              value={settings.browserGemmaModel}
              onChangeText={(v) => handleLocalChange("browserGemmaModel", v)}
              placeholder="google/gemma-4-E2B-it"
              placeholderTextColor="#3f3f46"
              className="text-white text-sm font-mono bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700/50"
              autoCapitalize="none"
              autoCorrect={false}
            />
          </View>

          {/* Cloud providers */}
          <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-3">
            Optional Cloud AI
          </Text>
          <View className="gap-3 mb-6">
            {CLOUD_PROVIDERS.map((p) => (
              <View key={p.id} className="bg-zinc-900 rounded-xl p-3 border border-zinc-800">
                <View className="flex-row items-center justify-between mb-2">
                  <Pressable
                    onPress={() => settings.setActiveProvider(p.id)}
                    className="flex-row items-center flex-1"
                  >
                    <View
                      className={`w-4 h-4 rounded-full border-2 mr-3 items-center justify-center ${
                        settings.activeProvider === p.id ? "border-indigo-500" : "border-zinc-600"
                      }`}
                    >
                      {settings.activeProvider === p.id && (
                        <View className="w-2 h-2 rounded-full bg-indigo-500" />
                      )}
                    </View>
                    <Text className="text-zinc-400 text-xs font-mono">{p.label}</Text>
                  </Pressable>
                  <Pressable onPress={() => toggleShowKey(p.id)}>
                    <Text className="text-zinc-500 text-xs">
                      {showKeys[p.id] ? "Hide" : "Show"}
                    </Text>
                  </Pressable>
                </View>
                <TextInput
                  value={getKeyValue(p)}
                  onChangeText={(v) => handleKeyChange(p, v)}
                  placeholder="API key..."
                  placeholderTextColor="#3f3f46"
                  className="text-white text-sm font-mono bg-zinc-800 rounded-lg px-3 py-2 border border-zinc-700/50"
                  secureTextEntry={!showKeys[p.id]}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </View>
            ))}
          </View>

          {/* CWD */}
          <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-3">
            Working Directory
          </Text>
          <View className="bg-zinc-900 rounded-xl p-3 border border-zinc-800 mb-3">
            <Text className="text-zinc-300 text-xs font-mono" numberOfLines={2}>
              {settings.currentCwd}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              settings.setCwd("/data/data/dev.chelly.app/files/home/chelly/workspace")
            }
            className="bg-zinc-800 rounded-xl py-2.5 items-center active:opacity-60 mb-6"
          >
            <Text className="text-zinc-400 text-sm">Reset CWD</Text>
          </Pressable>

          {/* Safety */}
          <Text className="text-zinc-400 text-xs font-mono uppercase tracking-wider mb-3">
            Safety
          </Text>
          <Pressable
            onPress={() => settings.setAutoApproveActions(!settings.autoApproveActions)}
            className={`rounded-xl p-4 border mb-6 ${
              settings.autoApproveActions
                ? "border-yellow-500 bg-yellow-600/10"
                : "border-zinc-800 bg-zinc-900"
            }`}
          >
            <View className="flex-row items-center justify-between mb-2">
              <Text className="text-zinc-100 font-semibold">Advanced auto-run</Text>
              <Text className={settings.autoApproveActions ? "text-yellow-300" : "text-zinc-500"}>
                {settings.autoApproveActions ? "ON" : "OFF"}
              </Text>
            </View>
            <Text className="text-zinc-500 text-xs leading-5">
              OFF is recommended for kids and classrooms. When ON, Chelly can run
              approved-safe build actions without showing a confirmation card.
              Destructive or blocked actions are still refused.
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </>
  );
}
