import { View, Text, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useSettingsStore } from "@/store/settings-store";
import { STEAM_STARTERS } from "@/lib/steam-prompts";

const FEATURES = [
  { icon: "AI", text: "ローカルAIで、APIキーなしに制作を始める" },
  { icon: "▶", text: "作品をプレビューしながら、会話で改造する" },
  { icon: "{ }", text: "コード、実行ログ、理科・数学・表現の仕組みも学ぶ" },
];

export function WelcomeScreen() {
  const setOnboarded = useSettingsStore((s) => s.setOnboarded);
  const setActiveProvider = useSettingsStore((s) => s.setActiveProvider);
  const insets = useSafeAreaInsets();

  const handleStart = () => {
    setActiveProvider("local");
    setOnboarded();
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      className="bg-black"
      keyboardShouldPersistTaps="handled"
    >
      <View
        className="flex-1 px-6"
        style={{ paddingTop: insets.top + 24, paddingBottom: insets.bottom + 24 }}
      >
        {/* Title */}
        <View className="pt-8 pb-6">
          <Text className="text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3">
            Local AI STEAM Studio
          </Text>
          <Text className="text-white text-4xl font-bold font-mono mb-3">
            Chelly
          </Text>
          <Text className="text-zinc-300 text-lg font-semibold leading-7">
            作る、動かす、コードを読む。授業でそのまま使える制作スタジオ。
          </Text>
          <Text className="text-zinc-500 text-sm mt-3 leading-6">
            まず端末内のAIで始めます。クラウドAPIキーはあとから必要な場合だけ追加できます。
          </Text>
        </View>

        {/* Features */}
        <View className="gap-3 mb-7">
          {FEATURES.map((f, i) => (
            <View key={i} className="flex-row items-center gap-3 rounded-xl bg-zinc-950 border border-zinc-800 px-4 py-3">
              <View className="w-9 h-9 rounded-lg bg-zinc-800 items-center justify-center">
                <Text className="text-emerald-300 text-xs font-bold font-mono">{f.icon}</Text>
              </View>
              <Text className="text-zinc-300 text-sm flex-1 leading-5">{f.text}</Text>
            </View>
          ))}
        </View>

        <View className="mb-7">
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

        {/* Start */}
        <View className="bg-zinc-900 rounded-2xl p-5 border border-zinc-800">
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-zinc-100 font-bold">Local Gemma mode</Text>
              <Text className="text-zinc-500 text-xs mt-1">APIキーなし・端末内AIを優先</Text>
            </View>
            <View className="px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-700">
              <Text className="text-emerald-300 text-xs font-bold">Default</Text>
            </View>
          </View>
          <Pressable
            onPress={handleStart}
            className="bg-emerald-500 rounded-xl py-3 items-center active:opacity-80"
          >
            <Text className="text-black font-bold text-base">制作スタジオを開く</Text>
          </Pressable>
        </View>

        {/* Skip note */}
        <Text className="text-zinc-600 text-xs text-center mt-6">
          クラウドAIやモデル接続先はSettingsから変更できます
        </Text>
      </View>
    </ScrollView>
  );
}
