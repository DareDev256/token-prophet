"use client";

import { useEffect, useRef } from "react";
import { motion, useAnimation } from "framer-motion";

// ─── Combo Meter ───
// Retro arcade combo counter with glitch effects and screen shake.
// Oracle/mystical aesthetic — gold text on deep purple with scan lines.

interface ComboMeterProps {
  combo: number;
  /** Max combo for scaling the fill bar (default 10). */
  maxCombo?: number;
}

const COMBO_TIERS = [
  { min: 0, label: "", color: "transparent" },
  { min: 1, label: "×1", color: "#9b59b6" },        // purple
  { min: 3, label: "×2", color: "#c084fc" },         // bright purple
  { min: 5, label: "×3", color: "#f1c40f" },         // gold
  { min: 8, label: "PROPHET", color: "#ff6b2b" },    // flame
  { min: 12, label: "ORACLE", color: "#fff" },        // white-hot
] as const;

function getTier(combo: number) {
  for (let i = COMBO_TIERS.length - 1; i >= 0; i--) {
    if (combo >= COMBO_TIERS[i].min) return COMBO_TIERS[i];
  }
  return COMBO_TIERS[0];
}

export function ComboMeter({ combo, maxCombo = 10 }: ComboMeterProps) {
  const controls = useAnimation();
  const containerRef = useRef<HTMLDivElement>(null);
  const prevCombo = useRef(0);

  const tier = getTier(combo);
  const fill = Math.min(combo / maxCombo, 1);

  // Screen shake on combo increase
  useEffect(() => {
    if (combo > prevCombo.current && combo >= 3) {
      const intensity = Math.min(combo * 0.5, 4);
      controls.start({
        x: [0, -intensity, intensity, -intensity * 0.5, 0],
        transition: { duration: 0.3, ease: "easeOut" },
      });
    }
    prevCombo.current = combo;
  }, [combo, controls]);

  if (combo < 1) return null;

  return (
    <motion.div
      ref={containerRef}
      animate={controls}
      className="relative select-none"
      aria-label={`Combo: ${combo}. ${tier.label}`}
      role="status"
    >
      {/* ── Glitch text ── */}
      <div className="relative overflow-hidden">
        <motion.div
          key={combo}
          initial={{ scale: 1.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 500, damping: 20 }}
          className="font-pixel text-center"
          style={{ color: tier.color, textShadow: `0 0 12px ${tier.color}, 0 0 24px ${tier.color}40` }}
        >
          <span className="text-2xl tracking-widest">{combo}</span>
          {tier.label && (
            <span className="block text-[8px] tracking-[0.3em] mt-0.5 opacity-80">
              {tier.label}
            </span>
          )}
        </motion.div>

        {/* Scan line overlay */}
        {combo >= 5 && (
          <div
            className="absolute inset-0 pointer-events-none"
            aria-hidden="true"
            style={{
              background: "repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(13,0,21,0.3) 2px, rgba(13,0,21,0.3) 4px)",
              mixBlendMode: "multiply",
            }}
          />
        )}
      </div>

      {/* ── Fill bar ── */}
      <div
        className="mt-1 h-1 rounded-full overflow-hidden"
        style={{ backgroundColor: "rgba(155, 89, 182, 0.15)" }}
      >
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: tier.color }}
          initial={{ width: 0 }}
          animate={{ width: `${fill * 100}%` }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
        />
      </div>

      {/* ── Burst particles on tier change ── */}
      {combo >= 5 && combo === COMBO_TIERS.find((t) => t.min === combo)?.min && (
        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={`burst-${combo}-${i}`}
              className="absolute text-[6px]"
              style={{
                top: "50%",
                left: "50%",
                color: tier.color,
                filter: `drop-shadow(0 0 4px ${tier.color})`,
              }}
              initial={{ x: 0, y: 0, opacity: 1, scale: 0.5 }}
              animate={{
                x: Math.cos((i * Math.PI) / 2) * 24,
                y: Math.sin((i * Math.PI) / 2) * 24,
                opacity: 0,
                scale: 1.5,
              }}
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              ✦
            </motion.span>
          ))}
        </div>
      )}
    </motion.div>
  );
}
