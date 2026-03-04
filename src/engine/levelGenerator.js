import { createRNG } from "./rng";
import { ALL_BLOCKS, OBSTACLE_CATALOG, SHIP_PARTS, THEMES, THEME_KEYS } from "../data/catalogs";

const DIRECTIONS = ["right", "left", "up", "down"];
const DELTAS = { right: [1, 0], left: [-1, 0], up: [0, -1], down: [0, 1] };

/**
 * Determine game type from level number.
 */
function getGameType(level) {
  if (level <= 3) return "navigate";
  if (level <= 6) return "obstacles";
  if (level <= 9) return "loops";
  if (level <= 14) return "navigate_obstacles";
  if (level <= 19) return "navigate_loops";
  return "combined";
}

/**
 * Compute complexity parameters from level number.
 */
function getComplexityParams(level) {
  const t = Math.min((level - 1) / 30, 1); // 0..1 over 30 levels
  return {
    cols: Math.floor(3 + t * 5),       // 3 → 8
    rows: Math.floor(3 + t * 3),       // 3 → 6
    itemCount: Math.floor(1 + t * 4),  // 1 → 5
    obstacleCount: Math.floor(t * 6),  // 0 → 6
    solutionLen: Math.floor(5 + t * 20), // 5 → 25
  };
}

/**
 * Pick a theme based on level number.
 */
function pickTheme(level, rng) {
  // Cycle through themes with some randomness
  const idx = (level + Math.floor(rng() * 2)) % THEME_KEYS.length;
  return THEME_KEYS[idx];
}

/**
 * Get available obstacle types for a given level.
 */
function getAvailableObstacles(level) {
  return OBSTACLE_CATALOG.filter(o => o.unlocksAtLevel <= level);
}

/**
 * Generate a random solution path through the grid, placing items along it.
 */
function generateSolutionPath(params, rng, availableObstacles, gameType) {
  const { cols, rows, itemCount, obstacleCount, solutionLen } = params;

  // Start position: top-left area
  const startX = Math.floor(rng() * Math.min(2, cols));
  const startY = Math.floor(rng() * Math.min(2, rows));

  const solution = [];
  const items = [];
  const obstacles = [];
  const visited = new Set();
  let x = startX, y = startY;
  visited.add(`${x},${y}`);

  // Track positions along the path for item/obstacle placement
  const pathPositions = [{ x, y }];

  // Random walk to create solution path
  const maxMoves = solutionLen - itemCount; // reserve picks for items
  let moves = 0;

  while (moves < maxMoves && solution.length < solutionLen - itemCount) {
    // Pick a random valid direction
    const validDirs = DIRECTIONS.filter(d => {
      const [dx, dy] = DELTAS[d];
      const nx = x + dx, ny = y + dy;
      return nx >= 0 && nx < cols && ny >= 0 && ny < rows;
    });

    if (validDirs.length === 0) break;

    // Prefer directions that visit new cells
    const preferNew = validDirs.filter(d => {
      const [dx, dy] = DELTAS[d];
      return !visited.has(`${x + dx},${y + dy}`);
    });

    const dir = preferNew.length > 0
      ? preferNew[Math.floor(rng() * preferNew.length)]
      : validDirs[Math.floor(rng() * validDirs.length)];

    const [dx, dy] = DELTAS[dir];
    x += dx;
    y += dy;
    visited.add(`${x},${y}`);
    pathPositions.push({ x, y });
    solution.push(dir);
    moves++;
  }

  // Place obstacles along the path (for obstacle/combined game types)
  const needsObstacles = gameType === "obstacles" || gameType === "navigate_obstacles" || gameType === "combined";
  if (needsObstacles && availableObstacles.length > 0 && pathPositions.length > 2) {
    const numObs = Math.min(obstacleCount, Math.floor(pathPositions.length / 3), availableObstacles.length * 2);
    const usedPositions = new Set([`${startX},${startY}`]);

    for (let i = 0; i < numObs; i++) {
      // Place obstacles in the middle section of the path
      const minIdx = 1;
      const maxIdx = Math.max(2, Math.floor(pathPositions.length * 0.7));
      if (minIdx >= maxIdx) break;

      let tries = 20;
      while (tries-- > 0) {
        const idx = minIdx + Math.floor(rng() * (maxIdx - minIdx));
        const pos = pathPositions[idx];
        const key = `${pos.x},${pos.y}`;
        if (!usedPositions.has(key)) {
          usedPositions.add(key);
          const obsType = availableObstacles[Math.floor(rng() * availableObstacles.length)];
          obstacles.push({ x: pos.x, y: pos.y, emoji: obsType.emoji, type: obsType.type });

          // Insert the conditional block right after moving to that cell
          let solIdx = solution.length;
          let cx = startX, cy = startY;
          for (let s = 0; s < solution.length; s++) {
            const block = solution[s];
            if (DELTAS[block]) {
              const [ddx, ddy] = DELTAS[block];
              cx += ddx;
              cy += ddy;
            }
            if (cx === pos.x && cy === pos.y) {
              solIdx = s + 1;
              break;
            }
          }
          solution.splice(solIdx, 0, obsType.blockId);
          break;
        }
      }
    }
  }

  // Find earliest allowed item index (items must appear after all obstacles on the path)
  let earliestItemIdx = 1;
  if (needsObstacles && obstacles.length > 0) {
    const obstacleKeys = new Set(obstacles.map(o => `${o.x},${o.y}`));
    for (let i = pathPositions.length - 1; i >= 0; i--) {
      if (obstacleKeys.has(`${pathPositions[i].x},${pathPositions[i].y}`)) {
        earliestItemIdx = i + 1;
        break;
      }
    }
  }

  // Place items along the path
  const itemPositions = new Set([`${startX},${startY}`]);
  // Also exclude obstacle positions
  for (const obs of obstacles) {
    itemPositions.add(`${obs.x},${obs.y}`);
  }

  const usedPartIndices = new Set();
  for (let i = 0; i < itemCount && pathPositions.length > 1; i++) {
    let tries = 30;
    while (tries-- > 0) {
      const range = pathPositions.length - earliestItemIdx;
      if (range <= 0) break;
      const idx = earliestItemIdx + Math.floor(rng() * range);
      const pos = pathPositions[idx];
      const key = `${pos.x},${pos.y}`;
      if (!itemPositions.has(key)) {
        itemPositions.add(key);
        // Pick a unique ship part
        let partIdx;
        do {
          partIdx = Math.floor(rng() * SHIP_PARTS.length);
        } while (usedPartIndices.has(partIdx) && usedPartIndices.size < SHIP_PARTS.length);
        usedPartIndices.add(partIdx);

        items.push({ x: pos.x, y: pos.y, emoji: SHIP_PARTS[partIdx].emoji });

        // Insert pick block at the right position in solution
        // Trace through solution, only updating position on direction blocks
        let solIdx = solution.length;
        let cx = startX, cy = startY;
        for (let s = 0; s < solution.length; s++) {
          const block = solution[s];
          if (DELTAS[block]) {
            const [ddx, ddy] = DELTAS[block];
            cx += ddx;
            cy += ddy;
          }
          if (cx === pos.x && cy === pos.y) {
            solIdx = s + 1;
            break;
          }
        }
        solution.splice(solIdx, 0, "pick");
        break;
      }
    }
  }

  return {
    startPos: { x: startX, y: startY },
    solution,
    items,
    obstacles,
  };
}

/**
 * Generate a template-based loop level for levels 7-9.
 * Creates deliberate repeating patterns that require loops to solve within the block limit.
 */
function generateTemplateLoopLevel(levelNumber, rng) {
  const partIdx = Math.floor(rng() * SHIP_PARTS.length);
  const partEmoji = SHIP_PARTS[partIdx].emoji;

  if (levelNumber === 7) {
    // Straight line — one item far away, requires 2 repeat blocks to reach
    const cols = 7, rows = 2;
    const startY = Math.floor(rng() * rows);
    return {
      grid: { cols, rows },
      startPos: { x: 0, y: startY },
      solution: ["repeat3", "right", "repeat3", "right", "pick"],
      items: [{ x: 6, y: startY, emoji: partEmoji }],
      obstacles: [],
      maxBlocks: 6,
      hint: {
        es: "El item está muy lejos... ¡Usa Repetir ×3 para avanzar más rápido!",
        en: "The item is far away... Use Repeat ×3 to move faster!",
      },
    };
  }

  if (levelNumber === 8) {
    // L-shape — two items at end of horizontal and vertical segments
    const cols = 7, rows = 5;
    const p2 = Math.floor(rng() * SHIP_PARTS.length);
    return {
      grid: { cols, rows },
      startPos: { x: 0, y: 0 },
      solution: ["repeat3", "right", "repeat3", "right", "pick", "repeat3", "down", "pick"],
      items: [
        { x: 6, y: 0, emoji: partEmoji },
        { x: 6, y: 3, emoji: SHIP_PARTS[(p2 === partIdx ? (p2 + 1) % SHIP_PARTS.length : p2)].emoji },
      ],
      obstacles: [],
      maxBlocks: 9,
      hint: {
        es: "Hay piezas en dos direcciones. ¡Usa Repetir para llegar a ambas!",
        en: "There are parts in two directions. Use Repeat to reach both!",
      },
    };
  }

  // Level 9 — U-shape, three items at corners
  const cols = 7, rows = 5;
  const p2 = (partIdx + 1) % SHIP_PARTS.length;
  const p3 = (partIdx + 2) % SHIP_PARTS.length;
  return {
    grid: { cols, rows },
    startPos: { x: 0, y: 0 },
    solution: [
      "repeat3", "right", "pick",
      "repeat3", "down", "pick",
      "repeat3", "left", "pick",
    ],
    items: [
      { x: 3, y: 0, emoji: partEmoji },
      { x: 3, y: 3, emoji: SHIP_PARTS[p2].emoji },
      { x: 0, y: 3, emoji: SHIP_PARTS[p3].emoji },
    ],
    obstacles: [],
    maxBlocks: 10,
    hint: {
      es: "Tres piezas en forma de U. ¡Necesitarás Repetir en cada dirección!",
      en: "Three parts in a U shape. You'll need Repeat in each direction!",
    },
  };
}

/**
 * Generate a loop-based solution for loop game types.
 * Levels 7-9 use templates; higher loop levels use random generation.
 */
function generateLoopSolution(params, rng, availableObstacles, gameType, levelNumber) {
  // Levels 7-9: use deliberate templates
  if (levelNumber >= 7 && levelNumber <= 9) {
    return generateTemplateLoopLevel(levelNumber, rng);
  }

  const { cols, rows, solutionLen } = params;

  const startX = Math.floor(rng() * Math.min(2, cols));
  const startY = Math.floor(rng() * Math.min(2, rows));

  const solution = [];
  const items = [];
  const obstacles = [];

  // For loop levels, create patterns of repeated moves
  const repeatType = rng() > 0.5 ? "repeat3" : "repeat2";

  // Build a pattern: repeat + direction sequences, then pick items
  let x = startX, y = startY;
  let blocksUsed = 0;
  const pathPositions = [{ x, y }];
  // Track which pathPositions indices are "stoppable" (end of a solution unit)
  const stoppableIndices = new Set([0]);

  while (blocksUsed < solutionLen - 2) {
    // Decide: repeat block or single move
    const useRepeat = rng() > 0.4 && blocksUsed + 2 <= solutionLen;

    if (useRepeat) {
      const n = repeatType === "repeat3" ? 3 : 2;
      // Find a direction we can repeat N times
      const validDirs = DIRECTIONS.filter(d => {
        const [dx, dy] = DELTAS[d];
        let tx = x, ty = y;
        for (let k = 0; k < n; k++) {
          tx += dx; ty += dy;
          if (tx < 0 || tx >= cols || ty < 0 || ty >= rows) return false;
        }
        return true;
      });

      if (validDirs.length > 0) {
        const dir = validDirs[Math.floor(rng() * validDirs.length)];
        solution.push(repeatType, dir);
        const [dx, dy] = DELTAS[dir];
        for (let k = 0; k < n; k++) {
          x += dx; y += dy;
          pathPositions.push({ x, y });
        }
        // Only the last position of the repeat is stoppable
        stoppableIndices.add(pathPositions.length - 1);
        blocksUsed += 2;
        continue;
      }
    }

    // Single move
    const validDirs = DIRECTIONS.filter(d => {
      const [dx, dy] = DELTAS[d];
      return x + dx >= 0 && x + dx < cols && y + dy >= 0 && y + dy < rows;
    });
    if (validDirs.length === 0) break;

    const dir = validDirs[Math.floor(rng() * validDirs.length)];
    const [dx, dy] = DELTAS[dir];
    x += dx; y += dy;
    pathPositions.push({ x, y });
    stoppableIndices.add(pathPositions.length - 1);
    solution.push(dir);
    blocksUsed++;
  }

  // Place 1-2 items along the path, only at stoppable positions
  const stoppable = [...stoppableIndices].filter(i => i > 0);
  const itemCount = Math.min(2, Math.max(1, Math.floor(stoppable.length / 2)));
  const usedPositions = new Set([`${startX},${startY}`]);
  const usedPartIndices = new Set();

  for (let i = 0; i < itemCount; i++) {
    if (stoppable.length === 0) break;
    const si = stoppable[Math.floor(rng() * stoppable.length)];
    const pos = pathPositions[si];
    const key = `${pos.x},${pos.y}`;
    if (!usedPositions.has(key)) {
      usedPositions.add(key);
      let partIdx;
      do {
        partIdx = Math.floor(rng() * SHIP_PARTS.length);
      } while (usedPartIndices.has(partIdx) && usedPartIndices.size < SHIP_PARTS.length);
      usedPartIndices.add(partIdx);
      items.push({ x: pos.x, y: pos.y, emoji: SHIP_PARTS[partIdx].emoji });

      // Insert pick at appropriate solution position
      // Expand repeats when tracing to find correct position
      let solIdx = solution.length;
      let cx = startX, cy = startY;
      for (let s = 0; s < solution.length; s++) {
        const block = solution[s];
        if (block === "repeat2" || block === "repeat3") {
          const n = block === "repeat3" ? 3 : 2;
          const next = solution[s + 1];
          if (next && DELTAS[next]) {
            const [ddx, ddy] = DELTAS[next];
            for (let k = 0; k < n; k++) { cx += ddx; cy += ddy; }
          }
          s++; // skip the next block (already processed)
          if (cx === pos.x && cy === pos.y) { solIdx = s + 1; break; }
        } else if (DELTAS[block]) {
          const [ddx, ddy] = DELTAS[block];
          cx += ddx; cy += ddy;
          if (cx === pos.x && cy === pos.y) { solIdx = s + 1; break; }
        }
      }
      solution.splice(solIdx, 0, "pick");
    }
  }

  return {
    startPos: { x: startX, y: startY },
    solution,
    items,
    obstacles,
  };
}

/**
 * Select the block palette for the player (solution blocks + distractors).
 */
function selectBlockPalette(solution, obstacles, gameType, level, rng) {
  const blockSet = new Set();

  // Always include blocks used in the solution
  for (const b of solution) {
    blockSet.add(b);
  }

  // Add movement blocks
  for (const d of DIRECTIONS) blockSet.add(d);
  blockSet.add("pick");

  // Add conditional blocks for obstacles in this level
  for (const obs of obstacles) {
    const cat = OBSTACLE_CATALOG.find(c => c.type === obs.type);
    if (cat) blockSet.add(cat.blockId);
  }

  // Add distractors based on game type
  if (gameType === "obstacles" || gameType === "navigate_obstacles" || gameType === "combined") {
    const available = getAvailableObstacles(level);
    // Add 1-2 extra conditional blocks as distractors
    for (const obs of available) {
      if (rng() > 0.6) blockSet.add(obs.blockId);
    }
  }

  if (gameType === "loops" || gameType === "navigate_loops" || gameType === "combined") {
    blockSet.add("repeat2");
    blockSet.add("repeat3");
  }

  // Convert to block objects
  return [...blockSet]
    .filter(id => ALL_BLOCKS[id])
    .map(id => ({ ...ALL_BLOCKS[id] }));
}

/**
 * Build win condition descriptor for a game type.
 */
function buildWinCondition(gameType, items) {
  if (items.length > 0) {
    return { type: "collect_all" };
  }
  return { type: "execute_pattern", minActions: 3 };
}

/**
 * Generate a complete mission object for a given level number.
 */
export function generateMission(levelNumber) {
  const rng = createRNG(levelNumber * 7919); // prime multiplier for variety
  const gameType = getGameType(levelNumber);
  const params = getComplexityParams(levelNumber);

  // Enforce minimum obstacle counts for obstacle-focused game types
  const OBSTACLE_MINIMUMS = {
    obstacles: 1,
    navigate_obstacles: 1,
    combined: 2,
  };
  const minObstacles = OBSTACLE_MINIMUMS[gameType] ?? 0;
  params.obstacleCount = Math.max(params.obstacleCount, minObstacles);

  const themeKey = pickTheme(levelNumber, rng);
  const theme = THEMES[themeKey];
  const availableObstacles = getAvailableObstacles(levelNumber);

  // Generate the level based on game type
  const isLoopType = gameType === "loops" || gameType === "navigate_loops";
  const pathResult = isLoopType
    ? generateLoopSolution(params, rng, availableObstacles, gameType, levelNumber)
    : generateSolutionPath(params, rng, availableObstacles, gameType);

  const { startPos, solution, items, obstacles } = pathResult;

  // Build block palette
  const blocks = selectBlockPalette(solution, obstacles, gameType, levelNumber, rng);

  // Build win condition
  const winCondition = buildWinCondition(gameType, items);

  // Game type labels
  const gameTypeLabels = {
    navigate: { es: "Navegar y Recoger", en: "Navigate & Collect", concept: "Secuencias", conceptEN: "Sequences" },
    obstacles: { es: "Curso de Obstáculos", en: "Obstacle Course", concept: "Condicionales", conceptEN: "Conditionals" },
    loops: { es: "Patrones Repetidos", en: "Repeat Patterns", concept: "Loops", conceptEN: "Loops" },
    navigate_obstacles: { es: "Navegar + Obstáculos", en: "Navigate + Obstacles", concept: "Sec + Cond", conceptEN: "Seq + Cond" },
    navigate_loops: { es: "Navegar + Loops", en: "Navigate + Loops", concept: "Sec + Loops", conceptEN: "Seq + Loops" },
    combined: { es: "Aventura Completa", en: "Full Adventure", concept: "Combinado", conceptEN: "Combined" },
  };

  const labels = gameTypeLabels[gameType] || gameTypeLabels.navigate;
  const icons = ["🔧", "🌲", "🚀", "🏜️", "❄️", "🌋", "⭐", "💎", "🛸", "🪐"];

  return {
    id: levelNumber,
    titleES: `${labels.es} ${levelNumber}`,
    titleEN: `${labels.en} ${levelNumber}`,
    descES: `Nivel ${levelNumber} - ${labels.concept}`,
    descEN: `Level ${levelNumber} - ${labels.conceptEN}`,
    concept: labels.concept,
    conceptEN: labels.conceptEN,
    icon: icons[(levelNumber - 1) % icons.length],
    color: theme.accentColor,
    bg: theme.bg,
    groundColor: theme.groundColor,
    theme: themeKey,
    gameType,
    winCondition,
    blocks,
    grid: pathResult.grid || { cols: params.cols, rows: params.rows },
    startPos,
    items,
    obstacles,
    solution,
    maxBlocks: pathResult.maxBlocks || null,
    hint: pathResult.hint || null,
  };
}
