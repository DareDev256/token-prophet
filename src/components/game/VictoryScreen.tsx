"use client";

import { useMemo } from "react";
import { motion } from "framer-motion";
import { GameResults } from "@/types/game";
import { Button } from "@/components/ui/Button";

// ─── Oracle Prophecies ───
// Mystical grade-specific messages that reward high performance with thematic flavor.
const PROPHECIES: Record<string, string[]> = {
  S: [
    "The tokens bow before your sight.",
    "You have gazed beyond the veil of probability.",
    "The oracle speaks through you now.",
  ],
  A: [
    "The stars align in your favor, Prophet.",
    "Your predictions ripple across the latent space.",
    "Few mortals read the token stream so clearly.",
  ],
  B: [
    "The constellations recognize your effort.",
    "Your sight grows sharper with each reading.",
    "The probability weave responds to your touch.",
  ],
  C: [
    "The mist parts slowly… keep seeking.",
    "Not all tokens reveal themselves at first glance.",
    "The oracle sees potential in your future.",
  ],
  D: [
    "The cosmic noise is thick today.",
    "Even the oracle stumbles in low-probability space.",
    "Return when the celestial alignment favors you.",
  ],
  F: [
    "The void consumes this reading. Try again.",
    "The tokens scatter — regroup, Prophet.",
    "Even oracles must train before they prophesy.",
  ],
};

// ─── Star Particle Generation ───
// Pre-compute random positions for the burst effect so they don't shift on re-render.
interface StarParticle {
  id: number;
  angle: number;    // radians — direction from center
  distance: number; // px — how far to fly
  size: number;     // px
  delay: number;    // seconds
  duration: number; // seconds
  glyph: string;
}

const STAR_GLYPHS = ["✦", "✧", "⊹", "✶", "⋆", "◇"];

function generateStars(count: number, seed: number): StarParticle[] {
  // Deterministic-ish distribution using seed to vary per grade
  return Array.from({ length: count }, (_, i) => ({
    id: i,
    angle: ((i * 137.508 + seed * 47) % 360) * (Math.PI / 180), // golden angle spiral
    distance: 60 + ((i * 31 + seed * 13) % 80),
    size: 8 + ((i * 7 + seed) % 10),
    delay: 0.1 + (i * 0.04),
    duration: 0.6 + ((i * 11) % 4) * 0.1,
    glyph: STAR_GLYPHS[i % STAR_GLYPHS.length],
  }));
}

interface VictoryScreenProps {
  results: GameResults;
  onPlayAgain: () => void;
  onBackToMenu: () => void;
  speedLabel?: string;
}

export function VictoryScreen({
  results,
  onPlayAgain,
  onBackToMenu,
  speedLabel = "Speed",
}: VictoryScreenProps) {
  const grade =
    results.accuracy >= 95 ? "S" :
    results.accuracy >= 90 ? "A" :
    results.accuracy >= 80 ? "B" :
    results.accuracy >= 70 ? "C" :
    results.accuracy >= 60 ? "D" : "F";

  const isHighGrade = grade === "S" || grade === "A";
  const starCount = isHighGrade ? 18 : grade === "B" ? 10 : 5;
  const stars = useMemo(() => generateStars(starCount, grade.charCodeAt(0)), [starCount, grade]);

  // Deterministic prophecy selection — derive from results to avoid Math.random() in render
  const prophecy = useMemo(() => {
    const pool = PROPHECIES[grade] ?? PROPHECIES.F;
    const seed = (results.correctAnswers * 7 + results.totalQuestions * 13) % pool.length;
    return pool[seed];
  }, [grade, results.correctAnswers, results.totalQuestions]);

  // Grade-specific aura color (raw CSS values — avoids Tailwind purge issues)
  const auraColor =
    grade === "S" ? "rgba(241, 196, 15, 0.35)" :
    grade === "A" ? "rgba(155, 89, 182, 0.3)" :
    grade === "B" ? "rgba(232, 218, 239, 0.2)" :
    "rgba(255, 68, 68, 0.15)";

  const gradeColor =
    grade === "S" ? "text-game-warning" :
    grade === "A" ? "text-game-primary" :
    grade === "B" ? "text-game-accent" :
    "text-game-error";

  const statRows: { label: string; value: string; isXp?: boolean }[] = [
    { label: "ACCURACY", value: `${results.accuracy}%` },
    { label: speedLabel.toUpperCase(), value: String(results.speed) },
    { label: "CORRECT", value: `${results.correctAnswers}/${results.totalQuestions}` },
    { label: "", value: `+${results.xp} XP`, isXp: true },
  ];

  return (
    <motion.div
      className="text-center space-y-6 relative"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, type: "spring" }}
      role="status"
      aria-label={`Grade ${grade}. Accuracy ${results.accuracy}%. ${results.correctAnswers} of ${results.totalQuestions} correct.`}
    >
      {/* ── Particle burst ── */}
      <div className="absolute inset-0 pointer-events-none overflow-visible" aria-hidden="true">
        {stars.map((s) => (
          <motion.span
            key={s.id}
            className={isHighGrade ? "text-game-secondary" : "text-game-primary"}
            style={{
              position: "absolute",
              top: "50%",
              left: "50%",
              fontSize: `${s.size}px`,
              filter: `drop-shadow(0 0 ${s.size / 2}px currentColor)`,
            }}
            initial={{ x: 0, y: 0, opacity: 0, scale: 0 }}
            animate={{
              x: Math.cos(s.angle) * s.distance,
              y: Math.sin(s.angle) * s.distance,
              opacity: [0, 1, 0],
              scale: [0, 1.2, 0],
            }}
            transition={{ delay: 0.2 + s.delay, duration: s.duration, ease: "easeOut" }}
          >
            {s.glyph}
          </motion.span>
        ))}
      </div>

      {/* ── Aura ring ── */}
      <motion.div
        className="mx-auto rounded-full"
        style={{
          width: 120,
          height: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: `0 0 30px ${auraColor}, 0 0 60px ${auraColor}, inset 0 0 20px ${auraColor}`,
          border: `1px solid ${auraColor}`,
        }}
        initial={{ scale: 0, rotate: -180 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ delay: 0.1, duration: 0.6, type: "spring", bounce: 0.4 }}
      >
        <motion.div
          className={`font-pixel text-6xl ${gradeColor} neon-glow`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          {grade}
        </motion.div>
      </motion.div>

      {/* ── Oracle prophecy ── */}
      <motion.p
        className="font-pixel text-[8px] text-game-secondary/80 max-w-xs mx-auto leading-relaxed tracking-wide italic"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        style={{ filter: "drop-shadow(0 0 6px rgba(241, 196, 15, 0.3))" }}
      >
        &ldquo;{prophecy}&rdquo;
      </motion.p>

      {/* ── Stats ── */}
      <div className="space-y-3">
        {statRows.map((row, i) => (
          <motion.div
            key={row.label || "xp"}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 + i * 0.1 }}
            className={`flex justify-between max-w-xs mx-auto font-pixel text-xs ${row.isXp ? "justify-center" : ""}`}
          >
            {row.isXp ? (
              <span className="text-game-warning">{row.value}</span>
            ) : (
              <>
                <span className="text-game-accent">{row.label}</span>
                <span className="text-white">{row.value}</span>
              </>
            )}
          </motion.div>
        ))}
      </div>

      <motion.div
        className="flex gap-4 justify-center pt-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Button onClick={onPlayAgain} variant="primary">
          PLAY AGAIN
        </Button>
        <Button onClick={onBackToMenu} variant="secondary">
          MENU
        </Button>
      </motion.div>
    </motion.div>
  );
}
