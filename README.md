# 🔮 Token Prophet

**See How AI Thinks** — An educational browser game that teaches how LLMs work through token prediction gameplay.

> *Predict the next token. Learn how language models see the world.*

## What Is This?

Token Prophet is a web-based game where you play as an oracle predicting the next token in a sequence — the same fundamental operation that powers every large language model. See probability distributions, learn tokenization, and build intuition for how AI "thinks."

**Part of the [Passionate Learning](https://github.com/DareDev256) game series** — interactive games that teach real ML concepts without requiring any API keys or backend.

## Tech Stack

- **Next.js 16** + **React 19** + **TypeScript** (strict mode)
- **Tailwind CSS v4** — CSS-first configuration with `@theme inline`
- **Framer Motion** — Animations and transitions
- **ts-fsrs** — Spaced repetition scheduling
- **localStorage** — SSR-safe persistence, no backend required

## Getting Started

```bash
git clone https://github.com/DareDev256/token-prophet.git
cd token-prophet
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Commands

| Command | Description |
|---------|-------------|
| `npm run dev` | Development server |
| `npm run build` | Production build |
| `npm run lint` | ESLint check |

## Project Structure

```
src/
├── app/           # Next.js App Router pages
├── components/    # React components
├── data/          # Game content (token sequences, probabilities)
├── hooks/         # Custom React hooks
├── lib/           # Utilities (storage, helpers)
└── types/         # TypeScript type definitions
docs/
├── mcp-research.md                          # Research: MCP and the AI agent era
├── claude-code-research.md                  # Research: Claude Code's 68K-star rise
├── cybersecurity-stocks-claude-security.md  # Research: Market impact of AI security tools
└── claude-max-tos-grey-area.md              # Research: Claude Max TOS enforcement patterns
```

## Design

Oracle/mystical aesthetic — deep purple (`#9b59b6`) and gold (`#f1c40f`) on black (`#0d0015`). Crystal ball motifs, constellation patterns, probability as divination.

### Algorithmic Orrery

The landing page features a dynamic orrery — orbiting data-point orbs around a central prediction engine. Each orb's size, brightness, and color (gold for high probability, purple for low) represents a token's weight in the probability distribution. The animation uses pure CSS transforms for buttery 60fps performance and respects `prefers-reduced-motion`.

## License

MIT

## Author

**James "DareDev256" Olusoga** — AI Solutions Engineer & Creative Technologist
