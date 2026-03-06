"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ProbabilityWeave } from "@/components/ui/ProbabilityWeave";

export default function WeavePage() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative">
      <motion.h1
        className="font-pixel text-sm text-game-secondary mb-2 tracking-wider"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        style={{ textShadow: "0 0 12px rgba(241,196,15,0.4)" }}
      >
        PROBABILITY WEAVE
      </motion.h1>
      <motion.p
        className="font-pixel text-[7px] text-game-accent/50 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        PULL A THREAD TO READ ITS FATE
      </motion.p>

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <ProbabilityWeave />
      </motion.div>

      <motion.div
        className="mt-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Link
          href="/"
          className="btn-retro px-6 py-3 border-2 text-[9px] tracking-wider"
          style={{
            borderColor: "var(--game-primary)",
            color: "var(--game-primary)",
          }}
        >
          &lt; BACK
        </Link>
      </motion.div>
    </main>
  );
}
