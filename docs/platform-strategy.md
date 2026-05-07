# Chelly Platform Strategy

Chelly is moving toward a Chromebook and Windows first product.

The product should be designed as a keyboard-and-large-screen STEAM creation
studio, not as a phone chat app. Android remains useful as the current
prototype target and as a ChromeOS fallback, but it should not define the main
interaction model.

## Primary Targets

### Chromebook

Chromebook is the primary school deployment target.

Chelly should fit:

- elementary and middle school classrooms
- managed ChromeOS devices
- keyboard and trackpad workflows
- web previews, code reading, and teacher-led labs
- low-friction deployment through a browser or managed web app

### Windows

Windows is the primary older-student and home target.

Chelly should fit:

- middle school and high school personal machines
- STEM clubs, maker spaces, coding schools, and workshops
- local model runtimes and packaged installers
- richer file, terminal, and project workflows

## Secondary Targets

### macOS

macOS should come later through the same Web Studio and local bridge
architecture used for Windows.

### Android

Android is currently the working implementation target. Keep it useful, but do
not let phone-size constraints drive the product.

Android can remain:

- a prototype shell
- a Chromebook Android fallback
- a future tablet/offline app
- a test bed for app-private execution and local model packaging

## Product Shape

The primary Chelly experience should be a studio:

```text
Chat / Guide
Preview
Code
Run Log
Explain
Tweak
```

These surfaces should be visible or one click away on Chromebook and Windows.
The student should see what was made, what ran, what code changed, and what
concepts are being learned.

## Architecture Direction

Use a shared product core and separate platform shells.

```text
Chelly Web Studio
  shared AI dispatch
  shared safety classification
  shared lab templates
  shared learning insight generation

Local AI Bridge
  Gemma-family local model runtime
  local file/project operations
  safe command execution
  platform-specific packaging

Platform shells
  PWA for Chromebook and Windows
  Windows packaged app later
  macOS packaged app later
  Android app as current shell/fallback
```

## Web/PWA First

The long-term primary UI should be a Web/PWA experience because it works across
Chromebook and Windows and fits classroom deployment.

The PWA should own:

- studio layout
- lesson and starter lab flow
- preview panes
- code viewing
- learning explanations
- teacher-friendly onboarding

## Local AI Bridge

The local AI bridge should own anything the browser cannot reliably own:

- local Gemma-family inference
- model discovery and health checks
- project file writes
- safe build/run actions
- local runtime adapters

The bridge lets Chelly keep one main UI while adapting local execution for
Chromebook, Windows, and later macOS.

## Browser Gemma Mode

Gemma-family browser inference through WebGPU or Transformers.js should remain
a future execution mode for lightweight labs. It can improve zero-install
privacy and demos, especially on Chromebooks, but it should not replace the
Local AI Bridge for reliable classroom file operations, safe command execution,
model management, and larger offline workflows.

## Decision Rule

When choosing a feature, prefer the option that improves Chromebook and Windows
studio workflows first.

Avoid features that only improve a narrow Android phone workflow unless they
also strengthen the shared core or the future Chromebook/Windows product.
