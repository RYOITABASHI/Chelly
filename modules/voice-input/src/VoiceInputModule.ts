import { requireNativeModule, EventEmitter } from "expo-modules-core";
import { Platform } from "react-native";

type VoiceInputNative = {
  startListening: (locale: string) => void;
  stopListening: () => void;
};

type Subscription = { remove: () => void };

const noopSubscription: Subscription = { remove: () => {} };

let cachedModule: VoiceInputNative | null = null;
let cachedEmitter: any = null;

function getNative(): VoiceInputNative {
  if (cachedModule) return cachedModule;
  if (Platform.OS === "web") {
    cachedModule = {
      startListening: () => {},
      stopListening: () => {},
    };
  } else {
    cachedModule = requireNativeModule("VoiceInput") as VoiceInputNative;
  }
  return cachedModule;
}

function getEmitter(): any {
  if (Platform.OS === "web") return null;
  if (!cachedEmitter) cachedEmitter = new (EventEmitter as any)(getNative());
  return cachedEmitter;
}

export function startListening(locale?: string): void {
  getNative().startListening(locale ?? "");
}

export function stopListening(): void {
  getNative().stopListening();
}

export function addResultListener(
  callback: (event: { text: string }) => void,
): Subscription {
  const emitter = getEmitter();
  if (!emitter) return noopSubscription;
  return (emitter as any).addListener("onResult", callback);
}

export function addErrorListener(
  callback: (event: { message: string }) => void,
): Subscription {
  const emitter = getEmitter();
  if (!emitter) return noopSubscription;
  return (emitter as any).addListener("onError", callback);
}
