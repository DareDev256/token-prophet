# Claude Code's Compaction Bug — Discarded Data Still on Disk

> **Source**: [anthropics/claude-code#26771](https://github.com/anthropics/claude-code/issues/26771)
> **Filed**: 2026-02-19 by [@design-and-deliver](https://github.com/design-and-deliver)
> **Status**: Open | **Priority**: High | **Label**: Enhancement
> **Related issues**: #1534, #3021, #10960, #13919, #14968, #19888, #21105, #23620, #23821, #26922

## The Bug

When auto-compaction triggers mid-session, Claude's summarizer irreversibly loses user-provided data — even though **the full transcript still exists on disk** at `~/.claude/projects/{project-path}/`. The summary retains a reference ("user provided 8,200 characters of DOM markup") but discards the content. Claude then hallucinates details, hedges, or asks the user to re-paste.

**Root cause**: Compaction is a one-way lossy transformation with an available lossless source that isn't wired up. The summary and the transcript coexist on disk, but the summary contains no pointer back to its source material.

## Why This Matters for Token Prophet

This bug is a live demonstration of the core concept Token Prophet teaches: **context window management is probability management**. When compaction fires, Claude's probability distribution over possible next tokens shifts — it loses the grounding data that anchored its predictions. The model doesn't "forget" in a human sense; it loses the tokens that constrained its output distribution toward accurate answers.

This maps directly to Token Prophet's pedagogical model:
- **Compaction = reducing the token sequence** the model conditions on
- **Hallucination after compaction = unconstrained generation** — the distribution flattens without grounding tokens
- **Transcript on disk = ground truth** that could re-anchor the distribution

## The Proposed Fix: Indexed Transcript References

### Phase 1 — Within-Session Recovery

Tag compressed entries with transcript line-range annotations:

```
# Current (lossy, no recovery)
[compacted] User provided 8,200 characters of DOM markup for analysis.

# Proposed (recoverable)
[compacted] User provided 8,200 characters of DOM markup for analysis.
[transcript:lines 847-1023]
```

When Claude detects it needs specifics the summary doesn't contain, it reads only lines 847–1023 from the transcript. Surgical recovery, minimal token cost.

**Why it works**:
- **Zero standing overhead** — tokens spent only at retrieval
- **Ground truth recovery** — the transcript is the literal conversation
- **Architecturally minimal** — metadata pointers to files that already exist
- **Scales flat** — same cost model for 10-minute or 10-hour sessions

### Phase 2 — Cross-Session Recovery

The same mechanism extends across session transcripts:

```
[compacted] User established auth pattern using JWT with refresh tokens.
[session:2025-02-15/transcript:lines 312-487]
```

Current session checked first (fast, local). Cross-session search requires user opt-in to respect token budgets.

## Community Discussion

**@neocapy** shared a manual workaround: extracting conversation body text from the most recent transcript in `~/.claude/`, saving it, running `/clear`, then instructing Claude to read the saved transcript in a fresh context window. Works, but is entirely manual.

**@coreh** linked related issues #23821 and #26922, suggesting the problem surface is wider than the original report.

**GitHub's bot** flagged 3 potential duplicates (#22359, #21078, #10948) and attempted auto-closure — the community responded with **17 thumbs-down reactions**, keeping the issue open. This reaction count signals strong demand.

## Demand Evidence

At least **8 open issues** trace back to the same root cause — compaction summaries with no back-reference to source:

| Issue | Title | Status |
|-------|-------|--------|
| #1534 | Memory Loss After Auto-compact | Closed (persists) |
| #3021 | Forgets to Refresh Memory After Compaction | Open |
| #10960 | Repository Path Changes Forgotten | Open |
| #13919 | Skills context completely lost | Open |
| #14968 | Context compaction loses critical state | Open |
| #19888 | Conversation compaction loses entire history | Open |
| #21105 | Context truncation causes loss of history | Open |
| #23620 | Agent team lost when lead's context compacted | Open |

## Existing Workarounds (All Compensatory)

| Approach | Limitation |
|----------|------------|
| `MEMORY.md` behavioral nudge | Depends on Claude recognizing its own gaps |
| Manual `/compact` with preservation instructions | Not automated, still lossy |
| MCP memory ecosystem (embeddings, knowledge graphs) | External infrastructure compensating for one missing capability |
| #17428 — File-backed summaries | Duplicates data; transcript already exists |
| #15923 — Pre-compaction hook | Logs but doesn't enable recovery |
| #21190 — Last N interactions verbatim | Doesn't scale, inflates summary size |
| #6549 — Manual continuation prompts | Entirely user-dependent |

## Key Insight

The entire MCP memory ecosystem — embedding stores, knowledge graphs, SQLite-backed recall — exists partly because compaction summaries don't know where their source material lives. The indexed transcript reference approach would solve this **natively, at the platform layer**, with zero additional infrastructure.

The transcript is already the ground truth. The fix is a pointer, not a database.
