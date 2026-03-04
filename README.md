# 👾 Zix

**Help Zix get home by solving coding puzzles!**

![React 19](https://img.shields.io/badge/React-19-61dafb?logo=react)
![Vite 7](https://img.shields.io/badge/Vite-7-646cff?logo=vite)
![Tailwind v4](https://img.shields.io/badge/Tailwind_CSS-4-38bdf8?logo=tailwindcss)
![No Backend](https://img.shields.io/badge/Backend-None-green)

<!-- Add a screenshot or GIF demo here -->
<!-- ![Zix gameplay](docs/screenshot.png) -->

## What is Zix?

Zix is a free, open-source coding game for kids aged 5 and up. Players help a stranded alien named Zix rebuild a spaceship and fly home — by snapping together visual code blocks instead of typing code.

No reading or typing required. Just drag, drop, and think.

The game teaches three fundamental programming concepts through play:

- **Sequences** — do steps in order
- **Conditionals** — if something is in the way, handle it
- **Loops** — repeat actions efficiently

Each level is a grid-based puzzle. Players arrange code blocks to move Zix around the grid, collect spaceship parts, and avoid obstacles. Levels 1–3 are hand-crafted tutorials that introduce one concept at a time. From level 4 onward, levels are procedurally generated — the game never ends.

Bilingual (English / Spanish) and fully offline. No accounts, no tracking, no server.

## How to Play

1. **Read the mission** — Zix tells you what to do in a speech bubble
2. **Drag code blocks** into the drop zone to build your program
3. **Press Play** to watch Zix execute your code step by step
4. **Collect all items** (or complete the pattern) to win the level

### Block Types

| Category | Blocks | What they do |
|----------|--------|-------------|
| Movement | ➡️ Right, ⬅️ Left, ⬆️ Up, ⬇️ Down | Move Zix one cell |
| Action | ⭐ Pick up | Collect an item on the current cell |
| Conditionals | 🌊 IF water → swim, 🪨 IF rock → jump, 🔥 IF fire → blow, 🧊 IF ice → warm, 🌵 IF thorns → cut, 🌋 IF lava → cool | Handle obstacles |
| Loops | 🔄×2 Repeat ×2, 🔄×3 Repeat ×3 | Repeat the preceding blocks |

### Win Conditions

- **Collect all** — pick up every spaceship part on the grid
- **Execute pattern** — run a program with at least N expanded actions (used in loop levels)

## Features

- 13 visual code blocks across 4 categories
- 6 visual themes — plains, forest, desert, space, ice, volcano
- Infinite procedurally generated levels (deterministic/seeded — same level number always produces the same puzzle)
- 12 synthesized sound effects via Web Audio API (no audio files)
- Animated SVG alien character with mood expressions
- Typewriter speech bubbles
- Particle effects — stars, fireflies, and celebration confetti
- Progress saved in localStorage
- Fully offline, no backend, no dependencies beyond React

## Infinite Procedural Levels

Zix never runs out of content. The first 3 levels are hand-crafted tutorials, but from level 4 onward **every level is procedurally generated** using a solution-first algorithm:

1. A seeded PRNG (mulberry32) ensures the same level number always produces the exact same puzzle — deterministic and reproducible
2. The generator picks a game type based on the level number (obstacles, loops, or combined) and selects a theme
3. A valid solution path is created first, guaranteeing the level is always solvable
4. Items and obstacles are placed along the solution path
5. Available code blocks are chosen to match the puzzle's concepts

The difficulty scales progressively: grid sizes grow, more obstacle types unlock, and game types combine. There is no level cap — players can keep going forever.

See [`src/engine/levelGenerator.js`](src/engine/levelGenerator.js) for the full generation algorithm.

## Getting Started

**Prerequisites:** Node.js 18+

```bash
git clone <repo-url>
cd zix
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) and start playing.

### Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start dev server |
| `npm run build` | Production build |
| `npm run preview` | Preview production build |
| `npm run lint` | Run ESLint |

## Level System

### Progression

| Levels | Game Type | Concepts Taught |
|--------|-----------|----------------|
| 1–3 | Navigate & Collect | Sequences |
| 4–6 | Obstacle Course | Conditionals |
| 7–9 | Repeat Patterns | Loops |
| 10–14 | Navigate + Obstacles | Sequences + Conditionals |
| 15–19 | Navigate + Loops | Sequences + Loops |
| 20+ | Full Combined | All concepts, new obstacle types |

### Obstacle Unlock Schedule

| Level | Obstacle |
|-------|----------|
| 4 | 🌊 Water |
| 5 | 🪨 Rock |
| 12 | 🔥 Fire |
| 16 | 🧊 Ice |
| 20 | 🌵 Thorns |
| 25 | 🌋 Lava |

### Themes

Themes cycle automatically as players progress: **plains** → **forest** → **desert** → **space** → **ice** → **volcano**, each with unique background gradients, ground colors, and terrain decorations.

## Architecture

### Project Structure

```
src/
  main.jsx                — Entry point
  App.jsx                 — Root component, screen router
  index.css               — Tailwind, fonts, all keyframe animations
  audio/
    soundEngine.js        — Web Audio API synthesized sounds
  data/
    i18n.js               — Language strings + intro lines (ES/EN)
    missions.js           — Tutorial missions + getMission(n) entry point
    catalogs.js           — Blocks, obstacles, ship parts, themes
  engine/
    rng.js                — Seeded PRNG (mulberry32)
    execute.js            — Pure function: executeBlocks(blockIds, mission) → { steps, success }
    levelGenerator.js     — Procedural level generator: generateMission(levelNumber)
  hooks/
    useGameState.js       — Centralized game state (screen, lang, mission, blocks, progress)
    useMute.js            — Mute toggle hook
    useTTS.js             — Text-to-speech placeholder hook
  components/
    Particles.jsx         — Star & firefly particle systems + celebration confetti
    ZixCharacter.jsx      — Animated SVG alien character
    SpeechBubble.jsx      — Typewriter text bubble
    GameWorld.jsx         — Grid-based game world renderer (theme-driven)
    CodeBlock.jsx         — Draggable code block
    CodeDropZone.jsx      — Drop zone for code sequence
    ResultOverlay.jsx     — Success/fail overlay
  screens/
    SplashScreen.jsx      — Language selection + title
    IntroScreen.jsx       — 4-slide story intro with typewriter
    MissionsScreen.jsx    — Dynamic mission map with unlock progression
    GameplayScreen.jsx    — Main gameplay (grid + blocks + execution)
```

### Design Principles

- **Engine is pure** — `execute.js` and `levelGenerator.js` are plain functions with no React dependencies or side effects. They receive data and return results.
- **Single state hook** — all game state lives in `useGameState.js`. No Redux, no context providers, no external state libraries.
- **Data-driven levels** — missions are plain objects with grid, items, obstacles, available blocks, and win conditions. The same structure works for hand-crafted tutorials and generated levels.
- **Solution-first generation** — the level generator creates a valid solution path first, then places items and obstacles along it, guaranteeing every generated level is solvable.

### Screen Flow

```
SplashScreen → IntroScreen → MissionsScreen ⇄ GameplayScreen
     │                            ↑                    │
     └── (language select)        └── (back to map)    └── (next level)
```

## Roadmap

- [ ] Real text-to-speech narration (`useTTS` is currently a visual-only placeholder)
- [ ] Stricter conditional mechanics (engine currently allows walking through obstacles without the correct conditional block)
- [ ] Hints system (mission hint data exists but is only used in loop tutorials)
- [ ] Star ratings / performance scoring
- [ ] Mobile and touch optimization
- [ ] Accessibility improvements (screen reader support, keyboard navigation)
- [ ] More obstacle types and game mechanics
- [ ] Achievement system
- [ ] Tutorial overlay / onboarding tooltips
- [ ] Custom level editor

## TODO

- [ ] Implement real TTS in `useTTS.js` (currently visual-only)
- [ ] Remove unused `rocketLaunch` CSS keyframe from `index.css`
- [ ] Add favicon and PWA icons (only default `vite.svg` exists)
- [ ] Add Open Graph meta tags for sharing
- [ ] Add unit tests for engine (`execute.js`, `levelGenerator.js`, `rng.js`)
- [ ] Enforce conditional block requirement in engine (optional difficulty toggle)
- [ ] Clean up `zix-game.jsx` prototype or move to separate branch

## Tech Stack

| Technology | Purpose |
|-----------|---------|
| [React 19](https://react.dev) | UI framework |
| [Vite 7](https://vite.dev) | Build tool and dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Web Audio API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Audio_API) | Synthesized sound effects |
| [Google Fonts (Fredoka)](https://fonts.google.com/specimen/Fredoka) | Game typography |
| localStorage | Progress persistence |

## License

[MIT](LICENSE)
