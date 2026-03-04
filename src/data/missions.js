import { generateMission } from "../engine/levelGenerator";

export const TUTORIAL_MISSIONS = [
  {
    id: 1,
    titleES: "Recoger Piezas",
    titleEN: "Collect Parts",
    descES: "Ayuda a Zix a recoger las piezas de su nave",
    descEN: "Help Zix collect parts of his ship",
    concept: "Secuencias",
    conceptEN: "Sequences",
    icon: "🔧",
    color: "#FF6B8A",
    bg: "linear-gradient(180deg, #1a0a2e 0%, #0d2137 50%, #0a3a1a 100%)",
    groundColor: "#1a5c2a",
    theme: "plains",
    gameType: "navigate",
    winCondition: { type: "collect_all" },
    blocks: [
      { id: "right", icon: "➡️", es: "Derecha", en: "Right", color: "#45B7D1" },
      { id: "down", icon: "⬇️", es: "Abajo", en: "Down", color: "#4ECDC4" },
      { id: "left", icon: "⬅️", es: "Izquierda", en: "Left", color: "#7C6FE0" },
      { id: "up", icon: "⬆️", es: "Arriba", en: "Up", color: "#E07C6F" },
      { id: "pick", icon: "⭐", es: "Recoger", en: "Pick up", color: "#FFB347" },
    ],
    grid: { cols: 5, rows: 4 },
    startPos: { x: 0, y: 0 },
    items: [
      { x: 2, y: 0, emoji: "⚙️" },
      { x: 2, y: 2, emoji: "🔩" },
      { x: 4, y: 2, emoji: "🔋" },
    ],
    obstacles: [],
    solution: ["right", "right", "pick", "down", "down", "pick", "right", "right", "pick"],
  },
  {
    id: 2,
    titleES: "Cruzar el Bosque",
    titleEN: "Cross the Forest",
    descES: "Usa condicionales para guiar a Zix",
    descEN: "Use conditionals to guide Zix",
    concept: "Condicionales",
    conceptEN: "Conditionals",
    icon: "🌲",
    color: "#4ECDC4",
    bg: "linear-gradient(180deg, #0a1628 0%, #0d2a1a 50%, #1a3a0a 100%)",
    groundColor: "#2a5a1a",
    theme: "forest",
    gameType: "obstacles",
    winCondition: { type: "collect_all" },
    blocks: [
      { id: "right", icon: "➡️", es: "Derecha", en: "Right", color: "#45B7D1" },
      { id: "down", icon: "⬇️", es: "Abajo", en: "Down", color: "#4ECDC4" },
      { id: "if_water", icon: "🌊", es: "SI agua → nadar", en: "IF water → swim", color: "#FF6B8A" },
      { id: "if_rock", icon: "🪨", es: "SI roca → saltar", en: "IF rock → jump", color: "#FFB347" },
      { id: "pick", icon: "🚀", es: "Recoger nave", en: "Pick up ship", color: "#FFD700" },
    ],
    grid: { cols: 5, rows: 4 },
    startPos: { x: 0, y: 1 },
    items: [{ x: 4, y: 1, emoji: "🚀" }],
    obstacles: [
      { x: 1, y: 1, emoji: "🌊", type: "water" },
      { x: 3, y: 1, emoji: "🪨", type: "rock" },
    ],
    solution: ["right", "if_water", "right", "right", "if_rock", "right", "pick"],
  },
  {
    id: 3,
    titleES: "Camino Largo",
    titleEN: "Long Path",
    descES: "Usa loops para llegar más lejos con menos bloques",
    descEN: "Use loops to go farther with fewer blocks",
    concept: "Loops",
    conceptEN: "Loops",
    icon: "🚀",
    color: "#FFE156",
    bg: "linear-gradient(180deg, #1a0a2e 0%, #2a1a3e 50%, #1a1a4e 100%)",
    groundColor: "#2a2a4e",
    theme: "space",
    gameType: "loops",
    winCondition: { type: "collect_all" },
    maxBlocks: 5,
    hint: {
      es: "¡El camino es largo pero solo tienes 5 bloques! Usa Repetir ×3 para llegar más lejos.",
      en: "The path is long but you only have 5 blocks! Use Repeat ×3 to go farther!",
    },
    blocks: [
      { id: "right", icon: "➡️", es: "Derecha", en: "Right", color: "#45B7D1" },
      { id: "pick", icon: "⭐", es: "Recoger", en: "Pick up", color: "#FFB347" },
      { id: "repeat3", icon: "🔄×3", es: "Repetir ×3", en: "Repeat ×3", color: "#9B59B6" },
    ],
    grid: { cols: 7, rows: 1 },
    startPos: { x: 0, y: 0 },
    items: [{ x: 6, y: 0, emoji: "🚀" }],
    obstacles: [],
    solution: ["repeat3", "right", "repeat3", "right", "pick"],
  },
];

/**
 * Get a mission by level number.
 * Levels 1-3 return hand-crafted tutorials, 4+ are procedurally generated.
 */
export function getMission(levelNumber) {
  if (levelNumber >= 1 && levelNumber <= 3) {
    return TUTORIAL_MISSIONS[levelNumber - 1];
  }
  return generateMission(levelNumber);
}

// Legacy export for backward compatibility
export const MISSIONS = TUTORIAL_MISSIONS;
