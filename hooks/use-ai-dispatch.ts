/**
 * hooks/use-ai-dispatch.ts
 *
 * Core AI dispatch hook for Chelly.
 * Routes user messages to LLM providers, parses responses, and converts
 * proposed local actions into explicit approval cards.
 */

import { useCallback, useRef } from "react";
import {
  useChatStore,
  type ChatMessage,
  type ChatAgent,
} from "@/store/chat-store";
import { useSettingsStore } from "@/store/settings-store";
import { buildSystemPrompt } from "@/lib/system-prompt";
import { executeCommandList } from "@/lib/command-executor";
import { generateId } from "@/lib/id";
import { geminiChatStream, type GeminiMessage } from "@/lib/gemini";
import { claudeChatStream, type ClaudeMessage } from "@/lib/claude";
import { groqChatStream, type GroqMessage } from "@/lib/groq";
import { cerebrasChatStream, type CerebrasMessage } from "@/lib/cerebras";
import { perplexitySearchStream, type PerplexityMessage } from "@/lib/perplexity";
import { ollamaChatStream, type OllamaMessage } from "@/lib/local-llm";

// ─── Types ──────────────────────────────────────────────────────────────────

type Provider = "gemini" | "claude" | "groq" | "cerebras" | "perplexity" | "local";

interface ParsedResponse {
  explanation: string;
  commands: Array<{ cmd: string; desc: string }>;
}

interface SettingsSnapshot {
  activeProvider: Provider;
  geminiApiKey: string;
  claudeApiKey: string;
  groqApiKey: string;
  cerebrasApiKey: string;
  perplexityApiKey: string;
  localLlmUrl: string;
  currentCwd: string;
  autoApproveActions: boolean;
}

function missingCredentialMessage(settings: SettingsSnapshot): string | null {
  switch (settings.activeProvider) {
    case "gemini":
      return settings.geminiApiKey
        ? null
        : "Gemini APIキーが未設定です。まずSettingsでAPIキーを入れるか、ラボ一覧から「サンプルアートを開く」を使ってAPIキーなしデモを試してください。";
    case "claude":
      return settings.claudeApiKey ? null : "Claude APIキーが未設定です。SettingsでAPIキーを設定してください。";
    case "groq":
      return settings.groqApiKey ? null : "Groq APIキーが未設定です。SettingsでAPIキーを設定してください。";
    case "cerebras":
      return settings.cerebrasApiKey ? null : "Cerebras APIキーが未設定です。SettingsでAPIキーを設定してください。";
    case "perplexity":
      return settings.perplexityApiKey ? null : "Perplexity APIキーが未設定です。SettingsでAPIキーを設定してください。";
    case "local":
      return settings.localLlmUrl ? null : "Local LLM URLが未設定です。SettingsでローカルLLMのURLを設定してください。";
    default:
      return null;
  }
}

// ─── Provider routing ───────────────────────────────────────────────────────

async function routeToProvider(
  settings: SettingsSnapshot,
  systemPrompt: string,
  history: Array<{ role: string; content: string }>,
  userMessage: string,
  onChunk: (text: string) => void,
  signal: AbortSignal,
): Promise<void> {
  const { activeProvider } = settings;

  switch (activeProvider) {
    case "gemini": {
      const geminiHistory: GeminiMessage[] = history.map((m) => ({
        role: m.role === "assistant" ? "model" : "user",
        parts: [{ text: m.content }],
      }));
      const result = await geminiChatStream(
        settings.geminiApiKey,
        systemPrompt,
        geminiHistory,
        userMessage,
        (text) => onChunk(text),
        signal,
      );
      if (!result.success) throw new Error(result.error ?? "Gemini request failed.");
      break;
    }

    case "claude": {
      const claudeMessages: ClaudeMessage[] = [
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userMessage },
      ];
      const result = await claudeChatStream(
        settings.claudeApiKey,
        systemPrompt,
        claudeMessages,
        (text) => onChunk(text),
        signal,
      );
      if (!result.success) throw new Error(result.error ?? "Claude request failed.");
      break;
    }

    case "groq": {
      const groqHistory: GroqMessage[] = history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      const result = await groqChatStream(
        settings.groqApiKey,
        systemPrompt,
        groqHistory,
        userMessage,
        (text) => onChunk(text),
        signal,
      );
      if (!result.success) throw new Error(result.error ?? "Groq request failed.");
      break;
    }

    case "cerebras": {
      const cerebrasHistory: CerebrasMessage[] = history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      const result = await cerebrasChatStream(
        settings.cerebrasApiKey,
        systemPrompt,
        cerebrasHistory,
        userMessage,
        (text) => onChunk(text),
        signal,
      );
      if (!result.success) throw new Error(result.error ?? "Cerebras request failed.");
      break;
    }

    case "perplexity": {
      const pplxHistory: PerplexityMessage[] = history.map((m) => ({
        role: m.role as "user" | "assistant",
        content: m.content,
      }));
      const result = await perplexitySearchStream(
        settings.perplexityApiKey,
        systemPrompt,
        pplxHistory,
        userMessage,
        (text) => onChunk(text),
        signal,
      );
      if (!result.success) throw new Error(result.error ?? "Perplexity request failed.");
      break;
    }

    case "local": {
      const localHistory: OllamaMessage[] = [
        ...history.map((m) => ({
          role: m.role as "user" | "assistant",
          content: m.content,
        })),
        { role: "user" as const, content: userMessage },
      ];
      const result = await ollamaChatStream(
        settings.localLlmUrl,
        "default",
        systemPrompt,
        localHistory,
        (text) => onChunk(text),
        signal,
      );
      if (!result.success) throw new Error(result.error ?? "Local LLM request failed.");
      break;
    }

    default:
      throw new Error(`Unknown provider: ${activeProvider}`);
  }
}

// ─── Response parsing ───────────────────────────────────────────────────────

/**
 * Try to extract a JSON command block from the LLM response.
 * Looks for {"explanation":..., "commands":[...]} pattern.
 * Returns null if the response is plain text.
 */
function tryParseCommands(response: string): ParsedResponse | null {
  const trimmed = response.trim();

  // Try direct parse first
  try {
    const parsed = JSON.parse(trimmed);
    if (parsed && Array.isArray(parsed.commands) && parsed.commands.length > 0) {
      return {
        explanation: parsed.explanation ?? "",
        commands: parsed.commands,
      };
    }
  } catch {
    // Not pure JSON — try extracting from markdown code block or embedded JSON
  }

  // Look for JSON embedded in the response (e.g., wrapped in ```json ... ```)
  const jsonBlockMatch = trimmed.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/);
  if (jsonBlockMatch) {
    try {
      const parsed = JSON.parse(jsonBlockMatch[1]);
      if (parsed && Array.isArray(parsed.commands) && parsed.commands.length > 0) {
        return {
          explanation: parsed.explanation ?? "",
          commands: parsed.commands,
        };
      }
    } catch {}
  }

  // Look for raw JSON object in the text
  const rawJsonMatch = trimmed.match(/(\{"explanation"[\s\S]*?"commands"\s*:\s*\[[\s\S]*?\]\s*\})/);
  if (rawJsonMatch) {
    try {
      const parsed = JSON.parse(rawJsonMatch[1]);
      if (parsed && Array.isArray(parsed.commands) && parsed.commands.length > 0) {
        return {
          explanation: parsed.explanation ?? "",
          commands: parsed.commands,
        };
      }
    } catch {}
  }

  return null;
}

// ─── Hook ───────────────────────────────────────────────────────────────────

export function useAiDispatch() {
  const abortRef = useRef<AbortController | null>(null);

  const dispatch = useCallback(async (userMessage: string) => {
    const settings = useSettingsStore.getState();
    const chatStore = useChatStore.getState();
    const session = chatStore.getActiveSession();
    if (!session) return;

    // 1. Add user message to chat
    const userMsg: ChatMessage = {
      id: generateId(),
      role: "user",
      content: userMessage,
      timestamp: Date.now(),
    };
    chatStore.addMessage(session.id, userMsg);

    // 2. Create assistant placeholder (streaming)
    const assistantId = generateId();
    const assistantMsg: ChatMessage = {
      id: assistantId,
      role: "assistant",
      content: "",
      timestamp: Date.now(),
      isStreaming: true,
      streamingText: "",
      agent: settings.activeProvider as ChatAgent,
    };
    chatStore.addMessage(session.id, assistantMsg);

    const credentialError = missingCredentialMessage(settings);
    if (credentialError) {
      chatStore.updateMessage(session.id, assistantId, {
        content: credentialError,
        isStreaming: false,
        streamingText: undefined,
        agent: settings.activeProvider as ChatAgent,
      });
      return;
    }

    // 3. Build context (last 20 messages, 500 char truncation)
    const history = session.messages.slice(-20).map((m) => ({
      role: m.role === "system" ? "user" : m.role,
      content: m.content.slice(0, 500),
    }));

    // 4. Build system prompt
    const systemPrompt = buildSystemPrompt(settings.currentCwd);

    // 5. Stream from LLM
    const abort = new AbortController();
    abortRef.current = abort;
    let fullResponse = "";

    const onChunk = (text: string) => {
      fullResponse += text;
      chatStore.updateMessage(session.id, assistantId, {
        streamingText: fullResponse,
      });
    };

    try {
      await routeToProvider(
        settings,
        systemPrompt,
        history,
        userMessage,
        onChunk,
        abort.signal,
      );

      // 6. Parse response for commands
      const parsed = tryParseCommands(fullResponse);

      if (parsed && parsed.commands.length > 0) {
        if (settings.autoApproveActions) {
          const executions = await executeCommandList(parsed.commands, settings.currentCwd);
          chatStore.updateMessage(session.id, assistantId, {
            content: parsed.explanation || fullResponse,
            executions,
            isStreaming: false,
            streamingText: undefined,
          });
          return;
        }

        // Education mode is approval-first by default: the AI may propose
        // actions, but Chelly does not execute them until explicit approval.
        chatStore.updateMessage(session.id, assistantId, {
          content: parsed.explanation || fullResponse,
          safetyConfirm: {
            commands: parsed.commands,
            status: "pending",
          },
          isStreaming: false,
          streamingText: undefined,
        });
      } else {
        // Plain text response
        chatStore.updateMessage(session.id, assistantId, {
          content: fullResponse,
          isStreaming: false,
          streamingText: undefined,
        });
      }
    } catch (error: any) {
      chatStore.updateMessage(session.id, assistantId, {
        content: fullResponse || "エラーが発生しました",
        error: error.message,
        isStreaming: false,
        streamingText: undefined,
      });
    } finally {
      abortRef.current = null;
    }
  }, []);

  const cancel = useCallback(() => {
    abortRef.current?.abort();
    abortRef.current = null;
  }, []);

  return { dispatch, cancel };
}
