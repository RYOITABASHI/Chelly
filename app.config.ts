import type { ExpoConfig } from "expo/config";

const config: ExpoConfig = {
  name: "Chelly",
  slug: "chelly",
  version: "1.0.0",
  orientation: "default",
  icon: "./assets/icon.png",
  scheme: "chelly",
  userInterfaceStyle: "automatic",
  newArchEnabled: true,
  experiments: {
    baseUrl: process.env.EXPO_BASE_URL ?? "/",
  },
  web: {
    bundler: "metro",
    output: "single",
  },
  android: {
    adaptiveIcon: {
      foregroundImage: "./assets/adaptive-icon.png",
      backgroundColor: "#000000",
    },
    package: "dev.chelly.app",
    permissions: ["android.permission.RECORD_AUDIO"],
  },
  plugins: ["expo-secure-store", "expo-router"],
};

export default config;
