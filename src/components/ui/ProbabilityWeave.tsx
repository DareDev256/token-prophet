"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ORBS } from "./Orrery";
import { lerpColor } from "@/lib/color";

/** Thread labels matching ORBS order — what each probability orb represents */
const THREAD_LABELS = [
  "the", "is", "of", "function", "return", "async", "import", "class",
];

/** Generate a Bézier thread path from center to outer edge */
function threadPath(
  index: number,
  total: number,
  cx: number,
  cy: number,
  radius: number,
  pull: number,
): string {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  const ex = cx + Math.cos(angle) * radius;
  const ey = cy + Math.sin(angle) * radius;

  // Control point perpendicular to the thread direction — pull bows it outward
  const mid = 0.5;
  const mx = cx + Math.cos(angle) * radius * mid;
  const my = cy + Math.sin(angle) * radius * mid;
  const perpAngle = angle + Math.PI / 2;
  const cpx = mx + Math.cos(perpAngle) * pull;
  const cpy = my + Math.sin(perpAngle) * pull;

  return `M ${cx} ${cy} Q ${cpx} ${cpy} ${ex} ${ey}`;
}

export function ProbabilityWeave() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const total = ORBS.length;
  const cx = 200;
  const cy = 200;
  const radius = 160;

  const handleHover = useCallback((i: number | null) => setHoveredIndex(i), []);

  return (
    <div className="probability-weave" role="figure" aria-label="Probability Weave — fate threads showing token prediction likelihood">
      <svg
        viewBox="0 0 400 400"
        className="weave-svg"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Loom center glow */}
        <circle cx={cx} cy={cy} r="6" fill="#f1c40f" opacity="0.9">
          <animate attributeName="r" values="5;7;5" dur="3s" repeatCount="indefinite" />
          <animate attributeName="opacity" values="0.7;1;0.7" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx={cx} cy={cy} r="18" fill="none" stroke="rgba(241,196,15,0.15)" strokeWidth="1">
          <animate attributeName="r" values="16;22;16" dur="4s" repeatCount="indefinite" />
        </circle>

        {/* Fate threads */}
        {ORBS.map((orb, i) => {
          const isHovered = hoveredIndex === i;
          const isDimmed = hoveredIndex !== null && !isHovered;
          const pull = isHovered ? 30 : 0;
          const w = orb.weight;
          const strokeW = 1 + w * 4;
          const color = lerpColor(w);
          const angle = (i / total) * Math.PI * 2 - Math.PI / 2;
          const labelX = cx + Math.cos(angle) * (radius + 16);
          const labelY = cy + Math.sin(angle) * (radius + 16);

          return (
            <g key={i}>
              <path
                d={threadPath(i, total, cx, cy, radius, pull)}
                stroke={color}
                strokeWidth={isHovered ? strokeW + 2 : strokeW}
                fill="none"
                opacity={isDimmed ? 0.15 : 0.7 + w * 0.3}
                strokeLinecap="round"
                className="weave-thread"
                onMouseEnter={() => handleHover(i)}
                onMouseLeave={() => handleHover(null)}
                onFocus={() => handleHover(i)}
                onBlur={() => handleHover(null)}
                tabIndex={0}
                role="button"
                aria-label={`Token "${THREAD_LABELS[i]}" — ${Math.round(w * 100)}% probability`}
                style={{
                  filter: isHovered ? `drop-shadow(0 0 8px ${color})` : "none",
                  cursor: "pointer",
                }}
              >
                <title>{THREAD_LABELS[i]}: {Math.round(w * 100)}%</title>
              </path>

              {/* Endpoint orb */}
              <circle
                cx={cx + Math.cos(angle) * radius}
                cy={cy + Math.sin(angle) * radius}
                r={isHovered ? 5 + w * 4 : 3 + w * 3}
                fill={color}
                opacity={isDimmed ? 0.2 : 0.8}
                className="weave-thread"
                style={{
                  filter: isHovered ? `drop-shadow(0 0 12px ${color})` : `drop-shadow(0 0 4px ${color})`,
                }}
              />

              {/* Label */}
              <text
                x={labelX}
                y={labelY}
                textAnchor="middle"
                dominantBaseline="middle"
                fill={isDimmed ? "rgba(232,218,239,0.15)" : color}
                fontSize="9"
                fontFamily="'Press Start 2P', monospace"
                className="weave-thread"
              >
                {THREAD_LABELS[i]}
              </text>
            </g>
          );
        })}
      </svg>

      {/* Detail panel */}
      <AnimatePresence>
        {hoveredIndex !== null && (
          <motion.div
            className="weave-detail"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
          >
            <span className="weave-detail__token">
              &quot;{THREAD_LABELS[hoveredIndex]}&quot;
            </span>
            <span className="weave-detail__bar" style={{
              width: `${ORBS[hoveredIndex].weight * 100}%`,
              background: lerpColor(ORBS[hoveredIndex].weight),
              boxShadow: `0 0 8px ${lerpColor(ORBS[hoveredIndex].weight)}`,
            }} />
            <span className="weave-detail__pct">
              {Math.round(ORBS[hoveredIndex].weight * 100)}%
            </span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
