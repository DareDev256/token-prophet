# CLAUDE.md — Token Prophet

## Project: Passionate Learning Game #2
A web-based educational game that teaches how LLMs work through token prediction gameplay.

## Game Identity
- **Title**: TOKEN PROPHET
- **Subtitle**: See How AI Thinks
- **Tagline**: PREDICT THE NEXT TOKEN
- **Storage key prefix**: `token_prophet`

## Full Spec
Read `/Users/tdot/Documents/Projects/passionate-learning/specs/02-token-prophet.md` for the complete game specification.

## Tech Stack
- Next.js 16 + React 19 + TypeScript (strict)
- Tailwind CSS v4 (CSS-first `@theme inline`)
- Framer Motion for animations
- localStorage persistence (SSR-safe)
- Deploy: Vercel

## Template
Scaffolded from Passionate Learning shared template at `/Users/tdot/Documents/Projects/passionate-learning/template/`.

## Theme Colors
```css
--game-primary: #9b59b6;   /* purple */
--game-secondary: #f1c40f; /* gold */
--game-accent: #e8daef;    /* lavender */
--game-dark: #0d0015;
```

## Core Mechanic
Player sees partial sentence → predicts next token → game reveals probability distribution showing top 5 tokens with percentages. Multiple valid answers scored by probability rank.

## Build Priority
1. Landing page with oracle/mystical theme
2. Token prediction input (type or select)
3. Probability bar chart visualization (animated reveal)
4. Scoring engine (points based on token probability rank)
5. Progression system
6. Token highlighting (show how text splits into tokens)
7. Full curriculum (200 items across 8 categories)
8. Crystal ball visual + temperature slider for advanced levels

## Quality Bar
- Production-grade. No placeholders.
- Zero API keys required — all probabilities are pre-written.
- Mobile responsive.

## Commands
```bash
npm run dev    # Development server
npm run build  # Production build
npm run lint   # ESLint check
```
