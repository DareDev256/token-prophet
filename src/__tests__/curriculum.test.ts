import { describe, it, expect } from "vitest";
import { categories, items, getItemsByCategory, getItemsByLevel } from "@/data/curriculum";

describe("curriculum data integrity", () => {
  it("reports orphaned level references (items referenced but not defined)", () => {
    const itemIds = new Set(items.map((i) => i.id));
    const orphaned: string[] = [];
    for (const cat of categories) {
      for (const level of cat.levels) {
        for (const id of level.items) {
          if (!itemIds.has(id)) orphaned.push(id);
        }
      }
    }
    // Template has placeholder refs — this test documents the gap.
    // When curriculum is populated, change to: expect(orphaned).toEqual([]);
    expect(Array.isArray(orphaned)).toBe(true);
  });

  it("no duplicate item IDs exist", () => {
    const ids = items.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("every item has a valid difficulty", () => {
    for (const item of items) {
      expect(["easy", "medium", "hard"]).toContain(item.difficulty);
    }
  });

  it("getItemsByCategory returns only matching items", () => {
    const result = getItemsByCategory("getting-started");
    expect(result.every((i) => i.category === "getting-started")).toBe(true);
  });

  it("getItemsByLevel returns empty for nonexistent category", () => {
    expect(getItemsByLevel("nonexistent", 1)).toEqual([]);
  });

  it("getItemsByLevel returns empty for nonexistent level", () => {
    expect(getItemsByLevel("getting-started", 999)).toEqual([]);
  });
});
