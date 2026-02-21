"use client";

import { motion } from "framer-motion";

/** Each orb represents a token probability — brighter and larger = higher weight */
interface Orb {
  /** Orbital radius as % of container */
  radius: number;
  /** Animation duration in seconds (slower = outer orbit feel) */
  duration: number;
  /** Starting angle offset in degrees */
  offset: number;
  /** 0-1 probability weight controlling size + glow intensity */
  weight: number;
  /** Gold (high prob) vs purple (low prob) */
  hue: "gold" | "purple";
}

const ORBS: Orb[] = [
  { radius: 18, duration: 12, offset: 0, weight: 0.92, hue: "gold" },
  { radius: 18, duration: 12, offset: 180, weight: 0.45, hue: "purple" },
  { radius: 30, duration: 20, offset: 60, weight: 0.78, hue: "gold" },
  { radius: 30, duration: 20, offset: 200, weight: 0.3, hue: "purple" },
  { radius: 30, duration: 20, offset: 320, weight: 0.55, hue: "gold" },
  { radius: 42, duration: 32, offset: 30, weight: 0.65, hue: "gold" },
  { radius: 42, duration: 32, offset: 150, weight: 0.2, hue: "purple" },
  { radius: 42, duration: 32, offset: 270, weight: 0.38, hue: "purple" },
];

const colorMap = {
  gold: { core: "#f1c40f", glow: "rgba(241,196,15,0.6)" },
  purple: { core: "#9b59b6", glow: "rgba(155,89,182,0.4)" },
};

export function Orrery() {
  return (
    <motion.div
      className="orrery-container"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, ease: "easeOut" }}
      aria-hidden="true"
    >
      {/* Central prediction engine glow */}
      <div className="orrery-core" />

      {/* Orbital rings (visual guides) */}
      {[18, 30, 42].map((r) => (
        <div
          key={r}
          className="orrery-ring"
          style={{
            width: `${r * 2}%`,
            height: `${r * 2}%`,
          }}
        />
      ))}

      {/* Orbiting probability orbs */}
      {ORBS.map((orb, i) => {
        const size = 4 + orb.weight * 8; // 4-12px
        const { core, glow } = colorMap[orb.hue];
        return (
          <div
            key={i}
            className="orrery-orbit"
            style={{
              width: `${orb.radius * 2}%`,
              height: `${orb.radius * 2}%`,
              animationDuration: `${orb.duration}s`,
              animationDelay: `${-(orb.offset / 360) * orb.duration}s`,
            }}
          >
            <div
              className="orrery-orb"
              style={{
                width: `${size}px`,
                height: `${size}px`,
                background: core,
                boxShadow: `0 0 ${4 + orb.weight * 12}px ${glow}, 0 0 ${8 + orb.weight * 20}px ${glow}`,
                opacity: 0.4 + orb.weight * 0.6,
              }}
            />
          </div>
        );
      })}
    </motion.div>
  );
}
