# Browser Gemma Research

Browser Gemma is an experimental Chelly mode for testing Gemma-family models
directly inside the Web/PWA app.

This is valuable research because it may let a student open Chelly in Chrome
and use a private local model without installing a separate bridge. It is also
fresh enough to be product and development content: the constraints, browser
support, first-load behavior, and classroom viability are all worth measuring.

## Current Goal

Keep Browser Gemma available as a development test mode, not the default
classroom runtime.

Chelly should use it to test:

- WebGPU availability on Chromebook, Windows, and foldable Android browsers
- first model load time
- memory pressure and tab stability
- response latency for starter lab prompts
- whether small Gemma models can guide, explain, and tweak simple labs
- whether browser inference meaningfully improves zero-install onboarding

## Current Implementation

The app exposes `browser-gemma` as an experimental provider.

It is intentionally loaded from a CDN at runtime instead of being bundled by
Expo/Metro. A direct npm dependency on Transformers.js currently pulls
`onnxruntime-web` into the static web bundle, and Metro fails on the WebGPU
runtime's dynamic import pattern.

The runtime-loaded mode keeps normal Web/PWA builds working while still giving
us a place to test browser Gemma.

## Product Position

Browser Gemma can become:

- a zero-install demo mode
- a privacy-friendly lightweight lab mode
- a fallback when Local AI Bridge is unavailable
- a research story for Chromebook-first STEAM education

It should not replace Local AI Bridge for:

- reliable file operations
- safe command execution
- larger local model management
- managed offline classroom deployments
- reproducible workshop setups

## Harness Questions

Before promoting Browser Gemma beyond experimental, answer:

1. Does it load reliably on managed Chromebooks?
2. Can it handle the starter lab prompt size without tab instability?
3. Is first-run model download acceptable for a classroom?
4. Can teachers understand and recover from WebGPU/model-load failures?
5. Does it still preserve the Preview / Code / Run Log / Explain / Tweak loop?
