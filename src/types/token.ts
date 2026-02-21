// ─── Token Prophet — Prediction Types ───

export interface TokenCandidate {
  token: string;
  probability: number; // 0-1 (e.g., 0.72 = 72%)
}

export interface TokenPrediction {
  id: string;
  prompt: string;           // partial sentence the player sees
  topTokens: TokenCandidate[]; // top-5 tokens with probabilities (sorted desc)
  category: string;
  difficulty: "easy" | "medium" | "hard";
  enrichment: {
    whyItMatters: string;
    realWorldExample: string;
  };
}

// Scoring: player gets points based on rank of their guess in topTokens
export function scoreGuess(guess: string, topTokens: TokenCandidate[]): { rank: number; points: number } {
  const normalized = guess.trim().toLowerCase();
  const idx = topTokens.findIndex(t => t.token.toLowerCase() === normalized);
  if (idx === -1) return { rank: -1, points: 0 };
  const pointsByRank = [10, 7, 5, 3, 1];
  return { rank: idx + 1, points: pointsByRank[idx] ?? 0 };
}
