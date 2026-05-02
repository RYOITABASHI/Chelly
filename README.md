# Chelly

AI STEAM creation studio for kids, teens, teachers, artists, and
non-engineers.

[![Build](https://github.com/RYOITABASHI/Chelly/actions/workflows/build-android.yml/badge.svg)](https://github.com/RYOITABASHI/Chelly/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

## What is Chelly?

Chelly helps students start with what they want to make, not with syntax,
setup, or a blank editor.

Describe an idea in natural language. Chelly creates a small project,
experiment, simulation, digital artwork, sound piece, game, or visual
explanation. Then it explains the code, science, math, music, and design behind
it step by step.

```text
I want to make a rocket landing game.
↓
Chelly builds a small playable project.
↓
The student plays with it.
↓
Chelly explains gravity, velocity, fuel, and collision.
↓
The student changes values and learns by modifying the thing they wanted.
```

Chelly is inspired by the original direction behind
[Shelly](https://github.com/RYOITABASHI/Shelly). Shelly became the native
Android AI terminal IDE needed to make serious CLI work possible on Android.
Chelly brings that idea back to the surface for STEAM education: creation
first, code and explanation second.

## Product Principles

- **Natural language first** — students describe what they want to build.
- **Guided choices** — Chelly asks one useful question and gives concrete
  options instead of silently deciding everything.
- **Make before teaching** — show a working thing before explaining syntax.
- **Explain after** — reveal code, science, and math only after there is
  something to care about.
- **Art is first-class** — music, sound, motion, color, visual systems, and
  generative art are core subjects, not side demos.
- **Tweak to learn** — students change values, rules, and behavior to see what
  happens.
- **No Termux requirement** — Chelly should run from the app sandbox. The goal
  is install, paste an API key, and start creating.
- **Safe by default** — destructive operations require explicit confirmation.
- **Advanced escape hatch** — motivated learners can enable auto-run in
  Settings, but destructive and blocked actions still stay blocked.

## Education Package Direction

Chelly is being developed toward an education-ready package, not just a
consumer chatbot.

The long-term target is a platform that schools, coding programs, maker spaces,
and education partners can evaluate and deploy:

- safe default mode for classrooms
- teacher/guardian friendly onboarding
- no external Termux setup for normal use
- guided student choices instead of blind AI generation
- age-level explanations
- repeatable starter labs
- exportable learning artifacts
- clear security and privacy model

See [docs/product-strategy.md](docs/product-strategy.md) for the product
strategy.

## Starter Labs

The first Chelly experience is built around small labs:

| Lab | What students make | What they learn |
| --- | --- | --- |
| Sound Reactive Art Lab | A visual artwork that reacts to sound | sound, color, frequency, motion, generative art |
| Generative Pattern Lab | A living pattern system | repetition, randomness, rhythm, composition |
| Rocket Landing Lab | A 2D moon landing game | gravity, velocity, fuel, collision, conditions |
| Sound Lab | A sound visualizer | waveform, volume, frequency, graphs |
| Jump Game Lab | A character jump game | position, velocity, gravity, game loops |

These are intentionally small. Chelly should make the first working version
quickly, then guide the student through changes.

## Guided Creation UX

Chelly should feel closer to a creative coach than a blank chatbot.

For broad ideas, Chelly first asks a single question with concrete choices:

```text
What kind of rocket landing game do you want?

1. Easy moon landing (recommended) — simple gravity and fuel.
2. Hard mode — stronger gravity and limited fuel.
3. Mars landing — different gravity and atmosphere.
```

After the student chooses, Chelly builds the smallest working version. Then it
explains the mechanism and offers the next set of changes:

```text
What do you want to change next?

1. Make gravity stronger.
2. Add fuel limits.
3. Add a landing score.
```

The point is not to hide all decisions behind AI. The point is to let students
create quickly while still thinking about cause, effect, and design tradeoffs.

## Creative Coding Direction

Chelly treats art, music, and interaction as first-class STEAM domains.

Most education tools separate "coding" from "art". Chelly should connect them:

- sound-reactive visuals
- generative patterns
- motion graphics
- simple instruments
- camera and sensor-driven art
- rhythm, repetition, randomness, and composition
- interactive installations

The long-term path should feel like an accessible bridge toward tools such as
TouchDesigner, vvvv, p5.js, Processing, Max/MSP, and creative coding workflows.
Chelly should not clone those tools. It should help students understand the
ideas behind them through natural language, working examples, and guided
modification.

## Current App

Chelly is currently an Expo + React Native Android app with:

- chat-first UI
- Gemini as the default provider
- optional Claude, Groq, Cerebras, Perplexity, and local LLM providers
- command safety classification
- app-private execution bridge for local project files
- starter STEAM prompts
- settings for API keys and local model URLs

## Runtime Direction

Chelly should not depend on Termux for normal use.

Earlier prototypes assumed Termux-style paths. The current direction is to keep
runtime files under Chelly's own Android app sandbox:

```text
/data/data/dev.chelly.app/files/home/chelly
```

That keeps onboarding closer to:

1. install Chelly
2. paste a Gemini API key
3. choose a starter lab
4. make, play, explain, tweak

Advanced runtimes such as Python, Node.js, Raspberry Pi bridges, or Arduino
tooling can be added later as optional adapters. They should not be required
for the first student experience.

## Safety Model

Chelly is designed for education, so the default mode is conservative:

- AI-proposed local actions are shown as approval cards before execution.
- Advanced auto-run is OFF by default.
- Advanced auto-run only skips approval for non-destructive build actions.
- Destructive actions such as broad deletes, ownership changes, token exposure,
  publishing, and credential access are blocked even in advanced mode.
- API keys are stored with `expo-secure-store`.
- The app workspace lives in Chelly's app-private sandbox by default.

See [SECURITY.md](SECURITY.md) for the detailed model.

## Roadmap

### Android MVP

- Starter Lab cards on the empty chat screen
- STEAM-focused system prompt
- app-sandbox workspace instead of Termux paths
- generate small self-contained projects
- explain code and science after generation

### Next

- Web preview for generated projects
- age-level selector: Kids, Junior, Teen
- teacher mode for 45-minute lesson plans
- project gallery
- Android sensor labs: microphone, accelerometer, camera/light

### Later

- Web version
- Desktop version
- iOS version
- Raspberry Pi bridge
- Arduino / micro:bit / ESP32 bridge
- classroom sharing and worksheets

## Getting Started

```bash
git clone https://github.com/RYOITABASHI/Chelly.git
cd Chelly
pnpm install
npx expo prebuild --platform android
cd android && ./gradlew :app:assembleDebug
```

## Tech Stack

Expo 54, React Native 0.81, TypeScript, NativeWind, Zustand, JNI, Kotlin, C.

## Related Projects

- [Shelly](https://github.com/RYOITABASHI/Shelly) — native Android AI terminal IDE
- [Nacre](https://github.com/RYOITABASHI/Nacre) — mobile developer keyboard IME

## License

[MIT](LICENSE)
