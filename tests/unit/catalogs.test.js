import { describe, it, expect } from "vitest";
import {
  ALL_BLOCKS,
  OBSTACLE_CATALOG,
  SHIP_PARTS,
  THEMES,
  THEME_KEYS,
} from "../../src/data/catalogs.js";

describe("ALL_BLOCKS", () => {
  it("has 13 entries", () => {
    expect(Object.keys(ALL_BLOCKS)).toHaveLength(13);
  });

  it("every block has correct type field", () => {
    const validTypes = ["direction", "action", "conditional", "loop"];
    for (const [id, block] of Object.entries(ALL_BLOCKS)) {
      expect(validTypes).toContain(block.type);
      expect(block.id).toBe(id);
    }
  });

  it("loop blocks have repeatCount and maxChildren", () => {
    const loops = Object.values(ALL_BLOCKS).filter((b) => b.type === "loop");
    expect(loops.length).toBeGreaterThanOrEqual(2);
    for (const loop of loops) {
      expect(loop).toHaveProperty("repeatCount");
      expect(loop).toHaveProperty("maxChildren");
      expect(loop.repeatCount).toBeGreaterThan(0);
    }
  });
});

describe("OBSTACLE_CATALOG", () => {
  it("has 6 entries", () => {
    expect(OBSTACLE_CATALOG).toHaveLength(6);
  });

  it("unlock levels are ascending", () => {
    for (let i = 1; i < OBSTACLE_CATALOG.length; i++) {
      expect(OBSTACLE_CATALOG[i].unlocksAtLevel).toBeGreaterThanOrEqual(
        OBSTACLE_CATALOG[i - 1].unlocksAtLevel,
      );
    }
  });

  it("blockIds exist in ALL_BLOCKS", () => {
    for (const obs of OBSTACLE_CATALOG) {
      expect(ALL_BLOCKS).toHaveProperty(obs.blockId);
    }
  });
});

describe("SHIP_PARTS", () => {
  it("has 10 entries", () => {
    expect(SHIP_PARTS).toHaveLength(10);
  });
});

describe("THEMES", () => {
  it("has 6 themes", () => {
    expect(Object.keys(THEMES)).toHaveLength(6);
  });

  it("THEME_KEYS matches THEMES keys", () => {
    expect(THEME_KEYS).toEqual(Object.keys(THEMES));
  });

  it("each theme has required properties", () => {
    for (const theme of Object.values(THEMES)) {
      expect(theme).toHaveProperty("bg");
      expect(theme).toHaveProperty("groundColor");
      expect(theme).toHaveProperty("terrainEmojis");
      expect(theme).toHaveProperty("accentColor");
      expect(theme.terrainEmojis.length).toBeGreaterThan(0);
    }
  });
});
