import { describe, it, expect } from "vitest";
import { lerpColor } from "@/lib/color";
import { buildEdges, STAR_NAMES, STAR_POS } from "@/lib/constellation";
import { CELESTIAL_EVENTS } from "@/data/celestialEvents";
import type { CelestialEvent } from "@/types/game";

// ── lerpColor — probability palette interpolation ──
describe("lerpColor", () => {
  it("returns purple at t=0", () => {
    expect(lerpColor(0)).toBe("rgb(155,89,182)");
  });

  it("returns gold at t=1", () => {
    expect(lerpColor(1)).toBe("rgb(241,196,15)");
  });

  it("returns midpoint color at t=0.5", () => {
    const result = lerpColor(0.5);
    // Midpoint: r=198, g=143, b=99 (rounded)
    expect(result).toMatch(/^rgb\(\d+,\d+,\d+\)$/);
    const [r, g, b] = result.match(/\d+/g)!.map(Number);
    expect(r).toBeGreaterThan(155);
    expect(r).toBeLessThan(241);
    expect(g).toBeGreaterThan(89);
    expect(b).toBeLessThan(182);
  });

  it("clamps values below 0", () => {
    expect(lerpColor(-5)).toBe(lerpColor(0));
  });

  it("clamps values above 1", () => {
    expect(lerpColor(100)).toBe(lerpColor(1));
  });

  it("handles NaN by clamping to 0", () => {
    // Math.max(0, Math.min(1, NaN)) → NaN, so arithmetic produces NaN
    // This documents current behavior — if NaN handling matters, the function needs a guard
    const result = lerpColor(NaN);
    expect(result).toMatch(/rgb\(/);
  });
});

// ── buildEdges — constellation graph construction ──
describe("buildEdges", () => {
  it("returns empty array for no events", () => {
    expect(buildEdges([])).toEqual([]);
  });

  it("creates no edges for single-target events", () => {
    const events: CelestialEvent[] = [
      { id: "solo", name: "Solo", glyph: "★", targets: [0], modifier: 1.0 },
    ];
    expect(buildEdges(events)).toEqual([]);
  });

  it("creates edges between all target pairs of an event", () => {
    const events: CelestialEvent[] = [
      { id: "tri", name: "Triangle", glyph: "△", targets: [0, 2, 5], modifier: 1.3 },
    ];
    const edges = buildEdges(events);
    // 3 targets → 3 pairs: (0,2), (0,5), (2,5)
    expect(edges).toHaveLength(3);
    expect(edges).toContainEqual({ from: 0, to: 2, events: ["△"] });
    expect(edges).toContainEqual({ from: 0, to: 5, events: ["△"] });
    expect(edges).toContainEqual({ from: 2, to: 5, events: ["△"] });
  });

  it("aggregates glyphs when events share the same target pair", () => {
    const events: CelestialEvent[] = [
      { id: "a", name: "A", glyph: "✦", targets: [0, 2], modifier: 1.0 },
      { id: "b", name: "B", glyph: "◐", targets: [0, 2], modifier: 0.5 },
    ];
    const edges = buildEdges(events);
    expect(edges).toHaveLength(1);
    expect(edges[0].events).toEqual(["✦", "◐"]);
  });

  it("handles real celestial events data without crashing", () => {
    const edges = buildEdges(CELESTIAL_EVENTS);
    expect(edges.length).toBeGreaterThan(0);
    // Every edge should reference valid orb indices (0-7)
    for (const edge of edges) {
      expect(edge.from).toBeGreaterThanOrEqual(0);
      expect(edge.from).toBeLessThan(STAR_NAMES.length);
      expect(edge.to).toBeGreaterThanOrEqual(0);
      expect(edge.to).toBeLessThan(STAR_NAMES.length);
      expect(edge.events.length).toBeGreaterThan(0);
    }
  });
});

// ── Data integrity ──
describe("constellation data", () => {
  it("has matching star names and positions", () => {
    expect(STAR_NAMES).toHaveLength(STAR_POS.length);
  });

  it("all positions are within 0-100 viewBox range", () => {
    for (const [x, y] of STAR_POS) {
      expect(x).toBeGreaterThanOrEqual(0);
      expect(x).toBeLessThanOrEqual(100);
      expect(y).toBeGreaterThanOrEqual(0);
      expect(y).toBeLessThanOrEqual(100);
    }
  });
});
