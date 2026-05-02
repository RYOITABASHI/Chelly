import { useState } from "react";
import { View, Text, TextInput, Pressable, Linking, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingsStore } from "@/store/settings-store";
import { STEAM_STARTERS } from "@/lib/steam-prompts";

const AI_STUDIO_URL = "https://aistudio.google.com/apikey";

const FEATURES = [
  { icon: "💡", text: "作りたいものを自然言語で伝える" },
  { icon: "🎨", text: "音・光・動きのデジタルアートも作れる" },
  { icon: "📚", text: "コード・理科・音楽・表現の仕組みをAIが解説" },
];

export function WelcomeScreen() {
  const [apiKey, setApiKey] = useState("");
  const [error, setError] = useState("");
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);
  const setApiKeyStore = useSettingsStore((s) => s.setApiKey);
  const insets = useSafeAreaInsets();

  const handleStart = async () => {
    const trimmed = apiKey.trim();
    if (!trimmed) {
      setError("APIキーを入力してください");
      return;
    }
    if (trimmed.length < 20) {
      setError("APIキーが短すぎます");
      return;
    }
    try {
      await setApiKeyStore("gemini", trimmed);
      setOnboarded();
    } catch (e) {
      setError("保存に失敗しました");
    }
  };

  const handleDemo = () => {
    setOnboarded();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-black"
      keyboardShouldPersistTaps="handled"
    >
      <View
        className="flex-1 justify-center px-8"
        style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
      >
        {/* Title */}
        <Text className="text-white text-4xl font-bold text-center font-mono mb-2">
          Chelly
        </Text>
        <Text className="text-zinc-300 text-center text-base font-semibold mb-2">
          AI STEAM Creation Studio
        </Text>
        <Text className="text-zinc-500 text-center text-sm mb-8">
          作りたい気持ちから始めて、あとから仕組みを学ぶ
        </Text>

        {/* Features */}
        <View className="gap-4 mb-10">
          {FEATURES.map((f, i) => (
            <View key={i} className="flex-row items-center gap-3">
              <Text className="text-2xl">{f.icon}</Text>
              <Text className="text-zinc-300 text-sm flex-1">{f.text}</Text>
            </View>
          ))}
        </View>

        <View className="mb-8">
          <Text className="text-zinc-400 text-xs uppercase tracking-widest mb-3">
            Starter Labs
          </Text>
          <View className="gap-3">
            {STEAM_STARTERS.map((starter) => (
              <View
                key={starter.title}
                className="bg-zinc-900/70 rounded-2xl p-4 border border-zinc-800"
              >
                <View className="flex-row items-center gap-3 mb-1">
                  <Text className="text-2xl">{starter.icon}</Text>
                  <Text className="text-white font-bold flex-1">{starter.title}</Text>
                  <Text className="text-zinc-500 text-xs">{starter.ageBand}</Text>
                </View>
                <Text className="text-zinc-500 text-xs ml-9">{starter.learn}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* API Key section */}
        <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <Text className="text-zinc-300 text-sm mb-3">
            始めるには、Gemini APIキーが必要です
          </Text>

          <Pressable
            onPress={() => Linking.openURL(AI_STUDIO_URL)}
            className="mb-4 active:opacity-60"
          >
            <Text className="text-indigo-400 text-sm underline">
              AI Studioでキーを取得 {"\u2197"}
            </Text>
          </Pressable>

          <TextInput
            value={apiKey}
            onChangeText={(t) => {
              setApiKey(t);
              setError("");
            }}
            placeholder="APIキーを貼り付け..."
            placeholderTextColor="#52525b"
            className="bg-zinc-800 text-white rounded-xl px-4 py-3 text-sm border border-zinc-700/50 mb-3 font-mono"
            secureTextEntry
            autoCapitalize="none"
            autoCorrect={false}
          />

          {error ? (
            <Text className="text-red-400 text-xs mb-2">{error}</Text>
          ) : null}

          <Pressable
            onPress={handleStart}
            className="bg-indigo-600 rounded-xl py-3 items-center active:opacity-80"
          >
            <Text className="text-white font-bold text-base">始める</Text>
          </Pressable>

          <Pressable
            onPress={handleDemo}
            className="mt-3 bg-zinc-800 rounded-xl py-3 items-center active:opacity-80"
          >
            <Text className="text-zinc-200 font-bold text-base">
              APIキーなしでデモを見る
            </Text>
          </Pressable>
        </View>

        {/* Skip note */}
        <Text className="text-zinc-600 text-xs text-center mt-6">
          先生・保護者がAPIキーを設定すれば、すぐに実験を始められます
        </Text>
      </View>
    </ScrollView>
  );
}
