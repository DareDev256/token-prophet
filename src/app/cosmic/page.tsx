"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORBS } from "@/components/ui/Orrery";
import { Button } from "@/components/ui/Button";

/** Star names for each orb index — thematic, not generic */
const STAR_NAMES = [
  "Apex Prime", "Shadow Drift", "Core Nexus", "Dim Veil",
  "Pulse Median", "Far Beacon", "Void Whisper", "Outer Fringe",
];

/** Constellation layout positions (% of SVG viewBox) */
const STAR_POS: [number, number][] = [
  [50, 14], [26, 28], [72, 22], [18, 52],
  [58, 44], [82, 56], [36, 72], [64, 80],
];

/** Events that affect each orb — derived from alignment page data */
const EVENT_MAP: { name: string; glyph: string; targets: number[]; mod: number }[] = [
  { name: "Code Star Rising", glyph: "✦", targets: [0, 2, 5], mod: 1.3 },
  { name: "Security Eclipse", glyph: "◐", targets: [1, 3, 6], mod: 0.4 },
  { name: "Agent Conjunction", glyph: "⊛", targets: [2, 4], mod: 1.5 },
  { name: "Market Void", glyph: "◇", targets: [5, 6, 7], mod: 0.6 },
  { name: "Token Flare", glyph: "❋", targets: [0, 4, 7], mod: 1.4 },
];

/** Compute all connection lines between orbs that share at least one event */
function buildEdges(): { from: number; to: number; events: string[] }[] {
  const edges: { from: number; to: number; events: string[] }[] = [];
  for (const ev of EVENT_MAP) {
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

export default function CosmicPage() {
  const [selected, setSelected] = useState<number | null>(null);
  const edges = useMemo(() => buildEdges(), []);

  const affectingEvents = selected !== null
    ? EVENT_MAP.filter((ev) => ev.targets.includes(selected))
    : [];

  const connectedStars = selected !== null
    ? new Set(
        edges
          .filter((e) => e.from === selected || e.to === selected)
          .flatMap((e) => [e.from, e.to])
      )
    : new Set<number>();

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4 relative z-10">
      <div className="fixed top-4 left-4 z-20">
        <Button href="/" variant="ghost">← BACK</Button>
      </div>

      <motion.h1
        className="font-pixel text-sm md:text-base text-game-secondary mb-1 tracking-wider"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        COSMIC ALIGNMENT
      </motion.h1>
      <motion.p
        className="font-pixel text-[8px] text-game-accent/50 mb-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        TAP A STAR TO REVEAL ITS INFLUENCES
      </motion.p>

      {/* Constellation SVG */}
      <motion.div
        className="w-full max-w-md aspect-square relative"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.3, type: "spring", stiffness: 120, damping: 16 }}
      >
        <svg viewBox="0 0 100 100" className="w-full h-full" role="img" aria-label="Constellation map of probability models">
          {/* Connection lines */}
          {edges.map((edge, i) => {
            const [x1, y1] = STAR_POS[edge.from];
            const [x2, y2] = STAR_POS[edge.to];
            const isLit = selected !== null && (edge.from === selected || edge.to === selected);
            return (
              <line
                key={i}
                x1={x1} y1={y1} x2={x2} y2={y2}
                stroke={isLit ? "#f1c40f" : "rgba(155,89,182,0.12)"}
                strokeWidth={isLit ? 0.4 : 0.2}
                style={{ transition: "all 0.6s ease-out" }}
              />
            );
          })}

          {/* Stars */}
          {ORBS.map((orb, i) => {
            const [cx, cy] = STAR_POS[i];
            const isSelected = selected === i;
            const isConnected = connectedStars.has(i);
            const w = orb.weight;
            const r = 1.2 + w * 2;
            const fill = w >= 0.5 ? "#f1c40f" : "#9b59b6";
            const dimmed = selected !== null && !isSelected && !isConnected;

            return (
              <g key={i} style={{ cursor: "pointer" }} onClick={() => setSelected(isSelected ? null : i)}>
                {/* Glow ring on selection */}
                {isSelected && (
                  <circle cx={cx} cy={cy} r={r + 3} fill="none" stroke="#f1c40f" strokeWidth={0.15} opacity={0.5}>
                    <animate attributeName="r" values={`${r + 2};${r + 4};${r + 2}`} dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.5;0.2;0.5" dur="2s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Star body */}
                <circle
                  cx={cx} cy={cy} r={r}
                  fill={fill}
                  opacity={dimmed ? 0.15 : 0.4 + w * 0.6}
                  style={{ transition: "all 0.5s ease-out", filter: isSelected ? `drop-shadow(0 0 3px ${fill})` : "none" }}
                >
                  <animate attributeName="opacity"
                    values={`${dimmed ? 0.1 : 0.4 + w * 0.5};${dimmed ? 0.15 : 0.5 + w * 0.5};${dimmed ? 0.1 : 0.4 + w * 0.5}`}
                    dur={`${3 + i * 0.5}s`} repeatCount="indefinite"
                  />
                </circle>
                {/* Label */}
                <text
                  x={cx} y={cy + r + 3}
                  textAnchor="middle"
                  fill={isSelected ? "#f1c40f" : "rgba(232,218,239,0.35)"}
                  fontSize="2.2"
                  fontFamily="'Press Start 2P', monospace"
                  style={{ transition: "fill 0.4s ease-out" }}
                >
                  {STAR_NAMES[i]}
                </text>
              </g>
            );
          })}
        </svg>
      </motion.div>

      {/* Influence panel */}
      <AnimatePresence mode="wait">
        {selected !== null && (
          <motion.div
            key={selected}
            className="mt-2 w-full max-w-xs"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ type: "spring", stiffness: 200, damping: 22 }}
          >
            <div className="font-pixel text-[8px] text-game-secondary text-center mb-2">
              {STAR_NAMES[selected]} — W:{(ORBS[selected].weight * 100).toFixed(0)}%
            </div>
            {affectingEvents.length > 0 ? (
              <div className="flex flex-col gap-1">
                {affectingEvents.map((ev) => (
                  <div
                    key={ev.name}
                    className="flex items-center gap-2 px-3 py-2 font-pixel text-[7px]"
                    style={{
                      background: "rgba(13,0,21,0.85)",
                      border: "1px solid rgba(241,196,15,0.15)",
                      color: ev.mod > 1 ? "#f1c40f" : "#9b59b6",
                    }}
                  >
                    <span style={{ filter: "drop-shadow(0 0 4px currentColor)", width: 16, textAlign: "center" }}>{ev.glyph}</span>
                    <span className="flex-1 uppercase tracking-wider">{ev.name}</span>
                    <span style={{ opacity: 0.6 }}>
                      {ev.mod > 1 ? `+${Math.round((ev.mod - 1) * 100)}%` : `−${Math.round((1 - ev.mod) * 100)}%`}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="font-pixel text-[7px] text-game-accent/30 text-center">
                NO CELESTIAL INFLUENCES DETECTED
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="font-pixel text-[7px] text-game-primary/30 mt-auto pt-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        EACH LINE REVEALS A SHARED CELESTIAL BOND
      </motion.p>
    </main>
  );
}
