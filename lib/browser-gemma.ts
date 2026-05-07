import { Platform } from "react-native";

export interface BrowserGemmaMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export interface BrowserGemmaResult {
  success: boolean;
  content?: string;
  error?: string;
}

type BrowserNavigator = Navigator & {
  gpu?: unknown;
};

let cachedPipeline: any;
let cachedModel = "";

const TRANSFORMERS_CDN =
  "https://cdn.jsdelivr.net/npm/@huggingface/transformers@4.2.0/dist/transformers.min.js";

export function getBrowserGemmaSupport(): {
  available: boolean;
  reason?: string;
} {
  if (Platform.OS !== "web") {
    return { available: false, reason: "Browser Gemma runs only in the web app." };
  }

  const nav = globalThis.navigator as BrowserNavigator | undefined;
  if (!nav?.gpu) {
    return {
      available: false,
      reason: "WebGPU is not available in this browser.",
    };
  }

  return { available: true };
}

function extractGeneratedText(output: unknown): string {
  const first = Array.isArray(output) ? output[0] : output;
  const generated = (first as any)?.generated_text;

  if (typeof generated === "string") return generated;

  if (Array.isArray(generated)) {
    const last = [...generated].reverse().find((item) => item?.role === "assistant");
    if (typeof last?.content === "string") return last.content;
    const text = generated
      .map((item) => item?.content)
      .filter((item) => typeof item === "string")
      .join("\n");
    if (text) return text;
  }

  return typeof first === "string" ? first : "";
}

export async function browserGemmaChat(
  model: string,
  systemPrompt: string,
  history: BrowserGemmaMessage[],
  userMessage: string,
  onChunk: (text: string) => void,
  signal?: AbortSignal,
): Promise<BrowserGemmaResult> {
  const support = getBrowserGemmaSupport();
  if (!support.available) return { success: false, error: support.reason };

  if (signal?.aborted) return { success: false, error: "Request cancelled." };

  try {
    // Keep Transformers.js out of the Expo/Metro bundle for now. The current
    // onnxruntime-web WebGPU build uses import patterns Metro cannot export.
    // Browser Gemma is an experimental research mode, so load it at runtime.
    const dynamicImport = new Function("specifier", "return import(specifier)") as (
      specifier: string,
    ) => Promise<any>;
    const { pipeline, env } = await dynamicImport(TRANSFORMERS_CDN);
    env.allowLocalModels = false;

    if (!cachedPipeline || cachedModel !== model) {
      cachedPipeline = await pipeline("text-generation", model, {
        device: "webgpu",
      } as any);
      cachedModel = model;
    }

    const messages: BrowserGemmaMessage[] = [
      { role: "system", content: systemPrompt },
      ...history,
      { role: "user", content: userMessage },
    ];

    const output = await cachedPipeline(messages, {
      max_new_tokens: 1024,
      temperature: 0.7,
      do_sample: true,
    });

    if (signal?.aborted) return { success: false, error: "Request cancelled." };

    const content = extractGeneratedText(output).trim();
    if (!content) return { success: false, error: "Browser Gemma returned no text." };

    onChunk(content);
    return { success: true, content };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : String(error),
    };
  }
}
