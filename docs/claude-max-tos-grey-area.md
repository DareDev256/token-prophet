# Claude Max Subscriptions: TOS Grey Areas and Selective Enforcement

> **Live intel** — February 2026 | Relevance to Token Prophet: 75%

## The Situation

Anthropic's Claude Max subscription ($100–200/month) is marketed as a high-usage tier for Claude.ai and the official apps. The Terms of Service explicitly restrict automated or programmatic access outside sanctioned channels (Claude Code, the API). In practice, enforcement is selective — power users routinely push boundaries, and Anthropic largely turns a blind eye unless usage patterns become egregious or commercially threatening.

## What the TOS Actually Says

- Claude Max is licensed for **interactive, human-in-the-loop use** via claude.ai and official clients.
- **Automated scraping, headless browser access, or unofficial API wrappers** violate the acceptable use policy.
- Claude Code (the agentic CLI) is a separate product with its own usage model — Max subscribers get elevated rate limits within Claude Code, but the subscription doesn't grant blanket programmatic access rights.

## What Actually Happens

| Behavior | TOS Status | Enforcement Level |
|----------|-----------|-------------------|
| Using Claude.ai normally | ✅ Compliant | N/A |
| Claude Code CLI (official) | ✅ Compliant | N/A |
| Browser automation hitting claude.ai | ❌ Violation | 🟡 Rare enforcement |
| Unofficial API wrappers (e.g. claude-api npm packages) | ❌ Violation | 🟡 Sporadic takedowns |
| Reselling Max access as an API service | ❌ Violation | 🔴 Active enforcement |
| High-volume automated workflows via Max | ❌ Violation | 🟡 Rate-limited, not banned |

Anthropic's enforcement pattern mirrors the classic platform playbook: tolerate grey-area usage that grows the ecosystem, crack down on anything that cannibalizes API revenue.

## Why This Matters for Token Prophet

### 1. Probability Distribution Data
Token Prophet uses **pre-written probability distributions** — no live API calls. This is a deliberate design choice that sidesteps TOS concerns entirely. If we ever considered dynamically generating token probabilities via Claude, we'd need the official API, not a Max subscription hack.

### 2. Educational Content Pipeline
Research documents in this project (like this one) are gathered through legitimate interactive use. The line between "research session" and "automated extraction" matters — and Token Prophet stays cleanly on the right side.

### 3. Market Signal for AI Tooling
The selective enforcement pattern tells us something about Anthropic's strategic priorities:
- **Claude Code is the sanctioned power-user channel** — they want developers in the CLI, not scraping the web UI.
- **API revenue is the moat** — anything that substitutes for paid API access gets shut down fast.
- **Community goodwill matters** — banning Max subscribers for minor TOS stretches would be a PR disaster, so they calibrate enforcement to commercial threat level.

### 4. Prediction Relevance
This enforcement pattern is itself a probability distribution problem. Given a user behavior, what's the likelihood of enforcement action? The answer depends on:
- **Volume**: Low automated volume → near-zero enforcement probability
- **Commercial impact**: Reselling access → high enforcement probability
- **Visibility**: Public tools wrapping Claude → moderate enforcement (takedown notices)
- **Ecosystem value**: Developers building cool things → enforcement deliberately deprioritized

## Key Takeaway

Token Prophet's architecture — pre-computed data, zero API dependency, fully client-side — means TOS enforcement is a non-issue for this project. But understanding how Anthropic draws (and doesn't draw) enforcement lines is valuable market intelligence for anyone building in the AI tooling space. The pattern is clear: **build with the official channels, don't substitute for them, and the platform will leave you alone.**

---

*Filed under: platform intelligence, AI ecosystem dynamics*
