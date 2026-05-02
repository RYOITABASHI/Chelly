# Chelly Product Strategy

Chelly is being developed as an education-ready AI STEAM creation platform,
not as a generic chatbot.

## Long-Term Direction

Chelly should be packageable for:

- schools
- after-school programs
- coding schools
- maker spaces
- STEM/STEAM workshops
- education publishers
- device vendors

The product should also remain credible for acquisition review. That means the
codebase, safety model, docs, and roadmap must look like an education platform,
not a one-off demo.

## Buyer / Partner Value

Chelly turns student curiosity into structured creation:

```text
student idea
↓
guided choices
↓
working project
↓
AI explanation
↓
safe modification
↓
learning artifact
```

This is valuable because it connects:

- creativity
- programming
- science
- math
- art
- music
- interaction design
- device sensors
- teacher-guided lessons

## Art-First STEAM Positioning

Chelly should not become another coding tutor with a thin art demo layer.

Art, music, and digital expression are core differentiators:

- sound-reactive visual systems
- generative art
- simple instruments and sequencers
- motion graphics
- sensor-driven installations
- camera/light-based experiments
- interactive performance tools

The inspiration path is closer to:

- TouchDesigner
- vvvv
- Processing
- p5.js
- Max/MSP
- Scratch creative projects

Chelly's role is to make those ideas approachable before students are ready for
professional node-based or code-heavy environments.

## Product Requirements For Education Sales

### Required

- safe default mode
- teacher/guardian friendly onboarding
- clear API-key handling
- no Termux or external setup requirement for normal use
- repeatable starter labs
- creative coding and sound labs
- age-level explanations
- classroom-friendly language
- exportable learning artifacts
- documented privacy and security model

### Later

- teacher dashboard
- classroom mode
- local-only mode
- school-managed API keys
- lesson packs
- worksheets
- LMS export
- Raspberry Pi / Arduino bridge
- web and desktop versions

## Non-Goals For The MVP

- replacing full IDEs
- replacing Termux
- building a general-purpose automation agent
- letting AI freely operate the device
- requiring students to understand shell commands

## Packaging Vision

Chelly should eventually ship as:

1. **Free OSS core** for credibility and adoption.
2. **Curated lesson packs** for schools and workshops.
3. **Managed classroom package** with safer settings, teacher controls, and
   deployment support.
4. **Device bridge kits** for Raspberry Pi, Arduino, micro:bit, and ESP32.

## Development Filter

When choosing what to build, prefer work that improves at least one of:

- classroom safety
- onboarding simplicity
- repeatable learning outcomes
- teacher trust
- platform portability
- demonstrable student creativity

Avoid features that only make Chelly look like a generic AI assistant.
