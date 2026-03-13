import { ContentItem } from "@/types/game";

// ─── Diversity Pipeline ───
// Precomputes pairwise Jaccard similarity in a flat Float64Array matrix.
// Used to select maximally diverse next items during gameplay — O(1) lookups
// after a one-time O(N²) init. Zero GC pressure during play.

/** Tokenize an item into a feature set for Jaccard comparison. */
function featurize(item: ContentItem): Set<string> {
  const features = new Set<string>();
  features.add(`cat:${item.category}`);
  features.add(`diff:${item.difficulty}`);
  // Split prompt into lowercase word stems (cheap tokenization)
  const words = item.prompt.toLowerCase().split(/\s+/);
  for (const w of words) {
    if (w.length > 2) features.add(`w:${w}`);
  }
  return features;
}

/** Jaccard similarity: |A∩B| / |A∪B|. Returns 0–1. */
function jaccard(a: Set<string>, b: Set<string>): number {
  let intersection = 0;
  for (const v of a) {
    if (b.has(v)) intersection++;
  }
  const union = a.size + b.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

/** Precomputed similarity matrix — flat Float64Array, row-major. */
export interface DiversityMatrix {
  /** Flat N×N similarity values, row-major order. */
  data: Float64Array;
  /** Item IDs in index order. */
  ids: string[];
  /** Fast ID → index lookup. */
  index: Map<string, number>;
}

/** Build the full pairwise similarity matrix. O(N²) — call once at init. */
export function buildDiversityMatrix(items: ContentItem[]): DiversityMatrix {
  const n = items.length;
  const data = new Float64Array(n * n);
  const ids = items.map((item) => item.id);
  const index = new Map<string, number>();
  ids.forEach((id, i) => index.set(id, i));

  // Precompute feature sets
  const features = items.map(featurize);

  // Fill upper triangle + mirror to lower
  for (let i = 0; i < n; i++) {
    data[i * n + i] = 1; // self-similarity = 1
    for (let j = i + 1; j < n; j++) {
      const sim = jaccard(features[i], features[j]);
      data[i * n + j] = sim;
      data[j * n + i] = sim;
    }
  }

  return { data, ids, index };
}

/** Look up precomputed similarity between two items. O(1). */
export function getSimilarity(matrix: DiversityMatrix, idA: string, idB: string): number {
  const a = matrix.index.get(idA);
  const b = matrix.index.get(idB);
  if (a === undefined || b === undefined) return 0;
  return matrix.data[a * matrix.ids.length + b];
}

/**
 * Find the index of the best seed item — the one with lowest average
 * similarity to all others (most "unique" starting point).
 */
export function findSeedIndex(matrix: DiversityMatrix): number {
  const n = matrix.ids.length;
  if (n === 0) return -1;
  let bestIdx = 0;
  let bestAvg = Infinity;

  for (let i = 0; i < n; i++) {
    let sum = 0;
    for (let j = 0; j < n; j++) {
      sum += matrix.data[i * n + j];
    }
    const avg = sum / n;
    if (avg < bestAvg) {
      bestAvg = avg;
      bestIdx = i;
    }
  }
  return bestIdx;
}

/**
 * Select `count` maximally diverse items using greedy farthest-first traversal.
 * Starts from the seed (lowest avg similarity), then repeatedly picks the
 * candidate with minimum similarity to already-selected items.
 */
export function diversifyResults(
  matrix: DiversityMatrix,
  candidates: string[],
  count: number,
): string[] {
  const valid = candidates.filter((id) => matrix.index.has(id));
  if (valid.length <= count) return valid;

  const n = matrix.ids.length;
  const selected: string[] = [];
  const remaining = new Set(valid);

  // Start from seed
  const seedIdx = findSeedIndex(matrix);
  const seedId = matrix.ids[seedIdx];
  if (remaining.has(seedId)) {
    selected.push(seedId);
    remaining.delete(seedId);
  } else {
    // Fallback: pick first candidate
    const first = valid[0];
    selected.push(first);
    remaining.delete(first);
  }

  // Greedy farthest-first
  while (selected.length < count && remaining.size > 0) {
    let bestId = "";
    let bestMinSim = Infinity;

    for (const cId of remaining) {
      const cIdx = matrix.index.get(cId)!;
      let maxSimToSelected = 0;
      for (const sId of selected) {
        const sIdx = matrix.index.get(sId)!;
        const sim = matrix.data[cIdx * n + sIdx];
        if (sim > maxSimToSelected) maxSimToSelected = sim;
      }
      // We want the candidate whose MAX similarity to selected is LOWEST
      if (maxSimToSelected < bestMinSim) {
        bestMinSim = maxSimToSelected;
        bestId = cId;
      }
    }

    selected.push(bestId);
    remaining.delete(bestId);
  }

  return selected;
}

/**
 * Compute a diversity profile for a set of items — average pairwise distance.
 * Returns 0 (identical) to 1 (maximally diverse). Uses the precomputed matrix.
 */
export function diversityProfile(matrix: DiversityMatrix, itemIds: string[]): number {
  const valid = itemIds.filter((id) => matrix.index.has(id));
  if (valid.length < 2) return 0;

  const n = matrix.ids.length;
  let totalDistance = 0;
  let pairs = 0;

  for (let i = 0; i < valid.length; i++) {
    for (let j = i + 1; j < valid.length; j++) {
      const a = matrix.index.get(valid[i])!;
      const b = matrix.index.get(valid[j])!;
      totalDistance += 1 - matrix.data[a * n + b]; // distance = 1 - similarity
      pairs++;
    }
  }

  return pairs === 0 ? 0 : totalDistance / pairs;
}
