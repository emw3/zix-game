import { describe, it, expect } from "vitest";
import { executeBlocks } from "../../src/engine/execute.js";

function makeMission(overrides = {}) {
  return {
    grid: { cols: 5, rows: 4 },
    startPos: { x: 0, y: 0 },
    items: [],
    obstacles: [],
    winCondition: { type: "collect_all" },
    ...overrides,
  };
}

function block(id, type = "direction", extra = {}) {
  return { id, type, ...extra };
}

describe("executeBlocks", () => {
  describe("movement", () => {
    it("moves right", () => {
      const mission = makeMission();
      const { steps } = executeBlocks([block("right")], mission);
      expect(steps[0].pos).toEqual({ x: 1, y: 0 });
      expect(steps[0].type).toBe("move");
    });

    it("moves left", () => {
      const mission = makeMission({ startPos: { x: 2, y: 0 } });
      const { steps } = executeBlocks([block("left")], mission);
      expect(steps[0].pos).toEqual({ x: 1, y: 0 });
    });

    it("moves up", () => {
      const mission = makeMission({ startPos: { x: 0, y: 2 } });
      const { steps } = executeBlocks([block("up")], mission);
      expect(steps[0].pos).toEqual({ x: 0, y: 1 });
    });

    it("moves down", () => {
      const mission = makeMission();
      const { steps } = executeBlocks([block("down")], mission);
      expect(steps[0].pos).toEqual({ x: 0, y: 1 });
    });

    it("stays in place at wall boundary", () => {
      const mission = makeMission({ startPos: { x: 0, y: 0 } });
      const { steps } = executeBlocks([block("left")], mission);
      expect(steps[0].type).toBe("wall");
      expect(steps[0].pos).toEqual({ x: 0, y: 0 });
    });

    it("stays at right wall", () => {
      const mission = makeMission({ startPos: { x: 4, y: 0 } });
      const { steps } = executeBlocks([block("right")], mission);
      expect(steps[0].type).toBe("wall");
      expect(steps[0].pos).toEqual({ x: 4, y: 0 });
    });
  });

  describe("obstacles", () => {
    it("untyped obstacle causes crash (fatal)", () => {
      const mission = makeMission({
        obstacles: [{ x: 1, y: 0 }],
      });
      const { steps, success } = executeBlocks([block("right")], mission);
      expect(steps[0].type).toBe("crash");
      expect(success).toBe(false);
    });

    it("typed obstacle records obstacle field, no crash", () => {
      const mission = makeMission({
        obstacles: [{ x: 1, y: 0, type: "water" }],
      });
      const { steps } = executeBlocks([block("right")], mission);
      expect(steps[0].type).toBe("move");
      expect(steps[0].obstacle).toBe("water");
    });
  });

  describe("conditionals", () => {
    it("if_water at water position sets handled:true", () => {
      const mission = makeMission({
        startPos: { x: 1, y: 0 },
        obstacles: [{ x: 1, y: 0, type: "water" }],
      });
      const { steps } = executeBlocks([block("if_water", "conditional")], mission);
      expect(steps[0].handled).toBe(true);
    });

    it("wrong conditional sets handled:false", () => {
      const mission = makeMission({
        startPos: { x: 1, y: 0 },
        obstacles: [{ x: 1, y: 0, type: "water" }],
      });
      const { steps } = executeBlocks([block("if_rock", "conditional")], mission);
      expect(steps[0].handled).toBe(false);
    });

    it("conditional at empty position sets handled:false", () => {
      const mission = makeMission();
      const { steps } = executeBlocks([block("if_water", "conditional")], mission);
      expect(steps[0].handled).toBe(false);
    });
  });

  describe("pick", () => {
    it("collects item at current position", () => {
      const mission = makeMission({
        items: [{ x: 0, y: 0, emoji: "⚙️" }],
      });
      const { steps } = executeBlocks([block("pick", "action")], mission);
      expect(steps[0].collected.size).toBe(1);
    });

    it("no-op at empty position", () => {
      const mission = makeMission();
      const { steps } = executeBlocks([block("pick", "action")], mission);
      expect(steps[0].collected.size).toBe(0);
    });

    it("no duplicate collection at same position", () => {
      const mission = makeMission({
        items: [{ x: 0, y: 0, emoji: "⚙️" }],
      });
      const { steps } = executeBlocks(
        [block("pick", "action"), block("pick", "action")],
        mission,
      );
      expect(steps[0].collected.size).toBe(1);
      expect(steps[1].collected.size).toBe(1);
    });
  });

  describe("loops", () => {
    it("repeat2 expands child twice", () => {
      const mission = makeMission();
      const loopBlock = {
        id: "repeat2",
        type: "loop",
        repeatCount: 2,
        children: [{ id: "right", type: "direction" }],
      };
      const { steps } = executeBlocks([loopBlock], mission);
      expect(steps).toHaveLength(2);
      expect(steps[0].pos).toEqual({ x: 1, y: 0 });
      expect(steps[1].pos).toEqual({ x: 2, y: 0 });
    });

    it("repeat3 expands child three times", () => {
      const mission = makeMission();
      const loopBlock = {
        id: "repeat3",
        type: "loop",
        repeatCount: 3,
        children: [{ id: "right", type: "direction" }],
      };
      const { steps } = executeBlocks([loopBlock], mission);
      expect(steps).toHaveLength(3);
      expect(steps[2].pos).toEqual({ x: 3, y: 0 });
    });

    it("empty loop falls through as single action step", () => {
      const mission = makeMission();
      const loopBlock = {
        id: "repeat2",
        type: "loop",
        repeatCount: 2,
        children: [],
      };
      const { steps } = executeBlocks([loopBlock], mission);
      // Empty children means the loop block itself is pushed (not expanded)
      expect(steps).toHaveLength(1);
      expect(steps[0].type).toBe("action");
    });
  });

  describe("expandedToOriginal", () => {
    it("maps simple blocks correctly", () => {
      const mission = makeMission();
      const { expandedToOriginal } = executeBlocks(
        [block("right"), block("down")],
        mission,
      );
      expect(expandedToOriginal[0]).toEqual({ blockIndex: 0, childIndex: -1 });
      expect(expandedToOriginal[1]).toEqual({ blockIndex: 1, childIndex: -1 });
    });

    it("maps loop children correctly", () => {
      const mission = makeMission();
      const loopBlock = {
        id: "repeat2",
        type: "loop",
        repeatCount: 2,
        children: [{ id: "right", type: "direction" }],
      };
      const { expandedToOriginal } = executeBlocks([loopBlock], mission);
      expect(expandedToOriginal[0]).toEqual({ blockIndex: 0, childIndex: 0 });
      expect(expandedToOriginal[1]).toEqual({ blockIndex: 0, childIndex: 0 });
    });
  });

  describe("win conditions", () => {
    it("collect_all succeeds when all items collected and no fatal", () => {
      const mission = makeMission({
        items: [{ x: 1, y: 0, emoji: "⚙️" }],
        winCondition: { type: "collect_all" },
      });
      const { success } = executeBlocks(
        [block("right"), block("pick", "action")],
        mission,
      );
      expect(success).toBe(true);
    });

    it("collect_all fails when items not all collected", () => {
      const mission = makeMission({
        items: [{ x: 1, y: 0, emoji: "⚙️" }, { x: 2, y: 0, emoji: "🔩" }],
        winCondition: { type: "collect_all" },
      });
      const { success } = executeBlocks(
        [block("right"), block("pick", "action")],
        mission,
      );
      expect(success).toBe(false);
    });

    it("execute_pattern succeeds with enough actions", () => {
      const mission = makeMission({
        winCondition: { type: "execute_pattern", minActions: 3 },
      });
      const { success } = executeBlocks(
        [block("right"), block("right"), block("right")],
        mission,
      );
      expect(success).toBe(true);
    });

    it("execute_pattern fails with too few actions", () => {
      const mission = makeMission({
        winCondition: { type: "execute_pattern", minActions: 5 },
      });
      const { success } = executeBlocks(
        [block("right"), block("right")],
        mission,
      );
      expect(success).toBe(false);
    });

    it("fatal crash always fails regardless of win condition", () => {
      const mission = makeMission({
        items: [{ x: 2, y: 0, emoji: "⚙️" }],
        obstacles: [{ x: 1, y: 0 }],
        winCondition: { type: "collect_all" },
      });
      const { success } = executeBlocks([block("right")], mission);
      expect(success).toBe(false);
    });
  });

  describe("tutorial integration", () => {
    it("tutorial 1 solution produces success", async () => {
      const { getMission } = await import("../../src/data/missions.js");
      const mission = getMission(1);
      const blocks = mission.solution.map((id) => {
        const b = mission.blocks.find((bl) => bl.id === id);
        return b ? { ...b } : { id, type: "action" };
      });
      const { success } = executeBlocks(blocks, mission);
      expect(success).toBe(true);
    });

    it("tutorial 2 solution produces success", async () => {
      const { getMission } = await import("../../src/data/missions.js");
      const mission = getMission(2);
      const blocks = mission.solution.map((id) => {
        const b = mission.blocks.find((bl) => bl.id === id);
        return b ? { ...b } : { id, type: "action" };
      });
      const { success } = executeBlocks(blocks, mission);
      expect(success).toBe(true);
    });

    it("tutorial 3 solution produces success", async () => {
      const { getMission } = await import("../../src/data/missions.js");
      const mission = getMission(3);
      // Tutorial 3 uses loops: ["repeat3", "right", "repeat3", "right", "pick"]
      // We need to reconstruct as block objects with children for loop blocks
      const blocks = [];
      const solution = mission.solution;
      let i = 0;
      while (i < solution.length) {
        const id = solution[i];
        if (id === "repeat2" || id === "repeat3") {
          const repeatCount = id === "repeat3" ? 3 : 2;
          const childId = solution[i + 1];
          const childBlock = mission.blocks.find((b) => b.id === childId);
          blocks.push({
            id,
            type: "loop",
            repeatCount,
            children: childBlock ? [{ ...childBlock }] : [{ id: childId, type: "direction" }],
          });
          i += 2;
        } else {
          const b = mission.blocks.find((bl) => bl.id === id);
          blocks.push(b ? { ...b } : { id, type: "action" });
          i++;
        }
      }
      const { success } = executeBlocks(blocks, mission);
      expect(success).toBe(true);
    });
  });
});
