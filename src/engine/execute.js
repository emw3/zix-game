const DELTAS = {
  right: { dx: 1, dy: 0 },
  left: { dx: -1, dy: 0 },
  up: { dx: 0, dy: -1 },
  down: { dx: 0, dy: 1 },
};

/**
 * Execute a sequence of block IDs against a mission.
 * Returns { steps, success } where steps is an array of
 * { type, pos, collected?, blockId } for animation.
 */
export function executeBlocks(blockIds, mission) {
  // Expand repeat blocks: the block after repeatN is executed N times
  // Also build a mapping from expanded index → original block index
  const expanded = [];
  const expandedToOriginal = [];
  for (let i = 0; i < blockIds.length; i++) {
    if (blockIds[i] === "repeat3") {
      const next = blockIds[i + 1];
      if (next) {
        expanded.push(next, next, next);
        expandedToOriginal.push(i, i, i);
        i++;
      }
    } else if (blockIds[i] === "repeat2") {
      const next = blockIds[i + 1];
      if (next) {
        expanded.push(next, next);
        expandedToOriginal.push(i, i);
        i++;
      }
    } else {
      expanded.push(blockIds[i]);
      expandedToOriginal.push(i);
    }
  }

  const { cols, rows } = mission.grid;
  let pos = { ...mission.startPos };
  const collected = new Set();
  const steps = [];
  let fatal = false;

  for (const blockId of expanded) {
    if (fatal) break;

    const delta = DELTAS[blockId];

    if (delta) {
      // Movement block
      const nx = pos.x + delta.dx;
      const ny = pos.y + delta.dy;

      if (nx < 0 || nx >= cols || ny < 0 || ny >= rows) {
        // Wall — Zix stays, no crash
        steps.push({ type: "wall", pos: { ...pos }, blockId });
      } else {
        // Check for obstacle crash
        const obstacle = mission.obstacles.find((o) => o.x === nx && o.y === ny);
        if (obstacle) {
          pos = { x: nx, y: ny };
          if (obstacle.type) {
            // Typed obstacle — Zix enters but needs conditional to handle it
            steps.push({ type: "move", pos: { ...pos }, blockId, obstacle: obstacle.type });
          } else {
            steps.push({ type: "crash", pos: { ...pos }, blockId });
            fatal = true;
          }
        } else {
          pos = { x: nx, y: ny };
          steps.push({ type: "move", pos: { ...pos }, blockId });
        }
      }
    } else if (blockId === "pick") {
      const key = `${pos.x},${pos.y}`;
      const item = mission.items.find((it) => it.x === pos.x && it.y === pos.y);
      if (item && !collected.has(key)) {
        collected.add(key);
      }
      steps.push({ type: "pick", pos: { ...pos }, collected: new Set(collected), blockId });
    } else if (blockId.startsWith("if_")) {
      // Generalized conditional: extract obstacle type from block ID
      const expectedType = blockId.slice(3); // "if_water" → "water"
      const obstacle = mission.obstacles.find(o => o.x === pos.x && o.y === pos.y && o.type === expectedType);
      if (obstacle) {
        steps.push({ type: "action", pos: { ...pos }, blockId, handled: true });
      } else {
        steps.push({ type: "action", pos: { ...pos }, blockId, handled: false });
      }
    } else {
      // Mission-specific blocks (screw, weld, paint, etc.)
      steps.push({ type: "action", pos: { ...pos }, blockId });
    }
  }

  // Determine success via data-driven win condition
  const wc = mission.winCondition || { type: "collect_all" };
  let success = false;

  switch (wc.type) {
    case "collect_all":
      success = collected.size === mission.items.length && !fatal;
      break;
    case "execute_pattern":
      success = expanded.length >= (wc.minActions || 3) && !fatal;
      break;
    default:
      success = collected.size === mission.items.length && !fatal;
  }

  if (fatal) success = false;

  return { steps, success, expandedToOriginal };
}
