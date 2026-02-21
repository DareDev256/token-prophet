"use client";

import { motion } from "framer-motion";
import { TokenCandidate } from "@/types/token";

interface ProbabilityChartProps {
  tokens: TokenCandidate[];
  playerGuess: string;
  playerRank: number; // -1 if not in top 5
}

export function ProbabilityChart({ tokens, playerGuess, playerRank }: ProbabilityChartProps) {
  const maxProb = tokens[0]?.probability ?? 1;

  return (
    <div className="w-full max-w-md space-y-2" role="list" aria-label="Token probability distribution">
      {tokens.map((t, i) => {
        const isPlayerGuess = t.token.toLowerCase() === playerGuess.trim().toLowerCase();
        const barWidth = Math.max((t.probability / maxProb) * 100, 8);
        // Gold for high probability, purple for low
        const hue = t.probability > 0.5 ? "var(--game-secondary)" : t.probability > 0.15 ? "var(--game-primary)" : "rgba(155,89,182,0.5)";

        return (
          <motion.div
            key={t.token}
            className="flex items-center gap-3"
            role="listitem"
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 * i, duration: 0.4, ease: "easeOut" }}
          >
            <span className="font-pixel text-[9px] w-16 text-right text-game-accent/70 shrink-0">
              #{i + 1}
            </span>
            <div className="flex-1 relative h-7">
              <motion.div
                className="h-full rounded-sm relative"
                style={{
                  background: hue,
                  boxShadow: isPlayerGuess ? `0 0 12px ${hue}, 0 0 24px rgba(241,196,15,0.3)` : `0 0 8px ${hue}40`,
                  border: isPlayerGuess ? "1px solid var(--game-secondary)" : "1px solid transparent",
                }}
                initial={{ width: 0 }}
                animate={{ width: `${barWidth}%` }}
                transition={{ delay: 0.15 * i + 0.2, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            </div>
            <span className={`font-pixel text-[9px] w-20 shrink-0 ${isPlayerGuess ? "text-game-secondary neon-glow" : "text-white"}`}>
              {t.token}
            </span>
            <span className="font-pixel text-[8px] text-game-accent/50 w-12 text-right shrink-0">
              {(t.probability * 100).toFixed(1)}%
            </span>
          </motion.div>
        );
      })}
      {playerRank === -1 && (
        <motion.p
          className="font-pixel text-[8px] text-game-error/70 text-center mt-3"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          &quot;{playerGuess}&quot; was not in the top 5 tokens
        </motion.p>
      )}
    </div>
  );
}
