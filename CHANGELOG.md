# Changelog

All notable changes to Token Prophet will be documented in this file.

## [0.8.0] - 2026-03-13

### Added
- **Diversity pipeline** (`src/lib/diversity.ts`) — precomputes pairwise Jaccard similarity in a flat `Float64Array` matrix for O(1) lookups during gameplay; `findSeedIndex` picks the most unique starting item, `diversifyResults` uses greedy farthest-first traversal to select maximally diverse subsets, `diversityProfile` scores any item set's variety
- **Combo Meter** (`src/components/game/ComboMeter.tsx`) — retro arcade combo counter with 5 visual tiers (×1 → ×2 → ×3 → PROPHET → ORACLE), spring-animated numbers, screen shake on high combos, CRT scan line overlay, and burst particles on tier transitions; oracle/mystical aesthetic with gold and purple on black
- 13 new Vitest tests for diversity pipeline covering matrix symmetry, similarity ordering, seed selection, greedy diversification, and profile scoring (58 total tests, all passing)

### Changed
- Diversity computation is fully decoupled from rendering — pure functions over typed arrays with zero React dependency, ready for integration with the game loop's item selection

## [0.7.0] - 2026-03-10

### Added
- **Oracle Prophecy system** — grade-specific mystical messages ("The tokens bow before your sight") displayed as golden italic text after grade reveal, 3 unique prophecies per grade tier (18 total)
- **Celestial particle burst** — golden angle–distributed star glyphs (✦✧⊹✶⋆◇) explode outward from grade center on reveal, count scales with performance (18 for S/A, 10 for B, 5 for lower)
- **Aura ring** — glowing circular halo around the grade letter with grade-specific color (gold for S, purple for A, lavender for B, red for D/F), spring entrance animation with rotation
- **ARIA live region** — VictoryScreen now announces grade, accuracy, and score to screen readers via `role="status"`

### Changed
- VictoryScreen stat rows refactored from 4 duplicated `motion.div` blocks to a mapped array pattern (DRYer, easier to extend)
- Star particle positions use golden angle spiral (137.508°) for deterministic even distribution without `Math.random()`

## [0.6.1] - 2026-03-10

### Fixed
- **Timer division by zero** — guard against `duration=0` producing `Infinity%` CSS width (silent visual corruption)
- **lerpColor out-of-bounds** — clamp `t` to `[0,1]` before interpolation to prevent invalid RGB values when callers pass unclamped weights
- **Dead code removal** — removed unused `STREAK_FREEZE_KEY` constant that triggered ESLint warning (streak freezes are tracked in `UserProgress`, not a separate storage key)

## [0.6.0] - 2026-03-09

### Changed
- **Celestial event deduplication** — extracted shared event data from cosmic and alignment pages into `src/data/celestialEvents.ts` (single source of truth)
- **CelestialEvent type centralized** — moved interface to `src/types/game.ts`, alignment page derives `ActiveCelestialEvent` via intersection type
- **Color utility extracted** — `lerpColor()` moved from ProbabilityWeave component to `src/lib/color.ts` for reuse across probability visualizations
- **Constellation graph logic extracted** — `buildEdges()`, `STAR_NAMES`, `STAR_POS` moved to `src/lib/constellation.ts` with typed `ConstellationEdge` interface
- Cosmic page reduced from 209 to 170 lines, alignment page from 125 to 105 lines

## [0.5.0] - 2026-03-06

### Added
- **Probability Weave** — interactive SVG fate-thread visualization of token prediction probabilities
- 8 Bezier curve threads radiating from a central loom point, thickness and color (gold/purple) mapped to probability weight
- Hover/focus any thread to "pull" it — the curve bows outward via control point inflation, spotlight dims other threads
- Endpoint orbs scale and glow on selection, labels transition with the thread
- Detail panel with token name, probability bar, and percentage via AnimatePresence
- Central loom glow with dual-ring breathing animation
- Full keyboard accessibility: each thread is focusable with aria-labels and title tooltips
- `/weave` page with entrance animations and back navigation
- Landing page navigation button for Probability Weave

## [0.4.3] - 2026-03-05

### Added
- Test infrastructure: Vitest with localStorage mocking and SSR-guard bypass
- 39 unit tests for `storage.ts`: XP system, recall multipliers, level completion, streak freeze mechanics, FSRS card CRUD, mastery gates, learning analytics, and reset
- 6 data integrity tests for `curriculum.ts`: duplicate detection, difficulty validation, helper function edge cases
- `npm test` and `npm run test:watch` scripts

## [0.4.2] - 2026-02-22

### Added
- Zero-Code MCP research — how Teleport's YAML-declared gateway turns any CLI command into a governed MCP tool for AI agents, with deny-by-default RBAC, JIT access, and full audit logging, mapped to Token Prophet's Celestial Alignment as a policy-gating metaphor (`docs/zero-code-mcp.md`)

## [0.4.1] - 2026-02-22

### Added
- Claude Code compaction bug research — how auto-compaction irreversibly discards user data despite full transcripts persisting on disk, the indexed transcript reference fix proposal, and why this maps to Token Prophet's probability distribution pedagogy (`docs/claude-code-compaction-bug.md`)

## [0.4.0] - 2026-02-21

### Added
- **Cosmic Alignment** — interactive SVG constellation map visualizing the hidden relationships between probability orbs and celestial events
- 8 clickable stars representing Orrery probability models, positioned in a hand-crafted constellation layout
- Connection lines between stars that share celestial event influences (bipartite graph visualization)
- Click any star to reveal its weight, affecting events, and connected neighbors — unselected stars dim with smooth transitions
- Pulsating glow ring animation on selected stars with gold radiance
- Stars shimmer independently with staggered SVG animate cycles keyed to their index
- Influence panel shows each affecting event's glyph, name, and modifier with color-coded boost (gold) vs suppress (purple)
- Lines brighten to gold when their star is selected, dim to subtle purple otherwise
- Spring-based entrance animations via Framer Motion
- Full keyboard accessibility and WCAG 2.2 focus indicators
- Navigation: ghost button on landing page, back button on cosmic page

## [0.3.4] - 2026-02-21

### Added
- Applied Roles section in README — tracking Principal Full Stack Developer (Generative AI & Autonomous Agents) application at Extreme Networks via Lever

## [0.3.3] - 2026-02-21

### Added
- The New Glossary research — defines the four pillars (LLMs, RAG, Agents, MCP) with ASCII architecture diagram showing how prediction stacks into action (`docs/new-glossary.md`)
- The Modern Toolbelt research — maps the builder spectrum from foundation models (Claude, Gemini) to AI platforms (Cursor, Lovable, Replit, Bolt) with control-vs-speed positioning (`docs/modern-toolbelt.md`)

## [0.3.2] - 2026-02-21

### Added
- AnythingLLM RAG democratization research — how the 54K-star open-source RAG app validates Token Prophet's probability-shifting pedagogy, with analysis of workspace containerization as prediction boundaries and embedding as oracle translation (`docs/anythingllm-rag-democratization.md`)

## [0.3.1] - 2026-02-21

### Added
- Agentic AI taxonomy research — three paradigms (traditional LLMs → reasoning models → agentic systems) and three delivery vessels (enhanced chatbots, browser extensions, autonomous agents), with relevance scoring to Token Prophet's pedagogical mission (`docs/agentic-ai-taxonomy.md`)

## [0.3.0] - 2026-02-21

### Added
- **Celestial Alignment** — interactive probability manipulation through hypothetical "celestial events"
- 5 toggleable events (Code Star Rising, Security Eclipse, Agent Conjunction, Market Void, Token Flare) that shift Orrery orb weights in real-time
- Orrery now accepts `weightModifiers` prop for dynamic probability visualization
- Astrolabe-inspired glyph UI with gold activation glow and spring animations
- Orb color dynamically shifts between gold/purple based on modified weight threshold
- Smooth 0.8s CSS transitions on orb size, glow, and opacity changes
- Active alignment count readout with AnimatePresence enter/exit
- Full keyboard accessibility (aria-pressed, aria-label on all toggles)
- Navigation: ghost button on landing page, back button on alignment page

## [0.2.4] - 2026-02-21

### Added
- Claude Code compute economics research — $6/day average user cost, $3B losses, rate limit responses, and the venture-subsidized growth paradox (`docs/claude-code-compute-economics.md`)

## [0.2.3] - 2026-02-21

### Added
- Claude Max TOS grey area research — selective enforcement patterns, what it means for AI tooling, and why Token Prophet's zero-API architecture sidesteps it entirely (`docs/claude-max-tos-grey-area.md`)

## [0.2.2] - 2026-02-21

### Added
- Cybersecurity market impact research — how Claude Code Security's launch triggered a sector-wide sell-off and what it means for token prediction (`docs/cybersecurity-stocks-claude-security.md`)

## [0.2.1] - 2026-02-21

### Added
- Claude Code research document — deep dive on the 68K-star agentic coding tool, multi-agent orchestration, and its connection to token prediction (`docs/claude-code-research.md`)

## [0.2.0] - 2026-02-21

### Added
- Algorithmic Orrery — dynamic animated background with orbiting probability orbs
- Central prediction engine with pulsing gold glow
- 8 orbiting data-point orbs across 3 orbital rings, sized and colored by probability weight
- Pure CSS orbital animations (GPU-accelerated transforms)
- Respects `prefers-reduced-motion` via existing accessibility rules

## [0.1.1] - 2026-02-21

### Added
- MCP (Model Context Protocol) research document — deep dive on Anthropic's open standard for AI agent integration (`docs/mcp-research.md`)
- README.md with project overview, tech stack, setup instructions, and structure
- CHANGELOG.md

## [0.1.0] - 2026-02-20

### Added
- Initial scaffold from Passionate Learning template
- Next.js 16 + React 19 + TypeScript project structure
- Tailwind CSS v4 with oracle/mystical theme colors
- ESLint 9 flat config
- Framer Motion and ts-fsrs dependencies
