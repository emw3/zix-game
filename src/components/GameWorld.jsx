import { ZixCharacter } from "./ZixCharacter";
import { THEMES } from "../data/catalogs";

const OBSTACLE_CELL_COLORS = {
  water: "rgba(70,130,230,0.25)",
  rock: "rgba(180,150,100,0.2)",
  fire: "rgba(255,80,30,0.25)",
  ice: "rgba(130,200,255,0.2)",
  thorns: "rgba(80,180,80,0.2)",
  lava: "rgba(255,100,0,0.25)",
};

const OBSTACLE_ANIMATIONS = {
  water: "float 2s ease-in-out infinite",
  fire: "flicker 0.6s ease-in-out infinite",
  ice: "shimmer 2.5s ease-in-out infinite",
  lava: "flicker 0.8s ease-in-out infinite",
  thorns: "none",
  rock: "none",
};

export const GameWorld = ({ mission, alienPos, collectedItems, isMoving, currentStepType }) => {
  const { cols, rows } = mission.grid;
  const themeKey = mission.theme || "plains";
  const theme = THEMES[themeKey] || THEMES.plains;

  const getTerrain = (x, y) => {
    // Use theme terrain emojis on border rows
    const emojis = theme.terrainEmojis;
    if (y === 0 || y === rows - 1) {
      return emojis[Math.abs(x * 3 + y * 7) % emojis.length];
    }
    return "";
  };

  return (
    <div
      className="rounded-2xl overflow-hidden relative"
      style={{
        background: mission.groundColor,
        boxShadow: "0 8px 32px rgba(0,0,0,0.4), inset 0 2px 0 rgba(255,255,255,0.1)",
        border: "3px solid rgba(255,255,255,0.1)",
        animation: currentStepType === "wall" ? "shake 0.4s ease-in-out" : undefined,
      }}
    >
      <div
        className="grid gap-0.5 p-2 relative"
        style={{ gridTemplateColumns: `repeat(${cols}, 1fr)` }}
      >
        {Array.from({ length: rows * cols }).map((_, i) => {
          const x = i % cols;
          const y = Math.floor(i / cols);
          const isAlien = alienPos.x === x && alienPos.y === y;
          const item = mission.items.find((it) => it.x === x && it.y === y);
          const isCollected = item && collectedItems.includes(`${x},${y}`);
          const obstacle = mission.obstacles.find((o) => o.x === x && o.y === y);
          const terrain = getTerrain(x, y);

          return (
            <div
              key={i}
              className="relative flex items-center justify-center"
              style={{
                width: 56,
                height: 56,
                borderRadius: 8,
                background: isAlien
                  ? "rgba(120,255,180,0.25)"
                  : obstacle
                  ? (OBSTACLE_CELL_COLORS[obstacle.type] || "rgba(180,150,100,0.2)")
                  : "rgba(255,255,255,0.06)",
                border: isAlien
                  ? "2px solid rgba(120,255,180,0.5)"
                  : "1px solid rgba(255,255,255,0.06)",
                transition: "all 0.3s ease",
                boxShadow: isAlien ? "0 0 20px rgba(120,255,180,0.2)" : "none",
              }}
            >
              {terrain && !isAlien && !item && !obstacle && (
                <span className="text-xl opacity-70">{terrain}</span>
              )}

              {obstacle && (
                <span
                  className="text-2xl"
                  style={{
                    animation: OBSTACLE_ANIMATIONS[obstacle.type] || "none",
                  }}
                >
                  {obstacle.emoji}
                </span>
              )}

              {item && !isCollected && (
                <span
                  className="text-2xl absolute"
                  style={{
                    animation: "itemBob 1.5s ease-in-out infinite",
                    filter: "drop-shadow(0 2px 6px rgba(255,225,86,0.5))",
                  }}
                >
                  {item.emoji}
                </span>
              )}

              {item && isCollected && (
                <span className="text-lg" style={{ animation: "fadeOut 0.5s forwards" }}>✨</span>
              )}

              {isAlien && (
                <div
                  style={{
                    animation: isMoving ? "alienWalk 0.4s ease-in-out" : "alienIdle 2s ease-in-out infinite",
                    position: "absolute",
                  }}
                >
                  <ZixCharacter mood={isMoving ? "wave" : "idle"} size={48} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {themeKey === "space" && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <span className="text-6xl opacity-20" style={{ filter: "blur(1px)" }}>🛸</span>
        </div>
      )}
    </div>
  );
};
