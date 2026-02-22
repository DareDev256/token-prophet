"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { VictoryScreen } from "@/components/game/VictoryScreen";
import { useGameStats } from "@/hooks/useGameStats";
import { useSoundEffects } from "@/hooks/useSoundEffects";
import { categories, getItemsByLevel } from "@/data/curriculum";
import { TokenProphetItem, RANK_POINTS, GameResults } from "@/types/game";

type Phase = "select" | "playing" | "reveal" | "victory";

export default function PlayPage() {
  const [phase, setPhase] = useState<Phase>("select");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [levelItems, setLevelItems] = useState<TokenProphetItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [input, setInput] = useState("");
  const [roundScore, setRoundScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [matchedRank, setMatchedRank] = useState(-1);
  const [barsRevealed, setBarsRevealed] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const { stats, startTracking, stopTracking, recordAnswer, reset } = useGameStats();
  const { playCorrect, playIncorrect, playCelebration, playClick } = useSoundEffects();

  const currentItem = levelItems[currentIndex] ?? null;

  const selectCategory = useCallback((catId: string) => {
    playClick();
    const items = getItemsByLevel(catId, 1);
    if (items.length === 0) return;
    setSelectedCategory(catId);
    setLevelItems(items);
    setCurrentIndex(0);
    setTotalScore(0);
    setPhase("playing");
    startTracking();
  }, [playClick, startTracking]);

  const submitGuess = useCallback(() => {
    if (!currentItem || !input.trim()) return;
    const guess = input.trim().toLowerCase();
    const rank = currentItem.probabilities.findIndex(
      (p) => p.token.toLowerCase() === guess
    );
    const points = rank >= 0 && rank < RANK_POINTS.length ? RANK_POINTS[rank] : 0;
    setMatchedRank(rank);
    setRoundScore(points);
    setTotalScore((prev) => prev + points);
    recordAnswer(rank === 0);
    if (rank >= 0 && rank < 3) playCorrect();
    else playIncorrect();
    setBarsRevealed(false);
    setPhase("reveal");
    // Stagger bar reveal
    setTimeout(() => setBarsRevealed(true), 100);
  }, [currentItem, input, recordAnswer, playCorrect, playIncorrect]);

  const nextItem = useCallback(() => {
    playClick();
    if (currentIndex + 1 >= levelItems.length) {
      stopTracking();
      playCelebration();
      setPhase("victory");
    } else {
      setCurrentIndex((i) => i + 1);
      setInput("");
      setMatchedRank(-1);
      setRoundScore(0);
      setPhase("playing");
    }
  }, [currentIndex, levelItems.length, stopTracking, playCelebration, playClick]);

  const restartGame = useCallback(() => {
    reset();
    setPhase("select");
    setSelectedCategory(null);
    setCurrentIndex(0);
    setTotalScore(0);
    setInput("");
  }, [reset]);

  // Autofocus input when playing
  useEffect(() => {
    if (phase === "playing") inputRef.current?.focus();
  }, [phase, currentIndex]);

  const results: GameResults = {
    xp: totalScore,
    accuracy: stats.accuracy,
    speed: stats.elapsedSeconds,
    correctAnswers: stats.correct,
    totalQuestions: stats.total,
  };

  // ─── CATEGORY SELECT ───
  if (phase === "select") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <motion.h1
          className="font-pixel text-lg text-game-secondary mb-2 neon-glow"
          style={{ color: "var(--game-secondary)" }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          CHOOSE YOUR VISION
        </motion.h1>
        <p className="font-pixel text-[8px] text-game-accent/60 mb-8">
          SELECT A CATEGORY TO BEGIN SCRYING
        </p>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          {categories.map((cat, i) => (
            <motion.button
              key={cat.id}
              onClick={() => selectCategory(cat.id)}
              className="celestial-glyph text-left"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.15 }}
              whileHover={{ borderColor: "rgba(241,196,15,0.4)" }}
            >
              <span className="celestial-glyph__icon">{cat.icon}</span>
              <div className="flex-1">
                <span className="celestial-glyph__label block">{cat.title}</span>
                <span className="celestial-glyph__mod block mt-1 text-game-accent/40" style={{ fontSize: "6px" }}>
                  {cat.description}
                </span>
              </div>
              <span className="celestial-glyph__mod">{cat.levels[0].items.length} tokens</span>
            </motion.button>
          ))}
        </div>
        <Button href="/" variant="ghost" className="mt-8">
          &lt; HOME
        </Button>
      </main>
    );
  }

  // ─── VICTORY ───
  if (phase === "victory") {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-6">
        <VictoryScreen
          results={results}
          onPlayAgain={() => {
            reset();
            if (selectedCategory) selectCategory(selectedCategory);
          }}
          onBackToMenu={restartGame}
          speedLabel="Time (s)"
        />
      </main>
    );
  }

  if (!currentItem) return null;

  // ─── PLAYING + REVEAL ───
  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-6">
      {/* Progress */}
      <div className="fixed top-4 left-4 font-pixel text-[8px] text-game-accent/50">
        {currentIndex + 1} / {levelItems.length}
      </div>
      <div className="fixed top-4 right-4 font-pixel text-[8px] text-game-secondary">
        {totalScore} PTS
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          className="max-w-lg w-full text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {/* Oracle prompt */}
          <p className="font-pixel text-[8px] text-game-accent/40 mb-4 tracking-widest">
            THE ORACLE SPEAKS...
          </p>
          <h2
            className="font-pixel text-sm md:text-base text-game-accent mb-8 leading-relaxed"
            style={{ textShadow: "0 0 10px rgba(155,89,182,0.3)" }}
          >
            &ldquo;{currentItem.prompt}{" "}
            <span className="text-game-secondary animate-blink">_</span>&rdquo;
          </h2>

          {/* Input phase */}
          {phase === "playing" && (
            <motion.div
              className="flex flex-col items-center gap-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="relative w-full max-w-xs">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && submitGuess()}
                  placeholder="predict the next token..."
                  className="w-full bg-transparent border-b-2 border-game-primary/40 text-center font-pixel text-sm text-white py-3 focus:border-game-secondary focus:outline-none transition-colors placeholder:text-game-accent/20 placeholder:text-[8px]"
                  aria-label="Token prediction input"
                  autoComplete="off"
                  spellCheck={false}
                />
              </div>
              <Button onClick={submitGuess} variant="primary" disabled={!input.trim()}>
                DIVINE
              </Button>
            </motion.div>
          )}

          {/* Reveal phase — probability bars */}
          {phase === "reveal" && (
            <motion.div
              className="flex flex-col items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              {/* Score flash */}
              <motion.div
                className="font-pixel text-lg"
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: "spring", bounce: 0.5 }}
                style={{ color: roundScore > 0 ? "var(--game-secondary)" : "var(--game-error)" }}
              >
                {roundScore > 0 ? `+${roundScore} PTS` : "0 PTS"}
              </motion.div>

              {/* Probability bars */}
              <div className="w-full max-w-sm space-y-2" role="list" aria-label="Token probabilities">
                {currentItem.probabilities.map((p, i) => {
                  const isMatch = i === matchedRank;
                  const barColor = isMatch
                    ? "var(--game-secondary)"
                    : i === 0
                      ? "var(--game-primary)"
                      : "rgba(155,89,182,0.4)";

                  return (
                    <motion.div
                      key={p.token}
                      className="flex items-center gap-3"
                      role="listitem"
                      initial={{ opacity: 0, x: -40 }}
                      animate={barsRevealed ? { opacity: 1, x: 0 } : {}}
                      transition={{ delay: i * 0.12, duration: 0.4, ease: "easeOut" }}
                    >
                      <span className="font-pixel text-[8px] w-6 text-right text-game-accent/50">
                        #{i + 1}
                      </span>
                      <div className="flex-1 h-6 relative" style={{ background: "rgba(13,0,21,0.8)" }}>
                        <motion.div
                          className="absolute inset-y-0 left-0"
                          style={{ background: barColor }}
                          initial={{ width: 0 }}
                          animate={barsRevealed ? { width: `${p.probability * 100}%` } : {}}
                          transition={{ delay: i * 0.12 + 0.2, duration: 0.6, ease: "easeOut" }}
                        />
                        <div className="absolute inset-0 flex items-center justify-between px-2">
                          <span
                            className="font-pixel text-[7px] relative z-10"
                            style={{
                              color: isMatch ? "var(--game-black)" : "var(--game-accent)",
                              fontWeight: isMatch ? "bold" : "normal",
                            }}
                          >
                            {p.token}
                          </span>
                          <span
                            className="font-pixel text-[7px] relative z-10"
                            style={{ color: isMatch ? "var(--game-black)" : "var(--game-accent)/60" }}
                          >
                            {Math.round(p.probability * 100)}%
                          </span>
                        </div>
                      </div>
                      <span className="font-pixel text-[7px] w-8 text-game-accent/30">
                        {RANK_POINTS[i] ?? 0}pt
                      </span>
                    </motion.div>
                  );
                })}
              </div>

              {/* Enrichment */}
              {currentItem.enrichment && (
                <motion.div
                  className="max-w-sm text-left px-4 py-3"
                  style={{
                    background: "rgba(13,0,21,0.85)",
                    border: "1px solid rgba(155,89,182,0.15)",
                  }}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8 }}
                >
                  <p className="font-pixel text-[6px] text-game-secondary mb-2 tracking-wider">
                    ★ WHY THIS MATTERS
                  </p>
                  <p className="text-[10px] text-game-accent/70 leading-relaxed" style={{ fontFamily: "monospace" }}>
                    {currentItem.enrichment.whyItMatters}
                  </p>
                  {currentItem.enrichment.proTip && (
                    <p className="text-[9px] text-game-primary/60 mt-2 leading-relaxed" style={{ fontFamily: "monospace" }}>
                      💡 {currentItem.enrichment.proTip}
                    </p>
                  )}
                </motion.div>
              )}

              <Button onClick={nextItem} variant="primary">
                {currentIndex + 1 >= levelItems.length ? "SEE RESULTS" : "NEXT TOKEN"}
              </Button>
            </motion.div>
          )}
        </motion.div>
      </AnimatePresence>

      <Button href="/" variant="ghost" className="fixed bottom-6">
        &lt; ABANDON READING
      </Button>
    </main>
  );
}
