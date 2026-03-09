// ─── Constellation Graph — Pure Computation ───
// Layout and edge-building logic for the cosmic constellation visualization.
// Separated from the page component so it can be tested and reused.

import type { CelestialEvent } from "@/types/game";

/** Star names for each orb index — thematic, not generic */
export const STAR_NAMES = [
  "Apex Prime", "Shadow Drift", "Core Nexus", "Dim Veil",
  "Pulse Median", "Far Beacon", "Void Whisper", "Outer Fringe",
];

/** Constellation layout positions (% of SVG viewBox) */
export const STAR_POS: [number, number][] = [
  [50, 14], [26, 28], [72, 22], [18, 52],
  [58, 44], [82, 56], [36, 72], [64, 80],
];

export interface ConstellationEdge {
  from: number;
  to: number;
  events: string[];
}

/** Compute connection lines between orbs that share at least one event */
export function buildEdges(events: CelestialEvent[]): ConstellationEdge[] {
  const edges: ConstellationEdge[] = [];
  for (const ev of events) {
    for (let a = 0; a < ev.targets.length; a++) {
      for (let b = a + 1; b < ev.targets.length; b++) {
        const existing = edges.find(
          (e) => e.from === ev.targets[a] && e.to === ev.targets[b]
        );
        if (existing) existing.events.push(ev.glyph);
        else edges.push({ from: ev.targets[a], to: ev.targets[b], events: [ev.glyph] });
      }
    }
  }
  return edges;
}
