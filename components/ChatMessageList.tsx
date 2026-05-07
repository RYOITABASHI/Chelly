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
      <View className="flex-1 px-5 py-6">
        <View className="mb-5 rounded-2xl bg-zinc-950 border border-zinc-800 p-5">
          <Text className="text-emerald-300 text-xs font-mono uppercase tracking-widest mb-3">
            Create first, learn after
          </Text>
          <Text className="text-white text-2xl font-bold mb-2">
            何を作って、どう動かしてみる？
          </Text>
          <Text className="text-zinc-500 text-sm leading-6">
            Chellyは作品、コード、実行ログ、しくみの説明を1つの制作スタジオで扱います。
          </Text>
        </View>

        <View className="gap-3">
          <Pressable
            onPress={onOpenSample}
            className="bg-emerald-500 rounded-2xl p-4 active:opacity-70"
          >
            <Text className="text-black font-bold text-base">サンプルアートを開く</Text>
            <Text className="text-emerald-950 text-xs mt-1">
              AI応答を待たずに、作品・コード・しくみタブを確認します。
            </Text>
          </Pressable>

          {STEAM_STARTERS.map((starter) => (
            <Pressable
              key={starter.title}
              onPress={() => onStarterPress?.(starter.prompt)}
              className="bg-zinc-950 rounded-2xl p-4 border border-zinc-800 active:opacity-70"
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
