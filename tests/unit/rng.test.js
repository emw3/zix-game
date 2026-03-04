import { describe, it, expect } from "vitest";
import { createRNG } from "../../src/engine/rng.js";

describe("createRNG", () => {
  it("same seed produces identical sequence", () => {
    const a = createRNG(42);
    const b = createRNG(42);
    for (let i = 0; i < 100; i++) {
      expect(a()).toBe(b());
    }
  });

  it("different seeds produce different sequences", () => {
    const a = createRNG(1);
    const b = createRNG(2);
    const valsA = Array.from({ length: 10 }, () => a());
    const valsB = Array.from({ length: 10 }, () => b());
    expect(valsA).not.toEqual(valsB);
  });

  it("all values are in [0, 1)", () => {
    const rng = createRNG(123);
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("state advances on each call", () => {
    const rng = createRNG(7);
    const first = rng();
    const second = rng();
    const third = rng();
    expect(first).not.toBe(second);
    expect(second).not.toBe(third);
  });

  it("handles seed 0", () => {
    const rng = createRNG(0);
    const v = rng();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });

  it("handles negative seed", () => {
    const rng = createRNG(-999);
    const v = rng();
    expect(v).toBeGreaterThanOrEqual(0);
    expect(v).toBeLessThan(1);
  });
});
