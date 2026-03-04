// Central registry of blocks, obstacles, ship parts, and themes

export const ALL_BLOCKS = {
  right: { id: "right", icon: "➡️", es: "Derecha", en: "Right", color: "#45B7D1", type: "direction" },
  left: { id: "left", icon: "⬅️", es: "Izquierda", en: "Left", color: "#7C6FE0", type: "direction" },
  up: { id: "up", icon: "⬆️", es: "Arriba", en: "Up", color: "#E07C6F", type: "direction" },
  down: { id: "down", icon: "⬇️", es: "Abajo", en: "Down", color: "#4ECDC4", type: "direction" },
  pick: { id: "pick", icon: "⭐", es: "Recoger", en: "Pick up", color: "#FFB347", type: "action" },
  if_water: { id: "if_water", icon: "🌊", es: "SI agua → nadar", en: "IF water → swim", color: "#4A90D9", type: "conditional" },
  if_rock: { id: "if_rock", icon: "🪨", es: "SI roca → saltar", en: "IF rock → jump", color: "#C4A265", type: "conditional" },
  if_fire: { id: "if_fire", icon: "🔥", es: "SI fuego → soplar", en: "IF fire → blow", color: "#FF4444", type: "conditional" },
  if_ice: { id: "if_ice", icon: "🧊", es: "SI hielo → calentar", en: "IF ice → warm", color: "#88DDFF", type: "conditional" },
  if_thorns: { id: "if_thorns", icon: "🌵", es: "SI espinas → cortar", en: "IF thorns → cut", color: "#66BB6A", type: "conditional" },
  if_lava: { id: "if_lava", icon: "🌋", es: "SI lava → enfriar", en: "IF lava → cool", color: "#FF6600", type: "conditional" },
  repeat2: { id: "repeat2", icon: "🔄×2", es: "Repetir ×2", en: "Repeat ×2", color: "#9B59B6", type: "loop", repeatCount: 2, maxChildren: 1 },
  repeat3: { id: "repeat3", icon: "🔄×3", es: "Repetir ×3", en: "Repeat ×3", color: "#8E44AD", type: "loop", repeatCount: 3, maxChildren: 1 },
};

export const OBSTACLE_CATALOG = [
  { type: "water", emoji: "🌊", blockId: "if_water", unlocksAtLevel: 4 },
  { type: "rock", emoji: "🪨", blockId: "if_rock", unlocksAtLevel: 5 },
  { type: "fire", emoji: "🔥", blockId: "if_fire", unlocksAtLevel: 12 },
  { type: "ice", emoji: "🧊", blockId: "if_ice", unlocksAtLevel: 16 },
  { type: "thorns", emoji: "🌵", blockId: "if_thorns", unlocksAtLevel: 20 },
  { type: "lava", emoji: "🌋", blockId: "if_lava", unlocksAtLevel: 25 },
];

export const SHIP_PARTS = [
  { emoji: "⚙️", es: "Engranaje", en: "Gear" },
  { emoji: "🔩", es: "Tornillo", en: "Bolt" },
  { emoji: "🔋", es: "Batería", en: "Battery" },
  { emoji: "📡", es: "Antena", en: "Antenna" },
  { emoji: "💡", es: "Luz", en: "Light" },
  { emoji: "🔧", es: "Llave", en: "Wrench" },
  { emoji: "⚡", es: "Cable", en: "Cable" },
  { emoji: "🛞", es: "Rueda", en: "Wheel" },
  { emoji: "🪫", es: "Celda", en: "Cell" },
  { emoji: "🔭", es: "Telescopio", en: "Telescope" },
];

export const THEMES = {
  plains: {
    bg: "linear-gradient(180deg, #1a0a2e 0%, #0d2137 50%, #0a3a1a 100%)",
    groundColor: "#1a5c2a",
    terrainEmojis: ["🌿", "🌱", "☘️", "🍀"],
    accentColor: "#78FFB4",
  },
  forest: {
    bg: "linear-gradient(180deg, #0a1628 0%, #0d2a1a 50%, #1a3a0a 100%)",
    groundColor: "#2a5a1a",
    terrainEmojis: ["🌲", "🌳", "🎋", "🌴"],
    accentColor: "#4ECDC4",
  },
  desert: {
    bg: "linear-gradient(180deg, #2e1a0a 0%, #3d2a0d 50%, #4a3a0a 100%)",
    groundColor: "#5a4a2a",
    terrainEmojis: ["🏜️", "🌾", "🗿", "☀️"],
    accentColor: "#FFB347",
  },
  space: {
    bg: "linear-gradient(180deg, #1a0a2e 0%, #2a1a3e 50%, #1a1a4e 100%)",
    groundColor: "#2a2a4e",
    terrainEmojis: ["⭐", "✨", "💫", "🌟"],
    accentColor: "#FFE156",
  },
  ice: {
    bg: "linear-gradient(180deg, #0a1a2e 0%, #1a3a5e 50%, #2a4a6e 100%)",
    groundColor: "#2a4a5e",
    terrainEmojis: ["❄️", "⛄", "💎", "🌨️"],
    accentColor: "#88DDFF",
  },
  volcano: {
    bg: "linear-gradient(180deg, #2e0a0a 0%, #3e1a0a 50%, #4e1a1a 100%)",
    groundColor: "#4e2a1a",
    terrainEmojis: ["⛰️", "♨️", "🌑", "💀"],
    accentColor: "#FF6B8A",
  },
};

export const THEME_KEYS = Object.keys(THEMES);
