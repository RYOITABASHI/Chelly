import { create } from "zustand";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";

type Provider = "gemini" | "claude" | "groq" | "cerebras" | "perplexity" | "local";

type SettingsStore = {
  activeProvider: Provider;
  geminiApiKey: string;
  claudeApiKey: string;
  groqApiKey: string;
  cerebrasApiKey: string;
  perplexityApiKey: string;
  localLlmUrl: string;
  currentCwd: string;
  autoApproveActions: boolean;
  isOnboarded: boolean;
  isLoaded: boolean;
  load: () => Promise<void>;
  save: () => Promise<void>;
  setApiKey: (provider: Provider, key: string) => Promise<void>;
  setActiveProvider: (provider: Provider) => void;
  setCwd: (cwd: string) => void;
  setAutoApproveActions: (enabled: boolean) => void;
  setOnboarded: () => void;
};

const CHELLY_HOME = "/data/data/dev.chelly.app/files/home";
const DEFAULT_CWD = `${CHELLY_HOME}/chelly/workspace`;
const SETTINGS_KEY = "chelly_settings";

function normalizeCwd(cwd: string | undefined): string {
  if (!cwd) return DEFAULT_CWD;
  // Migrate old prototype settings that assumed Termux as the host runtime.
  if (cwd.includes("/data/data/com.termux/")) return DEFAULT_CWD;
  return cwd;
}

export const useSettingsStore = create<SettingsStore>((set, get) => ({
  activeProvider: "gemini",
  geminiApiKey: "",
  claudeApiKey: "",
  groqApiKey: "",
  cerebrasApiKey: "",
  perplexityApiKey: "",
  localLlmUrl: "",
  currentCwd: DEFAULT_CWD,
  autoApproveActions: false,
  isOnboarded: false,
  isLoaded: false,

  load: async () => {
    try {
      const raw = await AsyncStorage.getItem(SETTINGS_KEY);
      const data = raw ? JSON.parse(raw) : {};
      const geminiApiKey = await SecureStore.getItemAsync("chelly_gemini_key") ?? "";
      const claudeApiKey = await SecureStore.getItemAsync("chelly_claude_key") ?? "";
      const groqApiKey = await SecureStore.getItemAsync("chelly_groq_key") ?? "";
      const cerebrasApiKey = await SecureStore.getItemAsync("chelly_cerebras_key") ?? "";
      const perplexityApiKey = await SecureStore.getItemAsync("chelly_perplexity_key") ?? "";
      set({
        activeProvider: data.activeProvider ?? "gemini",
        localLlmUrl: data.localLlmUrl ?? "",
        currentCwd: normalizeCwd(data.currentCwd),
        autoApproveActions: data.autoApproveActions ?? false,
        isOnboarded: data.isOnboarded ?? false,
        geminiApiKey, claudeApiKey, groqApiKey, cerebrasApiKey, perplexityApiKey,
        isLoaded: true,
      });
    } catch { set({ isLoaded: true }); }
  },

  save: async () => {
    const s = get();
    await AsyncStorage.setItem(SETTINGS_KEY, JSON.stringify({
      activeProvider: s.activeProvider,
      localLlmUrl: s.localLlmUrl,
      currentCwd: s.currentCwd,
      autoApproveActions: s.autoApproveActions,
      isOnboarded: s.isOnboarded,
    }));
  },

  setApiKey: async (provider, key) => {
    await SecureStore.setItemAsync(`chelly_${provider}_key`, key);
    set({ [`${provider}ApiKey`]: key } as any);
  },

  setActiveProvider: (provider) => { set({ activeProvider: provider }); get().save(); },
  setCwd: (cwd) => { set({ currentCwd: cwd }); get().save(); },
  setAutoApproveActions: (enabled) => { set({ autoApproveActions: enabled }); get().save(); },
  setOnboarded: () => { set({ isOnboarded: true }); get().save(); },
}));
