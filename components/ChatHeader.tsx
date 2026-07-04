import { View, Text, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onClearChat: () => void;
  onBackToLabs?: () => void;
  showBackToLabs?: boolean;
};

export function ChatHeader({ onClearChat, onBackToLabs, showBackToLabs }: Props) {
  const router = useRouter();
  const insets = useSafeAreaInsets();

  return (
    <View
      className="bg-zinc-950 border-b border-zinc-800 px-4 pb-3 flex-row items-center justify-between"
      style={{ paddingTop: insets.top + 8 }}
    >
      <View className="flex-row items-center gap-3">
        {showBackToLabs ? (
          <Pressable
            onPress={onBackToLabs}
            className="py-2 pr-1 active:opacity-60"
            accessibilityLabel="Back to labs"
          >
            <Text className="text-emerald-400 text-base">← Labs</Text>
          </Pressable>
        ) : null}
        <View>
          <Text className="text-white text-lg font-bold font-mono tracking-wider">
            Chelly Studio
          </Text>
          <Text className="text-zinc-500 text-[10px] uppercase tracking-widest">
            Local AI STEAM Workspace
          </Text>
        </View>
      </View>
      <View className="flex-row items-center gap-4">
        {/* Clear chat */}
        <Pressable
          onPress={onClearChat}
          className="p-2 active:opacity-60"
          accessibilityLabel="Clear chat"
        >
          <Text className="text-zinc-400 text-base">{"\uD83D\uDDD1"}</Text>
        </Pressable>
        {/* Settings */}
        <Pressable
          onPress={() => router.push("/settings")}
          className="p-2 active:opacity-60"
          accessibilityLabel="Settings"
        >
          <Text className="text-zinc-400 text-base">{"\u2699\uFE0F"}</Text>
        </Pressable>
      </View>
    </View>
  );
}
