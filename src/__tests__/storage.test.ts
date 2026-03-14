import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  getProgress,
  saveProgress,
  updateProgress,
  addXP,
  getRecallMultiplier,
  completeLevel,
  updateItemScore,
  saveFSRSCard,
  getFSRSCards,
  getDueItems,
  getItemsForReview,
  updateStreak,
  recordMasteryAttempt,
  checkMastery,
  recordLearningEvent,
  getLearningAnalytics,
  resetProgress,
} from "@/lib/storage";
import type { FSRSCard } from "@/lib/storage";

// ── localStorage mock ──────────────────────────
// Stub `window` so SSR guards (`typeof window === "undefined"`) pass in Node.
vi.stubGlobal("window", globalThis);

const store: Record<string, string> = {};
const localStorageMock = {
  getItem: (key: string) => store[key] ?? null,
  setItem: (key: string, value: string) => { store[key] = value; },
  removeItem: (key: string) => { delete store[key]; },
  clear: () => { Object.keys(store).forEach((k) => delete store[k]); },
};
vi.stubGlobal("localStorage", localStorageMock);

beforeEach(() => {
  Object.keys(store).forEach((k) => delete store[k]);
});

// ── Progress CRUD ──────────────────────────────
describe("getProgress", () => {
  it("returns defaults when localStorage is empty", () => {
    const p = getProgress();
    expect(p.xp).toBe(0);
    expect(p.level).toBe(1);
    expect(p.streak).toBe(0);
    expect(p.completedLevels).toEqual([]);
  });

  it("merges stored data with defaults (forward compat)", () => {
    store["token_prophet_progress"] = JSON.stringify({ xp: 42 });
    const p = getProgress();
    expect(p.xp).toBe(42);
    expect(p.level).toBe(1); // default filled in
    expect(p.completedLevels).toEqual([]); // default filled in
  });

  it("survives corrupted JSON gracefully", () => {
    store["token_prophet_progress"] = "not-json{{{";
    const p = getProgress();
    expect(p.xp).toBe(0); // falls back to defaults
  });
});

describe("saveProgress / updateProgress", () => {
  it("round-trips progress through localStorage", () => {
    saveProgress({ xp: 100, level: 2, currentCategory: "c1", completedLevels: ["c1-1"], streak: 3, streakFreezes: 1, itemScores: {} });
    const p = getProgress();
    expect(p.xp).toBe(100);
    expect(p.level).toBe(2);
    expect(p.completedLevels).toEqual(["c1-1"]);
  });

  it("merges partial updates without clobbering unrelated fields", () => {
    saveProgress({ xp: 50, level: 1, currentCategory: "", completedLevels: ["a-1"], streak: 5, streakFreezes: 0, itemScores: {} });
    updateProgress({ xp: 75 });
    const p = getProgress();
    expect(p.xp).toBe(75);
    expect(p.completedLevels).toEqual(["a-1"]); // preserved
    expect(p.streak).toBe(5); // preserved
  });
});

// ── XP System ──────────────────────────────────
describe("addXP", () => {
  it("adds base XP and computes level from total", () => {
    addXP(50);
    const p = getProgress();
    expect(p.xp).toBe(50);
    expect(p.level).toBe(1); // 50/100 + 1 = 1
  });

  it("levels up at 100 XP boundary", () => {
    addXP(100);
    expect(getProgress().level).toBe(2);
  });

  it("applies multiplier and rounds correctly", () => {
    addXP(33, 2.5); // 33 * 2.5 = 82.5 -> 83
    expect(getProgress().xp).toBe(83);
  });

  it("accumulates across multiple calls", () => {
    addXP(60);
    addXP(60);
    const p = getProgress();
    expect(p.xp).toBe(120);
    expect(p.level).toBe(2); // floor(120/100) + 1
  });
});

describe("getRecallMultiplier", () => {
  it("returns 1x for never-seen items", () => {
    expect(getRecallMultiplier("unknown-item")).toBe(1);
  });

  it("returns 1x for recently-seen items", () => {
    updateProgress({ itemScores: { "item-1": { correct: 1, incorrect: 0, lastSeen: Date.now() - 1000 } } });
    expect(getRecallMultiplier("item-1")).toBe(1);
  });

  it("returns 2x for 7-day recall", () => {
    const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
    updateProgress({ itemScores: { "item-1": { correct: 1, incorrect: 0, lastSeen: sevenDaysAgo } } });
    expect(getRecallMultiplier("item-1")).toBe(2);
  });

  it("returns 3x for 30-day recall", () => {
    const thirtyDaysAgo = Date.now() - 30 * 24 * 60 * 60 * 1000;
    updateProgress({ itemScores: { "item-1": { correct: 1, incorrect: 0, lastSeen: thirtyDaysAgo } } });
    expect(getRecallMultiplier("item-1")).toBe(3);
  });

  it("returns 1x when correct count is zero (first time)", () => {
    updateProgress({ itemScores: { "item-1": { correct: 0, incorrect: 2, lastSeen: Date.now() - 30 * 86400000 } } });
    expect(getRecallMultiplier("item-1")).toBe(1);
  });
});

// ── Level Completion ───────────────────────────
describe("completeLevel", () => {
  it("adds level to completed list", () => {
    completeLevel("basics", 1);
    expect(getProgress().completedLevels).toContain("basics-1");
  });

  it("does not duplicate already-completed levels", () => {
    completeLevel("basics", 1);
    completeLevel("basics", 1);
    expect(getProgress().completedLevels.filter((l) => l === "basics-1")).toHaveLength(1);
  });

  it("awards streak freeze every 10 levels", () => {
    for (let i = 1; i <= 10; i++) completeLevel("cat", i);
    expect(getProgress().streakFreezes).toBe(1);
  });

  it("does not award freeze at non-10 boundaries", () => {
    for (let i = 1; i <= 9; i++) completeLevel("cat", i);
    expect(getProgress().streakFreezes).toBe(0);
  });
});

// ── Item Scoring ───────────────────────────────
describe("updateItemScore", () => {
  it("initializes score for new item on correct answer", () => {
    updateItemScore("new-item", true);
    const scores = getProgress().itemScores["new-item"];
    expect(scores.correct).toBe(1);
    expect(scores.incorrect).toBe(0);
  });

  it("increments incorrect on wrong answer", () => {
    updateItemScore("item", false);
    updateItemScore("item", false);
    expect(getProgress().itemScores["item"].incorrect).toBe(2);
  });

  it("updates lastSeen timestamp", () => {
    const before = Date.now();
    updateItemScore("item", true);
    const after = Date.now();
    const lastSeen = getProgress().itemScores["item"].lastSeen;
    expect(lastSeen).toBeGreaterThanOrEqual(before);
    expect(lastSeen).toBeLessThanOrEqual(after);
  });
});

// ── FSRS Cards ─────────────────────────────────
describe("FSRS card storage", () => {
  const makeCard = (id: string, due = Date.now()): FSRSCard => ({
    itemId: id, due, stability: 1, difficulty: 0.5, reps: 0, lapses: 0, lastReview: Date.now(),
  });

  it("stores and retrieves cards", () => {
    saveFSRSCard(makeCard("a"));
    saveFSRSCard(makeCard("b"));
    expect(getFSRSCards()).toHaveLength(2);
  });

  it("updates existing card by itemId instead of duplicating", () => {
    saveFSRSCard(makeCard("a"));
    saveFSRSCard({ ...makeCard("a"), reps: 5 });
    const cards = getFSRSCards();
    expect(cards).toHaveLength(1);
    expect(cards[0].reps).toBe(5);
  });

  it("getDueItems returns only past-due cards sorted by due date", () => {
    const past = Date.now() - 10000;
    const future = Date.now() + 100000;
    saveFSRSCard(makeCard("late", past));
    saveFSRSCard(makeCard("future", future));
    saveFSRSCard(makeCard("earlier", past - 5000));
    const due = getDueItems();
    expect(due).toEqual(["earlier", "late"]); // sorted, excludes future
  });

  it("getDueItems respects limit parameter", () => {
    for (let i = 0; i < 10; i++) saveFSRSCard(makeCard(`item-${i}`, Date.now() - i * 1000));
    expect(getDueItems(3)).toHaveLength(3);
  });

  it("returns empty array when FSRS storage is corrupted", () => {
    store["token_prophet_fsrs_cards"] = "not-valid-json{{";
    expect(getFSRSCards()).toEqual([]);
    expect(getDueItems()).toEqual([]);
  });
});

// ── Review Queue Fallback ──────────────────────
describe("getItemsForReview", () => {
  it("prefers FSRS-scheduled items when available", () => {
    saveFSRSCard({ itemId: "fsrs-item", due: Date.now() - 1000, stability: 1, difficulty: 0.5, reps: 1, lapses: 0, lastReview: Date.now() });
    updateProgress({ itemScores: { "weak-item": { correct: 0, incorrect: 5, lastSeen: Date.now() } } });
    expect(getItemsForReview()).toContain("fsrs-item");
  });

  it("falls back to incorrect-heavy items when no FSRS cards due", () => {
    updateProgress({ itemScores: {
      "strong": { correct: 10, incorrect: 0, lastSeen: Date.now() },
      "weak": { correct: 0, incorrect: 5, lastSeen: Date.now() - 1000 },
    }});
    const review = getItemsForReview();
    expect(review).toContain("weak");
    expect(review).not.toContain("strong");
  });
});

// ── Streak System ──────────────────────────────
describe("updateStreak", () => {
  it("increments streak when last played yesterday", () => {
    saveProgress({ xp: 0, level: 1, currentCategory: "", completedLevels: [], streak: 5, streakFreezes: 0, itemScores: {} });
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    store["token_prophet_last_played"] = yesterday;
    const result = updateStreak();
    expect(result.streak).toBe(6);
  });

  it("uses streak freeze when a day is missed", () => {
    saveProgress({ xp: 0, level: 1, currentCategory: "", completedLevels: [], streak: 5, streakFreezes: 2, itemScores: {} });
    store["token_prophet_last_played"] = "Mon Jan 01 2024"; // long ago
    const result = updateStreak();
    expect(result.streak).toBe(5); // preserved
    expect(result.streakFreezes).toBe(1); // consumed one
  });

  it("resets streak when missed and no freezes available", () => {
    saveProgress({ xp: 0, level: 1, currentCategory: "", completedLevels: [], streak: 5, streakFreezes: 0, itemScores: {} });
    store["token_prophet_last_played"] = "Mon Jan 01 2024";
    const result = updateStreak();
    expect(result.streak).toBe(1);
  });

  it("does not change streak when already played today", () => {
    saveProgress({ xp: 0, level: 1, currentCategory: "", completedLevels: [], streak: 3, streakFreezes: 0, itemScores: {} });
    store["token_prophet_last_played"] = new Date().toDateString();
    const result = updateStreak();
    expect(result.streak).toBe(3);
  });
});

// ── Mastery Gate ───────────────────────────────
describe("mastery system", () => {
  it("requires 3 attempts minimum", () => {
    recordMasteryAttempt("level-1", 95);
    recordMasteryAttempt("level-1", 95);
    expect(checkMastery("level-1")).toBe(false);
  });

  it("passes mastery with 3 consecutive 90%+ attempts", () => {
    recordMasteryAttempt("level-1", 90);
    recordMasteryAttempt("level-1", 92);
    recordMasteryAttempt("level-1", 95);
    expect(checkMastery("level-1")).toBe(true);
  });

  it("fails mastery if any of last 3 attempts is below 90%", () => {
    recordMasteryAttempt("level-1", 95);
    recordMasteryAttempt("level-1", 89); // below threshold
    recordMasteryAttempt("level-1", 95);
    expect(checkMastery("level-1")).toBe(false);
  });

  it("only considers last 3 attempts (sliding window)", () => {
    recordMasteryAttempt("level-1", 50); // old, should be ignored
    recordMasteryAttempt("level-1", 50); // old
    recordMasteryAttempt("level-1", 91);
    recordMasteryAttempt("level-1", 92);
    recordMasteryAttempt("level-1", 93);
    expect(checkMastery("level-1")).toBe(true);
  });
});

// ── Learning Analytics ─────────────────────────
describe("learning analytics", () => {
  it("tracks unique items seen", () => {
    recordLearningEvent({ type: "first_correct", itemId: "a", timestamp: Date.now() });
    recordLearningEvent({ type: "first_correct", itemId: "b", timestamp: Date.now() });
    recordLearningEvent({ type: "review_correct", itemId: "a", timestamp: Date.now() });
    const analytics = getLearningAnalytics();
    expect(analytics.totalItemsSeen).toBe(2); // a and b, not 3
  });

  it("computes 7-day retention rate", () => {
    recordLearningEvent({ type: "review_correct", itemId: "a", timestamp: Date.now(), daysSinceLastSeen: 8 });
    recordLearningEvent({ type: "review_incorrect", itemId: "b", timestamp: Date.now(), daysSinceLastSeen: 10 });
    const analytics = getLearningAnalytics();
    expect(analytics.retentionRate7Day).toBe(50); // 1 correct / 2 attempts
  });

  it("trims events to last 1000", () => {
    for (let i = 0; i < 1050; i++) {
      recordLearningEvent({ type: "first_correct", itemId: `item-${i}`, timestamp: Date.now() });
    }
    const stored = JSON.parse(store["token_prophet_analytics"]);
    expect(stored.length).toBe(1000);
  });

  it("returns 0 retention when no review events exist", () => {
    recordLearningEvent({ type: "first_correct", itemId: "a", timestamp: Date.now() });
    const analytics = getLearningAnalytics();
    expect(analytics.retentionRate7Day).toBe(0);
    expect(analytics.retentionRate30Day).toBe(0);
  });

  it("excludes reviews with daysSinceLastSeen < 7 from 7-day retention", () => {
    recordLearningEvent({ type: "review_correct", itemId: "a", timestamp: Date.now(), daysSinceLastSeen: 3 });
    recordLearningEvent({ type: "review_correct", itemId: "b", timestamp: Date.now(), daysSinceLastSeen: 8 });
    const analytics = getLearningAnalytics();
    // Only 1 review qualifies (8 days), and it's correct → 100%
    expect(analytics.retentionRate7Day).toBe(100);
  });

  it("counts mastered items correctly", () => {
    recordLearningEvent({ type: "concept_mastered", itemId: "a", timestamp: Date.now() });
    recordLearningEvent({ type: "concept_mastered", itemId: "b", timestamp: Date.now() });
    recordLearningEvent({ type: "first_correct", itemId: "c", timestamp: Date.now() });
    expect(getLearningAnalytics().itemsMastered).toBe(2);
  });

  it("survives corrupted analytics JSON gracefully", () => {
    store["token_prophet_analytics"] = "broken{{{";
    const analytics = getLearningAnalytics();
    expect(analytics.totalItemsSeen).toBe(0);
    expect(analytics.retentionRate7Day).toBe(0);
  });
});

// ── Reset ──────────────────────────────────────
describe("resetProgress", () => {
  it("clears all storage keys", () => {
    saveProgress({ xp: 999, level: 10, currentCategory: "x", completedLevels: ["x-1"], streak: 50, streakFreezes: 5, itemScores: {} });
    saveFSRSCard({ itemId: "a", due: 0, stability: 1, difficulty: 0.5, reps: 0, lapses: 0, lastReview: 0 });
    recordMasteryAttempt("x-1", 95);
    resetProgress();
    expect(getProgress().xp).toBe(0);
    expect(getFSRSCards()).toEqual([]);
  });
});
