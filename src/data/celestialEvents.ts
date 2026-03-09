// ─── Celestial Events — Single Source of Truth ───
// Shared between Cosmic Alignment constellation map and Alignment orrery page.
// Each event represents a force that shifts token probability distributions.

import type { CelestialEvent } from "@/types/game";

export const CELESTIAL_EVENTS: CelestialEvent[] = [
  { id: "nova", name: "Code Star Rising", glyph: "✦", targets: [0, 2, 5], modifier: 1.3 },
  { id: "eclipse", name: "Security Eclipse", glyph: "◐", targets: [1, 3, 6], modifier: 0.4 },
  { id: "conjunction", name: "Agent Conjunction", glyph: "⊛", targets: [2, 4], modifier: 1.5 },
  { id: "void", name: "Market Void", glyph: "◇", targets: [5, 6, 7], modifier: 0.6 },
  { id: "flare", name: "Token Flare", glyph: "❋", targets: [0, 4, 7], modifier: 1.4 },
];
