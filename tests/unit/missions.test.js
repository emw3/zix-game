import { describe, it, expect } from "vitest";
import { getMission, TUTORIAL_MISSIONS } from "../../src/data/missions.js";

describe("missions", () => {
  it("TUTORIAL_MISSIONS has exactly 3 entries", () => {
    expect(TUTORIAL_MISSIONS).toHaveLength(3);
  });

  it("getMission(1-3) returns tutorials", () => {
    for (let i = 1; i <= 3; i++) {
      const m = getMission(i);
      expect(m).toBe(TUTORIAL_MISSIONS[i - 1]);
    }
  });

  it("getMission(4+) returns generated missions", () => {
    const m = getMission(4);
    expect(m.id).toBe(4);
    expect(m.gameType).toBe("obstacles");
    // Not a reference to TUTORIAL_MISSIONS
    expect(TUTORIAL_MISSIONS).not.toContain(m);
  });

  describe("tutorial fields", () => {
    const requiredFields = [
      "id", "titleES", "titleEN", "descES", "descEN",
      "concept", "icon", "color", "blocks", "grid",
      "startPos", "items", "obstacles", "solution",
    ];

    for (const mission of TUTORIAL_MISSIONS) {
      it(`tutorial ${mission.id} has all required fields`, () => {
        for (const field of requiredFields) {
          expect(mission).toHaveProperty(field);
        }
      });
    }

    it("tutorial solutions reference valid block ids", () => {
      for (const mission of TUTORIAL_MISSIONS) {
        const blockIds = new Set(mission.blocks.map((b) => b.id));
        for (const solId of mission.solution) {
          expect(blockIds.has(solId)).toBe(true);
        }
      }
    });
  });
});
