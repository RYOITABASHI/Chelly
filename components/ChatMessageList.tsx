import { useCallback, useRef } from "react";
import { FlatList, View, Text, Pressable } from "react-native";
import { ChatBubble } from "./ChatBubble";
import type { ChatMessage } from "@/store/chat-store";
import { STEAM_STARTERS } from "@/lib/steam-prompts";

type Props = {
  messages: ChatMessage[];
  onStarterPress?: (prompt: string) => void;
  onOpenSample?: () => void;
  onApprove?: (msgId: string) => void;
  onReject?: (msgId: string) => void;
};

export function ChatMessageList({
  messages,
  onStarterPress,
  onOpenSample,
  onApprove,
  onReject,
}: Props) {
  const listRef = useRef<FlatList>(null);

  // Reverse for inverted list (newest at bottom)
  const reversed = [...messages].reverse();

  const renderItem = useCallback(
    ({ item }: { item: ChatMessage }) => (
      <ChatBubble
        message={item}
        onApprove={onApprove}
        onReject={onReject}
      />
    ),
    [onApprove, onReject],
  );

  const keyExtractor = useCallback((item: ChatMessage) => item.id, []);

  if (messages.length === 0) {
    return (
      <View className="flex-1 justify-center px-6">
        <Text className="text-white text-2xl text-center font-bold mb-2">
          何を作ってみる？
        </Text>
        <Text className="text-zinc-500 text-sm text-center mb-8">
          まず動くものを作って、あとから仕組みを学ぼう。
        </Text>

        <View className="gap-3">
          <Pressable
            onPress={onOpenSample}
            className="bg-emerald-600 rounded-2xl p-4 active:opacity-70"
          >
            <Text className="text-white font-bold text-base">🎛️ サンプルアートを開く</Text>
            <Text className="text-emerald-100/80 text-xs mt-1">
              API応答なしで、音に反応する光のアートをテストします。
            </Text>
          </Pressable>

          {STEAM_STARTERS.map((starter) => (
            <Pressable
              key={starter.title}
              onPress={() => onStarterPress?.(starter.prompt)}
              className="bg-zinc-900 rounded-2xl p-4 border border-zinc-800 active:opacity-70"
            >
              <View className="flex-row items-center gap-3 mb-2">
                <Text className="text-2xl">{starter.icon}</Text>
                <View className="flex-1">
                  <Text className="text-white font-bold">{starter.title}</Text>
                  <Text className="text-zinc-500 text-xs mt-1">{starter.ageBand}</Text>
                </View>
                <Text className="text-indigo-400 text-lg">{"\u2192"}</Text>
              </View>
              <Text className="text-zinc-500 text-xs ml-9">{starter.learn}</Text>
            </Pressable>
          ))}
        </View>
      </View>
    );
  }

  return (
    <FlatList
      ref={listRef}
      data={reversed}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      inverted
      contentContainerStyle={{ paddingVertical: 12 }}
      showsVerticalScrollIndicator={false}
      keyboardDismissMode="interactive"
      keyboardShouldPersistTaps="handled"
    />
  );
}
