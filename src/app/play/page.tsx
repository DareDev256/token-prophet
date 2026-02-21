"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { categories, predictions } from "@/data/curriculum";
import { scoreGuess } from "@/types/token";
import { ProbabilityChart } from "@/components/game/ProbabilityChart";
import { VictoryScreen } from "@/components/game/VictoryScreen";
import { Button } from "@/components/ui/Button";
import { Orrery } from "@/components/ui/Orrery";
import { useProgress } from "@/hooks/useProgress";
import { useGameStats } from "@/hooks/useGameStats";
import { useSoundEffects } from "@/hooks/useSoundEffects";

type Phase = "select" | "play" | "reveal" | "victory";

export default function PlayPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [categoryId, setCategoryId] = useState<string>("");
  const [itemIndex, setItemIndex] = useState(0);
  const [guess, setGuess] = useState("");
  const [lastRank, setLastRank] = useState(-1);
  const [lastPoints, setLastPoints] = useState(0);
  const [totalScore, setTotalScore] = useState(0);

  const { earnXP } = useProgress(categories);
  const { stats, startTracking, stopTracking, recordAnswer, reset: resetStats } = useGameStats();
  const { playCorrect, playIncorrect, playCelebration } = useSoundEffects();

  const catPredictions = predictions.filter(p => p.category === categoryId);
  const current = catPredictions[itemIndex];

  const selectCategory = useCallback((id: string) => {
    setCategoryId(id);
    setItemIndex(0);
    setTotalScore(0);
    setPhase("play");
    resetStats();
    startTracking();
  }, [resetStats, startTracking]);

  const submitGuess = useCallback(() => {
    if (!guess.trim() || !current) return;
    const result = scoreGuess(guess, current.topTokens);
    setLastRank(result.rank);
    setLastPoints(result.points);
    setTotalScore(prev => prev + result.points);
    recordAnswer(result.rank > 0);
    if (result.rank > 0) playCorrect(); else playIncorrect();
    setPhase("reveal");
  }, [guess, current, recordAnswer, playCorrect, playIncorrect]);

  const nextItem = useCallback(() => {
    if (itemIndex + 1 >= catPredictions.length) {
      stopTracking();
      playCelebration();
      setPhase("victory");
    } else {
      setItemIndex(i => i + 1);
      setGuess("");
      setPhase("play");
    }
  }, [itemIndex, catPredictions.length, stopTracking, playCelebration]);

  const playAgain = useCallback(() => {
    setItemIndex(0);
    setTotalScore(0);
    setGuess("");
    resetStats();
    startTracking();
    setPhase("play");
  }, [resetStats, startTracking]);

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6 relative z-10">
      <Orrery />

      {/* Back button */}
      <motion.a
        href="/"
        className="fixed top-4 left-4 font-pixel text-[9px] text-game-accent/50 hover:text-game-primary z-20"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        ← MENU
      </motion.a>

      <AnimatePresence mode="wait">
        {/* ─── CATEGORY SELECT ─── */}
        {phase === "select" && (
          <motion.div key="select" className="text-center space-y-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <h1 className="font-pixel text-sm text-game-secondary neon-glow">CHOOSE YOUR DOMAIN</h1>
            <div className="space-y-3">
              {categories.map(cat => (
                <Button key={cat.id} onClick={() => selectCategory(cat.id)} variant="secondary" className="w-full max-w-xs">
                  <span className="mr-2">{cat.icon}</span> {cat.title}
                </Button>
              ))}
            </div>
          </motion.div>
        )}

        {/* ─── PLAY ─── */}
        {phase === "play" && current && (
          <motion.div key={`play-${current.id}`} className="text-center space-y-8 w-full max-w-md" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
            <div className="font-pixel text-[8px] text-game-accent/40">
              {itemIndex + 1} / {catPredictions.length}
            </div>
            <div className="prophecy-prompt px-6 py-5">
              <p className="font-pixel text-xs text-game-accent leading-relaxed">
                {current.prompt} <span className="text-game-secondary animate-blink">_</span>
              </p>
            </div>
            <p className="font-pixel text-[8px] text-game-primary/60">PREDICT THE NEXT TOKEN</p>
            <div className="flex gap-2 justify-center items-center">
              <input
                type="text"
                value={guess}
                onChange={e => setGuess(e.target.value)}
                onKeyDown={e => e.key === "Enter" && submitGuess()}
                placeholder="type your prediction..."
                autoFocus
                className="oracle-input font-pixel text-xs px-4 py-3 w-56 text-center"
              />
              <Button onClick={submitGuess} disabled={!guess.trim()} variant="primary">
                ⟐
              </Button>
            </div>
            <p className="font-pixel text-[8px] text-game-secondary/50">SCORE: {totalScore}</p>
          </motion.div>
        )}

        {/* ─── PROBABILITY REVEAL ─── */}
        {phase === "reveal" && current && (
          <motion.div key={`reveal-${current.id}`} className="text-center space-y-6 w-full max-w-lg" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
              {lastRank > 0 ? (
                <p className="font-pixel text-sm text-game-secondary neon-glow">RANK #{lastRank} — +{lastPoints} PTS</p>
              ) : (
                <p className="font-pixel text-sm text-game-error/80">NOT IN TOP 5</p>
              )}
            </motion.div>
            <div className="font-pixel text-[9px] text-game-accent/60 px-4">
              {current.prompt} <span className="text-game-secondary">[?]</span>
            </div>
            <ProbabilityChart tokens={current.topTokens} playerGuess={guess} playerRank={lastRank} />
            <motion.div className="prophecy-insight px-5 py-3 max-w-md mx-auto" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1 }}>
              <p className="font-pixel text-[7px] text-game-accent/70 leading-relaxed">{current.enrichment.whyItMatters}</p>
            </motion.div>
            <Button onClick={nextItem} variant="primary">
              {itemIndex + 1 >= catPredictions.length ? "SEE RESULTS" : "NEXT PROPHECY →"}
            </Button>
          </motion.div>
        )}

        {/* ─── VICTORY ─── */}
        {phase === "victory" && (
          <motion.div key="victory" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <VictoryScreen
              results={{
                xp: totalScore,
                accuracy: stats.accuracy,
                speed: stats.elapsedSeconds,
                correctAnswers: stats.correct,
                totalQuestions: stats.total,
              }}
              speedLabel="Seconds"
              onPlayAgain={playAgain}
              onBackToMenu={() => {
                earnXP(totalScore);
                window.location.href = "/";
              }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
