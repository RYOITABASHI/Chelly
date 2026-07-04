# Chelly Testing Setup

Chelly targets Chromebook and Windows browsers as primary surfaces, with Android
as the prototype/fallback. This document describes how to run and test Chelly on
both **PC** and **mobile** during local development.

## Prerequisites

- Node.js 20+
- pnpm 10 (via Corepack: `corepack pnpm --version`)
- For native Android testing only: Android Studio + JDK 17 (or rely on the
  GitHub Actions release APK)

```bash
corepack pnpm install --frozen-lockfile
corepack pnpm typecheck
```

## PC Test (browser, primary surface)

The Studio layout activates on `Platform.OS === "web" && width >= 900`, so any
modern desktop browser shows the full Studio workspace.

```bash
corepack pnpm exec expo start --web --host lan
```

Open `http://localhost:8081/` in Chrome / Edge / Firefox. Hot reload is enabled
when `CI` env var is **not** set.

The `--host lan` flag binds Metro to `0.0.0.0` so mobile devices on the same
Wi-Fi can reach it (see next section).

## Mobile Test — Browser (zero-install, fastest)

Same dev server. From a phone or tablet on the same Wi-Fi:

1. Find the host PC's LAN IPv4 address: `ipconfig` → `IPv4 Address` (e.g.
   `192.168.3.6`).
2. Open `http://<PC-LAN-IP>:8081/` in the mobile browser (Chrome on Android,
   Safari on iOS).
3. Reloads, console errors, and React Native Web behavior all match the PC
   browser. The narrow layout (`width < 900`) renders the chat-only stack
   instead of the Studio split view — useful for testing both layouts.

If the mobile browser cannot reach the URL:

- Confirm both devices are on the **same Wi-Fi network** (and that Wi-Fi
  isolation/AP isolation is off on the router).
- Confirm the active Windows network profile is **Private** or that Node.js has
  an inbound firewall rule on the **Public** profile.
  ```powershell
  Get-NetConnectionProfile | Select-Object Name,NetworkCategory
  Get-NetFirewallRule -DisplayName '*Node.js*' |
    Select-Object DisplayName,Direction,Action,Profile,Enabled
  ```
- If blocked, allow inbound traffic for `node.exe` on the matching profile via
  Windows Defender Firewall settings.

## Mobile Test — Native APK (full native modules)

Browser-based testing covers the React UI, Zustand stores, AI dispatch, and any
web-only providers (e.g. `browser-gemma`). It **does not** exercise the
`exec-bridge` JNI module or `voice-input`. For those, install a real APK:

### Option A — GitHub Actions release APK (no local Android SDK required)

Push to `main` (or open a PR) to trigger `.github/workflows/build-android.yml`.
The workflow runs `pnpm typecheck`, `expo prebuild`, and
`./gradlew :app:assembleRelease`, then uploads `chelly-release` as an artifact.

```bash
gh run list --workflow build-android.yml --limit 5
gh run download <run-id> -n chelly-release -D dist-apk
adb install -r dist-apk/app-release.apk
```

### Option B — Local dev build (hot reload on device)

Requires Android Studio installed and `ANDROID_HOME` exported.

```bash
corepack pnpm exec expo run:android --device
```

This produces a debug APK, installs it via `adb`, and connects the device to
the running Metro bundler for hot reload of JS changes. Native module changes
(C/Kotlin under `modules/exec-bridge/`) require a rebuild.

## Static Web Preview

`web-preview/` is a hand-written static harness that runs without Metro — useful
for quick UI prototyping or for sharing a snapshot with someone who can't run a
dev server. Open `web-preview/index.html` directly in a browser.

The full Expo web export (production-style) is built with:

```bash
corepack pnpm build:web          # → dist-web/
corepack pnpm build:web:pages    # → dist-web/ with EXPO_BASE_URL=/Chelly/
corepack pnpm deploy:pages       # builds and pushes to gh-pages
```

After `deploy:pages`, the build is live at https://ryoitabashi.github.io/Chelly/
(needs Pages enabled on `gh-pages` branch in the repo settings).

## What Each Surface Can Test

| Surface | Studio UI | Chat UI | AI dispatch | exec-bridge | voice-input | browser-gemma |
| --- | --- | --- | --- | --- | --- | --- |
| PC browser (`pnpm web`) | ✅ ≥900px | ✅ <900px | ✅ | ❌ | ❌ | ✅ (WebGPU) |
| Mobile browser (LAN) | ❌ usually <900px | ✅ | ✅ | ❌ | ❌ | ⚠️ device WebGPU |
| Local dev APK | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |
| Release APK (CI) | ❌ | ✅ | ✅ | ✅ | ✅ | ❌ |

Use the matrix to pick the surface that exercises the code path you are
changing. UI / dispatch / safety / store work goes to the PC browser first.
Native bridge and audio work goes to a real APK.

## Recommended Daily Loop

1. `corepack pnpm typecheck` after editing any TS file.
2. `corepack pnpm exec expo start --web --host lan` running in the background.
3. PC browser tab on `localhost:8081` for the Studio layout.
4. Mobile browser tab on `192.168.x.y:8081` for the chat layout.
5. Push to a feature branch when ready to validate native paths via CI APK.
