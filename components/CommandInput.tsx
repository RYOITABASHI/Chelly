import { useEffect, useRef, useState } from "react";
import { Keyboard, Platform, Pressable, Text, TextInput, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Props = {
  onSend: (text: string) => void;
  isStreaming?: boolean;
  onCancel?: () => void;
};

export function CommandInput({ onSend, isStreaming, onCancel }: Props) {
  const [text, setText] = useState("");
  const [keyboardInset, setKeyboardInset] = useState(0);
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (Platform.OS !== "android") return;

    const show = Keyboard.addListener("keyboardDidShow", (event) => {
      setKeyboardInset(Math.max(0, event.endCoordinates.height - insets.bottom));
    });
    const hide = Keyboard.addListener("keyboardDidHide", () => setKeyboardInset(0));

    return () => {
      show.remove();
      hide.remove();
    };
  }, [insets.bottom]);

  const handleSend = () => {
    const trimmed = text.trim();
    if (!trimmed || isStreaming) return;
    onSend(trimmed);
    setText("");
  };

  const handleCancel = () => {
    onCancel?.();
  };

  return (
    <View
      className="bg-zinc-950 border-t border-zinc-800 px-3 pt-2"
      style={{
        paddingBottom: Math.max(insets.bottom, 12),
        marginBottom: keyboardInset,
      }}
    >
      <View className="flex-row items-end gap-2">
        <Pressable
          className="w-10 h-10 items-center justify-center rounded-full bg-zinc-900 border border-zinc-800 active:opacity-60"
          accessibilityLabel="Voice input"
        >
          <Text className="text-zinc-400 text-xs font-bold">mic</Text>
        </Pressable>

        <View className="flex-1 bg-zinc-900 rounded-2xl border border-zinc-800 px-4 py-2 min-h-[40px] max-h-[120px]">
          <TextInput
            ref={inputRef}
            value={text}
            onChangeText={setText}
            placeholder="作りたい作品や、変えたい動きを書く..."
            placeholderTextColor="#71717a"
            className="text-white text-sm"
            multiline
            returnKeyType="default"
            blurOnSubmit={false}
            editable={!isStreaming}
          />
        </View>

        {isStreaming ? (
          <Pressable
            onPress={handleCancel}
            className="w-10 h-10 items-center justify-center rounded-full bg-red-600 active:opacity-60"
            accessibilityLabel="Cancel"
          >
            <Text className="text-white text-sm font-bold">{"\u25A0"}</Text>
          </Pressable>
        ) : (
          <Pressable
            onPress={handleSend}
            disabled={!text.trim()}
            className={`w-10 h-10 items-center justify-center rounded-full active:opacity-60 ${
              text.trim() ? "bg-emerald-500" : "bg-zinc-800"
            }`}
            accessibilityLabel="Send"
          >
            <Text className={text.trim() ? "text-black text-lg" : "text-zinc-500 text-lg"}>
              {"\u2191"}
            </Text>
          </Pressable>
        )}
      </View>
    </View>
  );
}
