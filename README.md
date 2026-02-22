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
├── claude-max-tos-grey-area.md              # Research: Claude Max TOS enforcement patterns
├── claude-code-compute-economics.md         # Research: Claude Code's $6/day compute economics
├── agentic-ai-taxonomy.md                   # Research: Three paradigms of agentic AI
├── anythingllm-rag-democratization.md       # Research: AnythingLLM and RAG probability shifting
├── new-glossary.md                          # Research: The New Glossary — LLMs, RAG, Agents, MCP
├── modern-toolbelt.md                       # Research: The Modern Toolbelt — Claude, Gemini, Lovable, Replit, Bolt, Cursor
├── claude-code-compaction-bug.md            # Research: Compaction discards data still on disk — bug & fix proposal
└── zero-code-mcp.md                         # Research: Zero-Code MCP — YAML-declared agent security via Teleport
```

## Design

Oracle/mystical aesthetic — deep purple (`#9b59b6`) and gold (`#f1c40f`) on black (`#0d0015`). Crystal ball motifs, constellation patterns, probability as divination.

### Cosmic Alignment

The `/cosmic` page renders an interactive SVG constellation map. Each star represents one of the Orrery's 8 probability orbs — tap a star to see which celestial events influence it. Connection lines between stars reveal shared event bonds. Selected stars pulse with a gold glow ring, connected neighbors stay visible, and everything else dims. It's the relationship graph behind the Celestial Alignment toggles, presented as a living star chart.

### Celestial Alignment

The `/alignment` page lets you toggle hypothetical "celestial events" — like a star rising or a market void — and watch the Orrery's probability orbs react in real-time. Each event applies a weight modifier to specific orbs, causing them to grow, glow brighter, shift color, or fade. It's a hands-on demonstration of how external factors shift probability distributions, presented through mystical constellation glyphs.

### Algorithmic Orrery

The landing page features a dynamic orrery — orbiting data-point orbs around a central prediction engine. Each orb's size, brightness, and color (gold for high probability, purple for low) represents a token's weight in the probability distribution. The animation uses pure CSS transforms for buttery 60fps performance and respects `prefers-reduced-motion`.

## Applied Roles

| Role | Company | Platform | Link |
|------|---------|----------|------|
| Principal Full Stack Developer – Generative AI & Autonomous Agents | Sales (Extreme Networks) | Lever | [Apply](https://jobs.lever.co/extremenetworks/32eca762-2b8c-47a9-93be-1e674430fb79) |

## License

MIT

## Author

**James "DareDev256" Olusoga** — AI Solutions Engineer & Creative Technologist
