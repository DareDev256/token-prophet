import { Category } from "@/types/game";
import { TokenPrediction } from "@/types/token";

// ─── TOKEN PROPHET CURRICULUM ───
// 10 starter items across 2 categories with hand-crafted probability distributions.
// Probabilities approximate real LLM behavior (GPT-class models).

export const categories: Category[] = [
  {
    id: "obvious",
    title: "Obvious Completions",
    description: "High-confidence predictions where one token dominates",
    icon: "◉",
    levels: [{ id: 1, name: "First Sight", items: ["ob-001","ob-002","ob-003","ob-004","ob-005"], requiredXp: 0, gameMode: "predict" }],
  },
  {
    id: "phrases",
    title: "Common Phrases",
    description: "Idioms and expressions — the model memorizes patterns",
    icon: "⟡",
    levels: [{ id: 1, name: "Echoes", items: ["ph-001","ph-002","ph-003","ph-004","ph-005"], requiredXp: 20, gameMode: "predict" }],
  },
];

export const predictions: TokenPrediction[] = [
  // ─── OBVIOUS COMPLETIONS ───
  {
    id: "ob-001", prompt: "The cat sat on the", category: "obvious", difficulty: "easy",
    topTokens: [{ token: "mat", probability: 0.42 },{ token: "floor", probability: 0.18 },{ token: "bed", probability: 0.12 },{ token: "couch", probability: 0.09 },{ token: "table", probability: 0.06 }],
    enrichment: { whyItMatters: "LLMs learn from nursery rhymes and children's books — extremely common patterns get very high probability.", realWorldExample: "GPT-4 assigns ~40% probability to 'mat' here due to the famous phrase." },
  },
  {
    id: "ob-002", prompt: "I went to the", category: "obvious", difficulty: "easy",
    topTokens: [{ token: "store", probability: 0.25 },{ token: "hospital", probability: 0.11 },{ token: "park", probability: 0.10 },{ token: "school", probability: 0.09 },{ token: "gym", probability: 0.07 }],
    enrichment: { whyItMatters: "Without more context, LLMs spread probability across common destinations. Notice no single token dominates.", realWorldExample: "This is why chatbots sometimes give generic answers — the probability distribution is flat." },
  },
  {
    id: "ob-003", prompt: "She opened the", category: "obvious", difficulty: "easy",
    topTokens: [{ token: "door", probability: 0.52 },{ token: "box", probability: 0.14 },{ token: "book", probability: 0.08 },{ token: "window", probability: 0.07 },{ token: "letter", probability: 0.05 }],
    enrichment: { whyItMatters: "Physical actions create strong priors. 'Opened the door' dominates because doors are the most commonly opened object in text.", realWorldExample: "This is called a collocational bias — words that frequently appear together." },
  },
  {
    id: "ob-004", prompt: "The sun rises in the", category: "obvious", difficulty: "easy",
    topTokens: [{ token: "east", probability: 0.78 },{ token: "morning", probability: 0.12 },{ token: "sky", probability: 0.04 },{ token: "west", probability: 0.02 },{ token: "horizon", probability: 0.01 }],
    enrichment: { whyItMatters: "Factual knowledge gets encoded as very high probability. The model has seen this fact millions of times.", realWorldExample: "This is how LLMs 'know' facts — not by understanding, but by statistical co-occurrence." },
  },
  {
    id: "ob-005", prompt: "Please turn off the", category: "obvious", difficulty: "easy",
    topTokens: [{ token: "light", probability: 0.35 },{ token: "TV", probability: 0.18 },{ token: "computer", probability: 0.12 },{ token: "music", probability: 0.08 },{ token: "phone", probability: 0.06 }],
    enrichment: { whyItMatters: "Imperative sentences about turning off things reveal the most common objects in household contexts.", realWorldExample: "Smart home assistants use similar distributions to guess which device you mean." },
  },
  // ─── COMMON PHRASES ───
  {
    id: "ph-001", prompt: "Break a", category: "phrases", difficulty: "easy",
    topTokens: [{ token: "leg", probability: 0.88 },{ token: "sweat", probability: 0.04 },{ token: "bone", probability: 0.03 },{ token: "rule", probability: 0.02 },{ token: "record", probability: 0.01 }],
    enrichment: { whyItMatters: "Idioms are memorized as near-deterministic sequences. 'Break a leg' is so common that the model treats it as a single unit.", realWorldExample: "This is why LLMs are great at completing idioms but struggle to invent new ones." },
  },
  {
    id: "ph-002", prompt: "Once upon a", category: "phrases", difficulty: "easy",
    topTokens: [{ token: "time", probability: 0.95 },{ token: "day", probability: 0.02 },{ token: "hill", probability: 0.01 },{ token: "night", probability: 0.01 },{ token: "dream", probability: 0.005 }],
    enrichment: { whyItMatters: "At 95%, this is almost deterministic. The model has seen 'once upon a time' so many times it barely considers alternatives.", realWorldExample: "This extreme confidence is what makes LLMs predictable — and exploitable by prompt injection." },
  },
  {
    id: "ph-003", prompt: "Actions speak louder than", category: "phrases", difficulty: "easy",
    topTokens: [{ token: "words", probability: 0.93 },{ token: "thoughts", probability: 0.02 },{ token: "promises", probability: 0.02 },{ token: "intentions", probability: 0.01 },{ token: "silence", probability: 0.01 }],
    enrichment: { whyItMatters: "Proverbs show how LLMs encode cultural knowledge as probability spikes.", realWorldExample: "When fine-tuning LLMs on different cultures, these probabilities shift dramatically." },
  },
  {
    id: "ph-004", prompt: "To be or not to", category: "phrases", difficulty: "easy",
    topTokens: [{ token: "be", probability: 0.97 },{ token: "do", probability: 0.01 },{ token: "know", probability: 0.005 },{ token: "have", probability: 0.003 },{ token: "say", probability: 0.002 }],
    enrichment: { whyItMatters: "Shakespeare is so deeply embedded in English training data that this approaches 100% certainty.", realWorldExample: "This is a 'memorized' sequence — the model doesn't understand the philosophy, just the pattern." },
  },
  {
    id: "ph-005", prompt: "Better late than", category: "phrases", difficulty: "easy",
    topTokens: [{ token: "never", probability: 0.91 },{ token: "sorry", probability: 0.03 },{ token: "expected", probability: 0.02 },{ token: "nothing", probability: 0.01 },{ token: "early", probability: 0.01 }],
    enrichment: { whyItMatters: "Common proverbs create probability cliffs — 91% for one token, crumbs for the rest.", realWorldExample: "This pattern is why LLMs complete clichés perfectly but can't riff creatively on them." },
  },
];

export function getPrediction(id: string): TokenPrediction | undefined {
  return predictions.find(p => p.id === id);
}

export function getPredictionsByCategory(categoryId: string): TokenPrediction[] {
  return predictions.filter(p => p.category === categoryId);
}
