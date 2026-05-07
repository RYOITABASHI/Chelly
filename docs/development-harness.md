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

Do not wait on GitHub Actions logs unless the task specifically requires it.

## Merge Gate

Before merging a significant change, answer these questions:

1. Does this improve the Chromebook or Windows studio experience?
2. Does it keep local AI as the default path?
3. Does it preserve the make-play-explain-tweak loop?
4. Does it keep code and run logs inspectable?
5. Does it avoid weakening classroom safety?

If the answer to any question is no, the change needs a clear product reason.
