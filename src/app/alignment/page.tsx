"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Orrery, ORBS } from "@/components/ui/Orrery";
import { Button } from "@/components/ui/Button";
import { CELESTIAL_EVENTS } from "@/data/celestialEvents";
import type { CelestialEvent } from "@/types/game";

/** Runtime event state — extends shared definition with toggle state */
type ActiveCelestialEvent = CelestialEvent & { active: boolean };

export default function AlignmentPage() {
  const [events, setEvents] = useState<ActiveCelestialEvent[]>(
    () => CELESTIAL_EVENTS.map((e) => ({ ...e, active: false }))
  );

  const toggle = useCallback((id: string) => {
    setEvents((prev) => prev.map((e) => (e.id === id ? { ...e, active: !e.active } : e)));
  }, []);

  // Compute per-orb weight modifiers from active events
  const weightModifiers = Array.from({ length: ORBS.length }, (_, i) => {
    let mod = 1;
    for (const e of events) {
      if (e.active && e.targets.includes(i)) mod *= e.modifier;
    }
    return mod;
  });

  const activeCount = events.filter((e) => e.active).length;

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <Orrery weightModifiers={weightModifiers} />

      {/* Back nav */}
      <div className="fixed top-4 left-4 z-20">
        <Button href="/" variant="ghost">← BACK</Button>
      </div>

      {/* Title */}
      <motion.h1
        className="font-pixel text-sm md:text-base text-game-secondary mb-2 tracking-wider"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        CELESTIAL ALIGNMENT
      </motion.h1>
      <motion.p
        className="font-pixel text-[8px] text-game-accent/50 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        TOGGLE EVENTS TO SHIFT THE ORRERY
      </motion.p>

      {/* Event toggles */}
      <motion.div
        className="celestial-panel"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200, damping: 20 }}
      >
        {events.map((event, idx) => (
          <motion.button
            key={event.id}
            onClick={() => toggle(event.id)}
            className={`celestial-glyph ${event.active ? "celestial-glyph--active" : ""}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 * idx }}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.96 }}
            aria-pressed={event.active}
            aria-label={`${event.name}: ${event.active ? "active" : "inactive"}`}
          >
            <span className="celestial-glyph__icon">{event.glyph}</span>
            <span className="celestial-glyph__label">{event.name}</span>
            <span className="celestial-glyph__mod">
              {event.modifier > 1 ? `+${Math.round((event.modifier - 1) * 100)}%` : `−${Math.round((1 - event.modifier) * 100)}%`}
            </span>
          </motion.button>
        ))}
      </motion.div>

      {/* Active alignment readout */}
      <AnimatePresence>
        {activeCount > 0 && (
          <motion.div
            className="font-pixel text-[8px] text-game-secondary/70 mt-6 text-center"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            {activeCount} ALIGNMENT{activeCount > 1 ? "S" : ""} ACTIVE — PROBABILITY FIELD SHIFTED
          </motion.div>
        )}
      </AnimatePresence>

      <motion.p
        className="font-pixel text-[7px] text-game-primary/30 mt-auto pt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1 }}
      >
        OBSERVE HOW EVENTS SHIFT TOKEN PROBABILITIES
      </motion.p>
    </main>
  );
}
