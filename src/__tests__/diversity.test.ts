import { describe, it, expect } from "vitest";
import {
  buildDiversityMatrix,
  getSimilarity,
  findSeedIndex,
  diversifyResults,
  diversityProfile,
} from "@/lib/diversity";
import { ContentItem } from "@/types/game";

// ─── Test fixtures ───
function makeItem(id: string, category: string, difficulty: "easy" | "medium" | "hard", prompt: string): ContentItem {
  return { id, category, difficulty, prompt, answer: "x" };
}

const ITEMS: ContentItem[] = [
  makeItem("a1", "syntax", "easy", "The cat sat on the mat"),
  makeItem("a2", "syntax", "easy", "The cat sat on the rug"),
  makeItem("b1", "semantics", "medium", "Neural networks learn patterns from data"),
  makeItem("b2", "semantics", "hard", "Transformers use attention to weigh token relevance"),
  makeItem("c1", "pragmatics", "hard", "The stock market crashed today after the announcement"),
];

describe("buildDiversityMatrix", () => {
  it("creates a symmetric N×N matrix", () => {
    const m = buildDiversityMatrix(ITEMS);
    expect(m.ids).toHaveLength(5);
    expect(m.data).toHaveLength(25);
    // Symmetry
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 5; j++) {
        expect(m.data[i * 5 + j]).toBeCloseTo(m.data[j * 5 + i], 10);
      }
    }
  });

  it("diagonal is 1 (self-similarity)", () => {
    const m = buildDiversityMatrix(ITEMS);
    for (let i = 0; i < 5; i++) {
      expect(m.data[i * 5 + i]).toBe(1);
    }
  });

  it("similar items have higher similarity", () => {
    const m = buildDiversityMatrix(ITEMS);
    const simAA = getSimilarity(m, "a1", "a2"); // same category, difficulty, overlapping words
    const simAB = getSimilarity(m, "a1", "b1"); // different category, difficulty, no word overlap
    expect(simAA).toBeGreaterThan(simAB);
  });

  it("handles empty input", () => {
    const m = buildDiversityMatrix([]);
    expect(m.ids).toHaveLength(0);
    expect(m.data).toHaveLength(0);
  });
});

describe("getSimilarity", () => {
  it("returns 0 for unknown IDs", () => {
    const m = buildDiversityMatrix(ITEMS);
    expect(getSimilarity(m, "a1", "unknown")).toBe(0);
    expect(getSimilarity(m, "unknown", "unknown2")).toBe(0);
  });
});

describe("findSeedIndex", () => {
  it("returns the most unique item", () => {
    const m = buildDiversityMatrix(ITEMS);
    const seed = findSeedIndex(m);
    // Seed should be a valid index
    expect(seed).toBeGreaterThanOrEqual(0);
    expect(seed).toBeLessThan(5);
    // Should NOT be one of the near-duplicate syntax items
    const seedId = m.ids[seed];
    expect(["b1", "b2", "c1"]).toContain(seedId);
  });

  it("returns -1 for empty matrix", () => {
    const m = buildDiversityMatrix([]);
    expect(findSeedIndex(m)).toBe(-1);
  });
});

describe("diversifyResults", () => {
  it("selects diverse subset from candidates", () => {
    const m = buildDiversityMatrix(ITEMS);
    const result = diversifyResults(m, ["a1", "a2", "b1", "b2", "c1"], 3);
    expect(result).toHaveLength(3);
    // Should not select both near-duplicate syntax items
    const hasBothSyntax = result.includes("a1") && result.includes("a2");
    expect(hasBothSyntax).toBe(false);
  });

  it("returns all candidates when count >= candidates.length", () => {
    const m = buildDiversityMatrix(ITEMS);
    const result = diversifyResults(m, ["a1", "b1"], 5);
    expect(result).toHaveLength(2);
  });

  it("filters out unknown IDs", () => {
    const m = buildDiversityMatrix(ITEMS);
    const result = diversifyResults(m, ["a1", "unknown", "b1"], 2);
    expect(result).toHaveLength(2);
    expect(result).not.toContain("unknown");
  });
});

describe("diversityProfile", () => {
  it("returns higher score for diverse sets", () => {
    const m = buildDiversityMatrix(ITEMS);
    const diverseScore = diversityProfile(m, ["a1", "b1", "c1"]);
    const similarScore = diversityProfile(m, ["a1", "a2"]);
    expect(diverseScore).toBeGreaterThan(similarScore);
  });

  it("returns 0 for single item", () => {
    const m = buildDiversityMatrix(ITEMS);
    expect(diversityProfile(m, ["a1"])).toBe(0);
  });

  it("returns 0 for empty set", () => {
    const m = buildDiversityMatrix(ITEMS);
    expect(diversityProfile(m, [])).toBe(0);
  });
});
