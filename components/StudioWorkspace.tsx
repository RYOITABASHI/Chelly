import { useMemo, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import type { ChatMessage } from "@/store/chat-store";
import { ChatMessageList } from "@/components/ChatMessageList";
import { CommandInput } from "@/components/CommandInput";
import { STEAM_STARTERS } from "@/lib/steam-prompts";

type StudioTab = "preview" | "code" | "runlog" | "explain" | "tweak";

type Props = {
  messages: ChatMessage[];
  isStreaming: boolean;
  onSend: (text: string) => void;
  onCancel: () => void;
  onOpenSample: () => void;
  onApprove: (msgId: string) => void;
  onReject: (msgId: string) => void;
};

const TABS: Array<{ id: StudioTab; label: string }> = [
  { id: "preview", label: "Preview" },
  { id: "code", label: "Code" },
  { id: "runlog", label: "Run Log" },
  { id: "explain", label: "Explain" },
  { id: "tweak", label: "Tweak" },
];

export function StudioWorkspace({
  messages,
  isStreaming,
  onSend,
  onCancel,
  onOpenSample,
  onApprove,
  onReject,
}: Props) {
  const [activeTab, setActiveTab] = useState<StudioTab>("preview");

  const executions = useMemo(
    () => messages.flatMap((message) => message.executions ?? []),
    [messages],
  );
  const lastAssistant = useMemo(
    () => [...messages].reverse().find((message) => message.role === "assistant"),
    [messages],
  );

  return (
    <View className="flex-1 bg-black">
      <View className="flex-1 flex-row">
        <View className="w-[34%] min-w-[360px] max-w-[520px] border-r border-zinc-800 bg-zinc-950">
          <View className="px-5 py-4 border-b border-zinc-800">
            <Text className="text-emerald-300 text-xs font-mono uppercase tracking-widest">
              Chelly Web Studio
            </Text>
            <Text className="text-white text-2xl font-bold mt-1">Create Lab</Text>
            <Text className="text-zinc-500 text-sm mt-2 leading-5">
              会話で作り、右側で作品・コード・実行ログ・しくみを確認します。
            </Text>
          </View>

          <View className="flex-1">
            <ChatMessageList
              messages={messages}
              onStarterPress={onSend}
              onOpenSample={onOpenSample}
              onApprove={onApprove}
              onReject={onReject}
            />
          </View>

          <CommandInput onSend={onSend} isStreaming={isStreaming} onCancel={onCancel} />
        </View>

        <View className="flex-1 bg-black">
          <View className="px-5 py-4 border-b border-zinc-800 bg-zinc-950">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-xl font-bold">Studio Surface</Text>
                <Text className="text-zinc-500 text-xs mt-1">
                  Chromebook / Windows first workspace
                </Text>
              </View>
              <Pressable
                onPress={onOpenSample}
                className="px-4 py-2 rounded-lg bg-emerald-500 active:opacity-80"
              >
                <Text className="text-black font-bold text-sm">Open Sample</Text>
              </Pressable>
            </View>

            <View className="flex-row gap-2 mt-4">
              {TABS.map((tab) => {
                const selected = activeTab === tab.id;
                return (
                  <Pressable
                    key={tab.id}
                    onPress={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 rounded-lg border ${
                      selected ? "bg-zinc-100 border-zinc-100" : "bg-zinc-900 border-zinc-800"
                    }`}
                  >
                    <Text className={selected ? "text-black font-bold" : "text-zinc-400"}>
                      {tab.label}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View className="flex-1">
            {activeTab === "preview" ? (
              <View className="flex-1 p-5">
                <View className="flex-1 rounded-xl border border-zinc-800 bg-zinc-950 overflow-hidden">
                  <View className="px-4 py-3 border-b border-zinc-800 flex-row items-center justify-between">
                    <Text className="text-zinc-300 font-bold">Artifact Preview</Text>
                    <Text className="text-zinc-600 text-xs font-mono">HTML / Canvas / Game</Text>
                  </View>
                  <View className="flex-1 items-center justify-center px-8">
                    <Text className="text-white text-3xl font-bold text-center">
                      作品プレビュー
                    </Text>
                    <Text className="text-zinc-500 text-center mt-3 leading-6 max-w-[560px]">
                      生成された作品はここに表示します。今はサンプル作品を開くと既存のPreview画面で
                      作品・しくみ・コード・改造ポイントを確認できます。
                    </Text>
                  </View>
                </View>
              </View>
            ) : activeTab === "code" ? (
              <ScrollView className="flex-1" contentContainerClassName="p-5">
                <Text className="text-white text-2xl font-bold">Code</Text>
                <Text className="text-zinc-500 mt-2 leading-6">
                  Web Studioでは、生成されたHTML/CSS/JavaScriptをここで読みます。
                  まずは自己完結HTMLのStarter Labを中心にします。
                </Text>
                <View className="mt-5 rounded-xl bg-zinc-950 border border-zinc-800 p-4">
                  <Text selectable className="text-zinc-300 font-mono text-xs leading-5">
                    {`// Next target
// 1. Generate ./labs/<lab-name>/index.html
// 2. Show the artifact in Preview
// 3. Highlight code lines that explain motion, sound, math, and interaction`}
                  </Text>
                </View>
              </ScrollView>
            ) : activeTab === "runlog" ? (
              <ScrollView className="flex-1" contentContainerClassName="p-5">
                <Text className="text-white text-2xl font-bold">Run Log</Text>
                <Text className="text-zinc-500 mt-2 leading-6">
                  AIが提案し、承認後に実行されたステップを授業で読める形で残します。
                </Text>
                <View className="mt-5 gap-3">
                  {executions.length ? (
                    executions.map((execution, index) => (
                      <View key={`${execution.command}-${index}`} className="rounded-xl bg-zinc-950 border border-zinc-800 p-4">
                        <Text className="text-emerald-300 font-mono text-xs">$ {execution.command}</Text>
                        <Text className="text-zinc-400 font-mono text-xs mt-2" numberOfLines={12}>
                          {execution.output || "(no output)"}
                        </Text>
                      </View>
                    ))
                  ) : (
                    <Text className="text-zinc-600">まだ実行ログはありません。</Text>
                  )}
                </View>
              </ScrollView>
            ) : activeTab === "explain" ? (
              <ScrollView className="flex-1" contentContainerClassName="p-5">
                <Text className="text-white text-2xl font-bold">Explain</Text>
                <Text className="text-zinc-500 mt-2 leading-6">
                  作品を動かしたあとで、コード・理科・数学・音・表現の仕組みを分解します。
                </Text>
                <View className="mt-5 rounded-xl bg-zinc-950 border border-zinc-800 p-4">
                  <Text className="text-zinc-300 leading-6">
                    {lastAssistant?.content ||
                      lastAssistant?.streamingText ||
                      "Starter Labを選ぶと、AIの説明と学習ポイントがここに集まります。"}
                  </Text>
                </View>
              </ScrollView>
            ) : (
              <ScrollView className="flex-1" contentContainerClassName="p-5">
                <Text className="text-white text-2xl font-bold">Tweak</Text>
                <Text className="text-zinc-500 mt-2 leading-6">
                  作品を壊しにくい順番で、数字・色・ルール・動きを変える実験を提案します。
                </Text>
                <View className="mt-5 gap-3">
                  {STEAM_STARTERS.slice(0, 3).map((starter) => (
                    <Pressable
                      key={starter.title}
                      onPress={() => onSend(starter.prompt)}
                      className="rounded-xl bg-zinc-950 border border-zinc-800 p-4 active:opacity-70"
                    >
                      <Text className="text-white font-bold">{starter.title}</Text>
                      <Text className="text-zinc-500 text-xs mt-2">{starter.learn}</Text>
                    </Pressable>
                  ))}
                </View>
              </ScrollView>
            )}
          </View>
        </View>
      </View>
    </View>
  );
}
