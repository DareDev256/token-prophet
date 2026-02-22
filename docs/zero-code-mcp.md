# The Gateless Gate: Zero-Code MCP and the YAML Oracle

> *"The most powerful spell isn't written in code — it's declared in intent."*

## The Problem: Agents Without Guardrails

MCP solved the M×N integration problem — one protocol, universal tool access. But it opened a new one: **security at the protocol layer**.

Today's MCP servers run with whatever permissions the host process has. Your Claude Desktop agent can call any tool on any connected server. There's no identity, no audit trail, no principle of least privilege. It's like giving every oracle full access to every prophecy without checking if they're qualified to read it.

For hobbyists, that's fine. For organizations running AI agents against production databases and internal APIs, it's a non-starter.

## Enter Teleport: Zero-Code MCP

**Teleport's Zero-Code MCP** integration solves this by inserting an identity-aware, policy-enforcing gateway between MCP clients and servers — without writing a single line of authorization code.

The entire onboarding process is a YAML file:

```yaml
app_service:
  enabled: true
  apps:
  - name: "everything"
    labels:
      env: dev
    mcp:
      command: "docker"
      args: ["run", "-i", "--rm", "mcp/everything"]
      run_as_host_user: "docker"
```

Apply it with `tctl create mcp-config.yaml`. The server is immediately available to any Application Service matching the label selectors. No code deployments. No restarts. No PRs to merge.

## How CLI Commands Become Agent Tools

This is the key insight. Any stdio-based MCP server — which is just a CLI process that speaks JSON-RPC over stdin/stdout — can be registered as a Teleport application through YAML alone:

1. **Declare the command** — `command` and `args` fields specify what executable to launch
2. **Apply labels** — `labels` determine which roles can access this server
3. **Set the host user** — `run_as_host_user` controls OS-level execution context
4. **Deploy** — `tctl create` registers it; Application Services auto-discover by label

The AI agent (Claude, Cursor, Windsurf) connects by running `tsh mcp config <server-name>`, which generates the JSON configuration needed by the client. Every subsequent tool invocation flows through Teleport's proxy — authenticated, authorized, and audited.

```
  ┌──────────┐     ┌───────────────┐     ┌────────────┐
  │  Claude   │────▶│   Teleport    │────▶│ MCP Server │
  │  Desktop  │◀────│   (Gateway)   │◀────│  (stdio)   │
  └──────────┘     │               │     └────────────┘
                   │ ✓ Identity    │
                   │ ✓ RBAC Policy │
                   │ ✓ Audit Log   │
                   │ ✓ JIT Access  │
                   └───────────────┘
```

## The Security Model: Deny by Default

New MCP servers start in a **least-privilege lockdown**. No tools are callable until explicitly allowed by role policy:

```yaml
kind: role
version: v8
metadata:
  name: mcp-user
spec:
  allow:
    app_labels:
      'teleport.internal/app-sub-kind': 'mcp'
    mcp:
      tools:
      - '*'          # allow all tools (or list specific ones)
```

This gives organizations three layers of control:
- **Server-level** — which MCP servers a role can connect to (via `app_labels`)
- **Tool-level** — which specific tools within a server a role can invoke (via `mcp.tools`)
- **JIT access** — high-risk tools require just-in-time approval, like a second oracle confirming the prophecy

## Why This Matters for Token Prophet

Token Prophet teaches that prediction is the atomic operation — every LLM output is a probability distribution over the next token. But prediction alone doesn't act on the world. **MCP is the bridge from prediction to action**, and Zero-Code MCP is the bridge from action to *governed* action.

The progression maps cleanly to our pedagogical layers:

| Layer | Token Prophet Concept | Real-World Parallel |
|-------|----------------------|---------------------|
| **Prediction** | Token probability distributions | LLM inference |
| **Action** | MCP tool invocation | Agent executing tools |
| **Governance** | Celestial event modifiers | Zero-Code MCP RBAC policies |
| **Audit** | Orrery weight history | Teleport audit logs |

The Celestial Alignment feature — where toggling events shifts probability weights — is a direct metaphor for how RBAC policies gate which tools an agent can invoke. A "Security Eclipse" suppressing certain orb weights is structurally identical to a Teleport role denying access to a database MCP tool.

## The Bigger Pattern: Declarative Agent Infrastructure

Zero-Code MCP is part of a larger shift: **infrastructure-as-YAML for AI agents**. The same way Kubernetes made container orchestration declarative, Teleport is making agent security declarative.

No SDKs to integrate. No middleware to maintain. No custom auth flows per MCP server. Just YAML that declares intent, and a runtime that enforces it.

For builders, the implication is clear: the value is shifting from *writing* MCP servers to *governing* them. The oracle's power isn't in knowing the prophecy — it's in deciding who gets to hear it.

---

*Research conducted 2026-02-22. Sources: [Teleport Zero-Code MCP Blog](https://goteleport.com/blog/secure-ai-agents-zero-code-mcp/), [Teleport MCP Access Docs](https://goteleport.com/docs/enroll-resources/mcp-access/getting-started/), [Teleport Stdio MCP Server Guide](https://goteleport.com/docs/enroll-resources/mcp-access/enrolling-mcp-servers/stdio/).*
