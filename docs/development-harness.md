# Chelly Development Harness

This harness exists to keep Chelly aligned with the Chromebook and Windows
first direction while the codebase is still evolving from the Android
prototype.

Use it before merging major product, UI, AI, runtime, or safety changes.

## Target Matrix

Every core workflow should be evaluated against these targets:

| Target | Priority | Expected shape |
| --- | --- | --- |
| Chromebook browser/PWA | Primary | managed classroom studio |
| Windows browser/PWA | Primary | student/home studio |
| Windows packaged shell | Later | offline local AI edition |
| macOS packaged shell | Later | same as Windows shell |
| Android app | Current/fallback | prototype and ChromeOS fallback |

Phone-size Android support is useful, but it is not the product center.

## Studio Workflow Harness

A change supports the main product only if it preserves this loop:

```text
student idea
guided choice
working artifact
preview
code/run log
explanation
tweak
learning artifact
```

For each feature, check:

- Can a student start without understanding setup?
- Is there a visible result before a long explanation?
- Can the student inspect code or execution steps?
- Does the UI work naturally on a landscape laptop screen?
- Does it avoid hiding every technical detail behind chat?

## UI Harness

Chelly UI should be evaluated as a studio, not a chatbot.

Required surfaces:

- Chat or guide panel
- Preview surface
- Code surface
- Run log surface
- Explanation surface
- Tweak/change surface

Large-screen layouts should prioritize side-by-side work. Narrow layouts may
collapse into tabs, but the desktop mental model should remain intact.

Avoid:

- phone-first chat-only flows
- decorative landing pages before the actual studio
- UI that hides code and run logs by default after generation
- feature copy that explains the app instead of letting students use it

## Local AI Harness

Chelly should default to local AI when possible.

For local AI work, verify:

- The app can start without a cloud API key.
- The selected local model name is explicit.
- Local model connection errors are actionable for teachers and students.
- Cloud providers remain optional upgrades, not the first-run requirement.
- Privacy benefits are not confused with execution safety.

Local AI does not remove the need for command safety, content safety, or
classroom guardrails.

## Runtime Harness

Generated projects should stay small, inspectable, and repeatable.

For generated artifacts, prefer:

- self-contained HTML/CSS/JavaScript labs first
- deterministic starter templates where practical
- visible preview paths
- concise run logs
- safe write locations

Avoid:

- requiring Termux for the normal student flow
- broad filesystem access
- hidden package installs during the first classroom experience
- commands that are hard for a teacher to explain

## Safety Harness

Every execution-related change should preserve:

- approval-first execution by default
- blocked destructive and credential-related actions
- clear separation between privacy safety and execution safety
- classroom-friendly wording
- safe defaults even when advanced auto-run exists

## Web Bundle Harness

Web/PWA builds break in ways that local Android builds do not catch.
Run these checks before merging anything that touches Expo config, native
modules, or the build/deploy scripts.

### Native Module Web Guards

Every `requireNativeModule(...)` call must be lazy and guarded by
`Platform.OS !== "web"`.

- An eager `const X = requireNativeModule("X")` at module scope throws
  `Cannot find native module 'X'` synchronously when the bundle is
  evaluated on web. The throw fires before React mounts and before any
  console listener attaches, so the page renders blank with no visible
  error in the browser console.
- The required pattern is a getter that returns a no-op stub on web and
  the real native module on iOS/Android. See
  `modules/exec-bridge/src/ExecBridgeModule.ts` and
  `modules/voice-input/src/VoiceInputModule.ts` for the canonical shape.
- The same rule applies to `EventEmitter` constructed from a native
  module — defer it behind the same web guard.

### Subpath Asset Verification

Pages deployments live at `https://ryoitabashi.github.io/Chelly/`, not at
the host root. After any change to `app.config.ts`, `package.json`
build scripts, or `EXPO_BASE_URL` plumbing, verify the built HTML
references `/Chelly/...` paths:

```bash
pnpm build:web:pages
grep -oE '(href|src)="[^"]+"' dist-web/index.html | head
```

Every `src` and `href` must start with `/Chelly/`. If you see paths like
`/`, `C:/...`, or `//Chelly/`, the build is broken.

Known traps:

- Plain Unix-style `EXPO_BASE_URL=/Chelly/ expo export` in
  `package.json` breaks on Windows two ways. cmd.exe rejects inline env
  prefixes. Git Bash forwards `/Chelly/` through MSYS path conversion
  and turns it into `C:/Program Files/Git/Chelly/`. Always use
  `cross-env` (already wired in).
- `output: "static"` pre-renders one HTML file per route and adds a
  hydration step that can mask boot errors as "blank with empty
  console". Default to `output: "single"` for the Pages target until
  SSR errors are properly surfaced. Add a `404.html` copy of
  `index.html` if deep-linking deeper routes matters.

### Local Subpath Reproduction

`pnpm web` and `python -m http.server dist-web` both serve at the host
root and miss subpath-only bugs. To match gh-pages, mirror the build
into a `Chelly/` folder under a separate root and serve the parent:

```bash
rm -rf dist-pages-mirror && mkdir -p dist-pages-mirror/Chelly
cp -r dist-web/. dist-pages-mirror/Chelly/
python -m http.server 5174 --directory dist-pages-mirror
# → open http://localhost:5174/Chelly/
```

The Welcome screen must render here before deploying.

### Blank Page Diagnosis

When the page is blank and the browser console is empty, the cause is
almost always a synchronous throw before React mounts. Inject an early
error probe into `dist-web/index.html` immediately after `<head>` opens:

```html
<script>
  window.__chellyErrors = [];
  window.addEventListener('error', e => window.__chellyErrors.push({
    msg: e.message, src: e.filename + ':' + e.lineno + ':' + e.colno,
    stack: e.error && e.error.stack
  }));
  window.addEventListener('unhandledrejection', e => window.__chellyErrors.push({
    reason: (e.reason && e.reason.message) || String(e.reason),
    stack: e.reason && e.reason.stack
  }));
  const _err = console.error;
  console.error = function () {
    window.__chellyErrors.push({ kind: 'console.error', args: Array.from(arguments) });
    _err.apply(console, arguments);
  };
</script>
```

Reload, then read `window.__chellyErrors` from devtools to see what
threw. Remove the probe before redeploying — `pnpm build:web:pages`
overwrites `dist-web/index.html` so a rebuild also clears it.

### Cache Busting

A successful deploy still looks blank if the browser is holding the old
broken bundle. When testing a redeploy, force-refresh:

- PC: Ctrl+F5 (Windows/Linux) / Cmd+Shift+R (macOS)
- Mobile Chrome: Settings → Privacy → Clear browsing data → Cached
  images and files
- Mobile Safari: Settings → Safari → Clear History and Website Data
- Or open in a private/incognito window to bypass cache entirely

### Pre-deploy Checklist

Run in order before `pnpm deploy:pages`:

1. `pnpm typecheck`
2. `pnpm build:web:pages`
3. `grep -oE 'src="[^"]+"' dist-web/index.html` — confirm `/Chelly/...`
4. Mirror to `dist-pages-mirror/Chelly/` and load
   `http://localhost:5174/Chelly/` — confirm Welcome screen renders
5. `pnpm deploy:pages`
6. After CDN updates (poll the live `index.html` until the new bundle
   filename appears), force-refresh and re-confirm

## Local Checks

Run these before committing code changes:

```bash
pnpm typecheck
git diff --check
```

When Android native code changes, also run the Android build:

```bash
cd android
./gradlew :app:assembleDebug
```

When web bundle, native module, or Expo config changes, also run the
Web Bundle Harness checks above.

Do not wait on GitHub Actions logs unless the task specifically requires it.

## Merge Gate

Before merging a significant change, answer these questions:

1. Does this improve the Chromebook or Windows studio experience?
2. Does it keep local AI as the default path?
3. Does it preserve the make-play-explain-tweak loop?
4. Does it keep code and run logs inspectable?
5. Does it avoid weakening classroom safety?
6. If web bundle, native module, or build script changed: does the
   built `dist-web/index.html` reference `/Chelly/...` paths and does
   the Welcome screen render at `http://localhost:5174/Chelly/`?

If the answer to any question is no, the change needs a clear product reason.
