import { Category, TokenProphetItem } from "@/types/game";

// ─── TOKEN PROPHET CURRICULUM ───
// Pre-written probability distributions teaching real LLM behavior.
// No API keys needed — all probabilities are authored to reflect
// actual token prediction patterns in large language models.

export const categories: Category[] = [
  {
    id: "obvious-completions",
    title: "Obvious Completions",
    description: "Sentences with one dominant prediction",
    icon: "◉",
    levels: [
      {
        id: 1,
        name: "First Visions",
        items: ["oc-001", "oc-002", "oc-003", "oc-004", "oc-005"],
        requiredXp: 0,
        gameMode: "standard",
      },
    ],
  },
  {
    id: "common-phrases",
    title: "Common Phrases",
    description: "Idioms and sayings the model knows by heart",
    icon: "✦",
    levels: [
      {
        id: 1,
        name: "Ancient Proverbs",
        items: ["cp-001", "cp-002", "cp-003", "cp-004", "cp-005"],
        requiredXp: 0,
        gameMode: "standard",
      },
    ],
  },
];

export const items: TokenProphetItem[] = [
  // ─── OBVIOUS COMPLETIONS ───
  {
    id: "oc-001",
    prompt: "The cat sat on the",
    answer: "mat",
    category: "obvious-completions",
    difficulty: "easy",
    probabilities: [
      { token: "mat", probability: 0.45 },
      { token: "floor", probability: 0.20 },
      { token: "couch", probability: 0.15 },
      { token: "bed", probability: 0.10 },
      { token: "table", probability: 0.05 },
    ],
    enrichment: {
      whyItMatters: "LLMs predict the next token based on training data frequency. 'The cat sat on the mat' appears thousands of times in text corpora.",
      realWorldExample: "Your phone keyboard does this exact thing when it suggests the next word.",
      proTip: "Temperature controls randomness — low temp always picks 'mat', high temp might pick 'chandelier'.",
    },
  },
  {
    id: "oc-002",
    prompt: "She opened the",
    answer: "door",
    category: "obvious-completions",
    difficulty: "easy",
    probabilities: [
      { token: "door", probability: 0.40 },
      { token: "book", probability: 0.22 },
      { token: "window", probability: 0.18 },
      { token: "box", probability: 0.12 },
      { token: "letter", probability: 0.05 },
    ],
    enrichment: {
      whyItMatters: "Multiple tokens are valid here. The model assigns probabilities to all of them — it never 'picks one answer'.",
      realWorldExample: "When GPT generates text, it samples from this distribution. That's why you get different responses each time.",
    },
  },
  {
    id: "oc-003",
    prompt: "The sun rises in the",
    answer: "east",
    category: "obvious-completions",
    difficulty: "easy",
    probabilities: [
      { token: "east", probability: 0.65 },
      { token: "morning", probability: 0.18 },
      { token: "sky", probability: 0.08 },
      { token: "horizon", probability: 0.05 },
      { token: "distance", probability: 0.02 },
    ],
    enrichment: {
      whyItMatters: "Factual knowledge gets baked into token probabilities during training. The model 'knows' the sun rises in the east.",
      realWorldExample: "This is how LLMs answer factual questions — the correct fact has the highest probability.",
    },
  },
  {
    id: "oc-004",
    prompt: "He drank a glass of",
    answer: "water",
    category: "obvious-completions",
    difficulty: "easy",
    probabilities: [
      { token: "water", probability: 0.42 },
      { token: "wine", probability: 0.25 },
      { token: "milk", probability: 0.15 },
      { token: "juice", probability: 0.10 },
      { token: "beer", probability: 0.05 },
    ],
    enrichment: {
      whyItMatters: "Context matters — 'glass of' narrows predictions to drinkable liquids. The model learned this association from millions of sentences.",
      realWorldExample: "This is context-dependent prediction. Add 'at the bar' before this and 'wine' would jump to #1.",
      proTip: "This is the 'context window' in action — nearby tokens heavily influence the prediction.",
    },
  },
  {
    id: "oc-005",
    prompt: "The dog chased the",
    answer: "cat",
    category: "obvious-completions",
    difficulty: "easy",
    probabilities: [
      { token: "cat", probability: 0.38 },
      { token: "ball", probability: 0.28 },
      { token: "car", probability: 0.14 },
      { token: "rabbit", probability: 0.12 },
      { token: "squirrel", probability: 0.05 },
    ],
    enrichment: {
      whyItMatters: "The 'dog chased cat' pattern is a classic training data artifact. Cultural patterns shape AI predictions.",
      realWorldExample: "This is why AI can seem biased — it reflects the patterns in its training data, including clichés.",
    },
  },

  // ─── COMMON PHRASES ───
  {
    id: "cp-001",
    prompt: "Break a",
    answer: "leg",
    category: "common-phrases",
    difficulty: "easy",
    probabilities: [
      { token: "leg", probability: 0.72 },
      { token: "sweat", probability: 0.12 },
      { token: "record", probability: 0.08 },
      { token: "rule", probability: 0.05 },
      { token: "habit", probability: 0.02 },
    ],
    enrichment: {
      whyItMatters: "Idioms create extremely high-probability predictions. The model has seen 'break a leg' so many times that 'leg' dominates.",
      realWorldExample: "This is why LLMs are great at completing common phrases but struggle with novel ones.",
    },
  },
  {
    id: "cp-002",
    prompt: "Time flies when you're having",
    answer: "fun",
    category: "common-phrases",
    difficulty: "easy",
    probabilities: [
      { token: "fun", probability: 0.82 },
      { token: "a", probability: 0.08 },
      { token: "the", probability: 0.04 },
      { token: "good", probability: 0.03 },
      { token: "some", probability: 0.02 },
    ],
    enrichment: {
      whyItMatters: "When probability is this concentrated (82%), the model is very 'confident'. Low entropy means high certainty.",
      realWorldExample: "This is what 'perplexity' measures — how surprised the model is. Low perplexity here means easy prediction.",
      proTip: "Entropy in information theory: concentrated distributions = low entropy = predictable text.",
    },
  },
  {
    id: "cp-003",
    prompt: "A penny for your",
    answer: "thoughts",
    category: "common-phrases",
    difficulty: "easy",
    probabilities: [
      { token: "thoughts", probability: 0.78 },
      { token: "troubles", probability: 0.08 },
      { token: "time", probability: 0.06 },
      { token: "opinion", probability: 0.05 },
      { token: "soul", probability: 0.02 },
    ],
    enrichment: {
      whyItMatters: "Cultural knowledge gets encoded as token probabilities. The model 'knows' this idiom from training data.",
      realWorldExample: "This is why LLMs work better in English than rare languages — more training data means sharper distributions.",
    },
  },
  {
    id: "cp-004",
    prompt: "Actions speak louder than",
    answer: "words",
    category: "common-phrases",
    difficulty: "easy",
    probabilities: [
      { token: "words", probability: 0.85 },
      { token: "actions", probability: 0.05 },
      { token: "silence", probability: 0.04 },
      { token: "thoughts", probability: 0.03 },
      { token: "speech", probability: 0.02 },
    ],
    enrichment: {
      whyItMatters: "At 85% probability, this is nearly deterministic. Temperature would need to be very high to pick anything else.",
      realWorldExample: "When ChatGPT gives the same answer every time, it's because one token has overwhelming probability like this.",
    },
  },
  {
    id: "cp-005",
    prompt: "Every cloud has a silver",
    answer: "lining",
    category: "common-phrases",
    difficulty: "easy",
    probabilities: [
      { token: "lining", probability: 0.88 },
      { token: "edge", probability: 0.04 },
      { token: "side", probability: 0.03 },
      { token: "glow", probability: 0.03 },
      { token: "light", probability: 0.01 },
    ],
    enrichment: {
      whyItMatters: "88% — this is the most 'certain' prediction in this set. The model would almost never deviate from 'lining' here.",
      realWorldExample: "This is why LLMs sometimes feel repetitive — they always pick the highest-probability token unless temperature is raised.",
      proTip: "Top-p (nucleus) sampling only considers tokens that add up to p probability. At p=0.9, only 'lining' would be considered here.",
    },
  },
];

// Helper: get items by category
export function getItemsByCategory(categoryId: string): TokenProphetItem[] {
  return items.filter((item) => item.category === categoryId);
}

// Helper: get items by level
export function getItemsByLevel(categoryId: string, levelId: number): TokenProphetItem[] {
  const category = categories.find((c) => c.id === categoryId);
  if (!category) return [];
  const level = category.levels.find((l) => l.id === levelId);
  if (!level) return [];
  return level.items
    .map((id) => items.find((item) => item.id === id))
    .filter((item): item is TokenProphetItem => item !== undefined);
}
