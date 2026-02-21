# 🔮 The New Glossary — Four Pillars of the Oracle's Language

> *Before the Prophet can predict, the Prophet must name. These are the four forces that shape every token's destiny.*

## The 4/5 And: LLMs, RAG, Agents, and MCP

The modern AI stack isn't one thing — it's four interlocking disciplines, each governing a different axis of prediction. Token Prophet teaches the first; the others reveal why prediction alone isn't enough.

---

### 1. LLMs — The Oracle's Voice

**Large Language Models** are neural networks trained on vast text corpora whose core operation is *next-token prediction* — the exact mechanic Token Prophet teaches. Given a sequence, the model outputs a probability distribution over all possible next tokens.

- **What they do**: Transform input sequences into probability distributions over vocabulary
- **2026 reality**: Claude Opus 4.5 scores 80.9% on SWE-bench Verified; Gemini 3 Pro processes 1M-token contexts natively
- **Token Prophet connection**: Every round of gameplay *is* the LLM's core loop — you are the transformer

### 2. RAG — The Oracle's Memory

**Retrieval-Augmented Generation** injects external knowledge into the prediction process at query time. Instead of relying solely on training data, the model retrieves relevant documents and folds them into its context window before generating.

- **What it does**: Fetches pertinent data from knowledge bases to ground predictions in fact
- **Why it matters**: Reduces hallucination by anchoring generation to retrieved evidence
- **Token Prophet connection**: RAG shifts probability distributions — the same mechanic our Celestial Alignment demonstrates when external events modify orb weights

### 3. Agents — The Oracle's Hands

**AI Agents** wrap LLMs in a decision loop: observe → reason → act → observe again. They transform passive text predictors into autonomous systems that can use tools, execute code, and interact with the world.

- **What they do**: Orchestrate multi-step workflows through iterative reasoning and tool use
- **The evolution**: Traditional LLMs → reasoning models → agentic systems (three paradigms, three delivery vessels)
- **Token Prophet connection**: Agents are prediction engines that *act* on their predictions — the logical endgame of what the Prophet learns

### 4. MCP — The Oracle's Tongue

**Model Context Protocol** is Anthropic's open standard for connecting AI models to external systems — the "USB-C port" for AI. It standardizes how models discover and invoke tools, databases, and APIs.

- **What it does**: Provides a universal interface between LLMs and external services
- **Key distinction**: RAG = knowledge injection (memory), MCP = tool interface (plumbing), Agents = decision loop (manager)
- **Token Prophet connection**: MCP is the protocol that lets prediction cascade into action — the bridge from knowing the next token to doing something about it

---

## How They Stack

```
┌─────────────────────────────────┐
│         AGENT (decision loop)   │
│  ┌───────────┐  ┌────────────┐ │
│  │  RAG      │  │   MCP      │ │
│  │ (memory)  │  │  (tools)   │ │
│  └─────┬─────┘  └─────┬──────┘ │
│        └───────┬───────┘        │
│           ┌────┴────┐           │
│           │   LLM   │           │
│           │(oracle) │           │
│           └─────────┘           │
└─────────────────────────────────┘
```

The LLM predicts. RAG informs what it predicts *about*. MCP lets it *act* on predictions. The Agent decides *when* and *how*. Token Prophet teaches the foundation — everything else is scaffolding around that core probability distribution.

---

*Sources: [ByteByteGo](https://blog.bytebytego.com/p/ep202-mcp-vs-rag-vs-ai-agents), [Merge.dev](https://www.merge.dev/blog/rag-vs-mcp), [ClickUp](https://clickup.com/blog/rag-vs-mcp-vs-ai-agents/), [Contentful](https://www.contentful.com/blog/mcp-vs-rag/)*
