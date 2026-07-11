# Scheduled AI Workflow Agents — Competitive Landscape

*Compiled 12 July 2026 for the "Agents & Automation" hackathon track pivot: a SCHEDULED, Mesh-native, multi-model workflow agent (one Mesh API key, 1000+ models, cheap-vs-smart model per step, cost visible, review gate before side effects).*

*Method: live docs pulled via WebFetch / ScraplingServer stealth fetch on 2026-07-12 (see Sources). Where a page 404'd or a claim came from a secondary source (blog, forum, cached search snippet) instead of the vendor's own docs, it is marked **UNVERIFIED** inline.*

---

## Landscape table

| Tool | Scheduled? | Multi-model? | Cost-visible ($/run)? | Weight |
|---|---|---|---|---|
| **n8n** | Yes — native cron (Schedule Trigger node) | Partial — one model per AI Agent node; manual multi-node wiring, no cost-aware routing | No — dollar cost not shown; billed in compute-seconds/ops | Heavy (self-host/Docker or cloud, full canvas) |
| **Zapier Agents** | Yes — scheduled tasks + preset intervals (no raw cron) | UNVERIFIED / likely no — no per-step model picker found | No — billed in "activities," not USD | Light UI, but fully closed/hosted, no self-host |
| **Make.com** | Yes — interval/day/week/month presets (no raw cron) | Partial — 400+ AI modules, manual per-module provider choice | No — billed in "operations/credits" | Medium (hosted, no Docker, but full scenario canvas) |
| **LangGraph** | Yes, but only on paid **LangGraph Platform** (native Cron Jobs); OSS library has none | Yes — core pattern, per-node model middleware | No (cost lives in LangSmith, not LangGraph itself) | Heavy — Python/JS framework, paid platform needed for cron |
| **LangSmith** | No (observability tool, not a scheduler) | N/A | **Yes** — real per-trace $/token cost, best-in-class here | Hosted SaaS add-on, not a workflow engine |
| **CrewAI** | **No** — only event-based Triggers (Gmail/Slack/etc.), no time-based cron found | Yes — per-agent `llm=` param, any provider/LiteLLM | UNVERIFIED — no cost dashboard found in docs | Heavy — Python framework; AMP hosted tier is lighter |
| **Trigger.dev** | Yes — native cron (`schedules.task`) | No — generic job runner, not AI-routing-aware | Platform compute cost only, not per-LLM $ | Medium — TS SDK, managed cloud or self-host |
| **Inngest (AgentKit)** | Yes — native cron, timezone + jitter | **Yes** — AgentKit mixes OpenAI/Anthropic/Gemini/OpenAI-compatible in one network | Platform execution cost only, not per-LLM $ | Medium — SDK-first, cloud-hosted |
| **Windmill** | Yes — native Schedules (raw cron, visual, or NL-generated) | Partial/UNVERIFIED — many providers as "AI resources," unclear if first-class router node | No — flat seat/compute billing, no per-run $ | Both — easy cloud or fast self-host |
| **OpenAI (Assistants/Agents SDK/Responses)** | **No** — confirmed no native cron; BYO scheduler | No native — cross-vendor needs 3rd-party adapters (LiteLLM), "beta" | Not surfaced | Light (code library), but zero orchestration included |
| **Anthropic (Claude Code Routines)** | **Yes** — native cloud cron via Claude Code Routines (`/schedule`, min 1-hr interval) | No — Claude-only; multi-vendor only via Bedrock/Vertex, not Anthropic's own tooling | Not surfaced | Heavier than OpenAI — managed hosted product |
| MindStudio (niche, UNVERIFIED depth) | Yes | Yes (markets "multi-model routing") | UNVERIFIED | No-code SaaS |
| Gumloop (niche, UNVERIFIED depth) | Yes | Yes (BYOK, per-node LLM choice) | UNVERIFIED | No-code SaaS |
| Relevance AI (niche, UNVERIFIED depth) | Yes (10-min min interval) | Not a marketed feature | UNVERIFIED | No-code SaaS |
| Lindy AI (niche, UNVERIFIED depth) | Yes | Not prominent | UNVERIFIED | No-code SaaS |

---

## Per-tool notes

### n8n
Open-source/self-hostable visual workflow canvas with native LangChain-based AI nodes. Schedule Trigger supports full 6-field cron. The AI Agent node binds to **one** chat-model connection; achieving "cheap step, smart step" means manually placing multiple Agent nodes each wired to a different provider — there's no automatic cost-aware router. No dollar cost per execution anywhere in the product; n8n Cloud bills compute-seconds, separate from whatever the LLM provider charges. Heavy to stand up (Docker/credentials/canvas) for what should be a 3-step scheduled agent.

### Zapier Agents
No-code "AI teammate" layer over Zapier's app ecosystem, positioned as autonomous rather than fixed-step. Supports scheduled/recurring agent tasks, but classic Schedule-by-Zapier caps at preset intervals — no raw cron even on paid plans. Official Agents marketing/help pages 404'd on direct fetch during this research, so multi-model and cost specifics are UNVERIFIED beyond secondary sources; billing is an "activities" counter, not USD.

### Make.com
Visual no-code scenario builder with a large AI module catalog (OpenAI, Anthropic, Gemini, Azure OpenAI, Mistral, HuggingFace, 400+ AI apps). Scheduling uses interval/day/week/month pickers, not raw cron. Multi-model in one scenario is possible but manual, module-by-module. Billing is "operations/credits," never a dollar figure per AI call.

### LangGraph
Open-source graph orchestration library — the closest thing to a "real" multi-model router (per-node model middleware is a first-class pattern). But native **Cron Jobs** scheduling only exists on the paid, hosted **LangGraph Platform**; the OSS library itself has zero scheduling primitive. Cost is not shown in LangGraph — you need LangSmith bolted on. Heavy: requires Python/JS engineering plus a platform subscription just to get cron.

### LangSmith
Not a scheduler or orchestrator — an observability/tracing layer. Its standout feature is genuinely strong: automatic per-trace token and **dollar cost** tracking, aggregated and broken down per child run. This is the best cost-visibility in the entire landscape, but it's bolted onto LangChain/LangGraph, not a standalone scheduled-agent product.

### CrewAI
Python framework for role-playing multi-agent "Crews" plus deterministic "Flows." Confirmed **no time-based scheduling** anywhere in the docs — the hosted CrewAI AMP tier has "Triggers," but they're event-based only (Gmail, Slack, Salesforce, webhooks), not cron. Multi-model is easy and well-documented (per-agent `llm=`, LiteLLM-routed 20+ providers). No cost-per-run dashboard found. A real gap: strong multi-model story, no scheduling story at all.

### Trigger.dev
Durable-execution/background-jobs platform for developers, not AI-specific. Native cron scheduling is a first-class feature (`schedules.task`). No multi-model routing — it's generic job execution; any AI use is just calling an SDK inside a task. Cost shown is platform compute cost (seconds × rate), not per-LLM-call dollars.

### Inngest (AgentKit)
Durable-functions platform, and its **AgentKit** extension is the strongest "close competitor" found: native cron scheduling with timezone/jitter support, plus a documented pattern for mixing OpenAI, Anthropic, Gemini, and OpenAI-compatible models within one agent network. Still: a handful of named providers, not "1000+ models via one key," and cost shown is platform execution cost, not per-LLM dollars.

### Windmill
Open-source workflow engine (Retool + Airflow/Temporal-ish). Native Schedules feature supports raw cron, a visual builder, or NL-prompt-generated cron expressions. Many LLM providers are configurable as workspace "AI resources," but it's UNVERIFIED whether that extends to a first-class in-flow model-router node vs. it being mostly for the Windmill AI code-authoring assistant. No per-run dollar cost — flat seat/compute billing.

### OpenAI (Assistants / Agents SDK / Responses API)
Confirmed **no native scheduling** across Assistants, Agents SDK, and Responses API docs — scheduling is entirely bring-your-own-cron. No native multi-model routing (the SDK has a `ModelProvider` extension point, but cross-vendor mixing needs third-party adapters like LiteLLM, described as best-effort/beta). Cost not surfaced in the agent tooling itself.

### Anthropic (Claude Code Routines)
The one AI-lab surprise: Claude Code has a real, currently-shipping **native cloud scheduling product** — Routines (`/schedule`, scheduled/API/GitHub triggers, cron with a 1-hour minimum interval), in research preview on Pro/Max/Team/Enterprise. This directly contradicts the "AI labs don't do scheduling" assumption for Anthropic specifically. But it's Claude-only — no multi-model routing at the Anthropic tooling layer (cross-vendor access would require going around Anthropic via Bedrock/Vertex model catalogs, not something Routines itself exposes).

### Niche "cron for LLM" players
MindStudio and Gumloop both explicitly pitch scheduled runs + multi-model/BYOK routing — the closest conceptual competitors found — but neither markets "1000+ models" breadth or per-run dollar cost as a headline; verified only at marketing-page depth, not deep-audited. Relevance AI and Lindy AI schedule well but don't lead with multi-model. AnythingLLM (self-hosted OSS) has both a job scheduler and a model router but is a desktop/self-hosted tool, not a SaaS competitor.

---

## The gap we can win

Across every tool surveyed, **nobody combines native cron scheduling, cost-aware multi-model routing across a large model catalog, and visible per-run dollar cost in one lightweight product.** The durable-execution platforms (Trigger.dev, Inngest, Windmill) nail scheduling but treat models as an afterthought — Inngest's AgentKit is the closest, yet still hand-wires a handful of named providers, not a 1000+-model catalog behind one key. The AI-native frameworks (LangGraph, CrewAI) nail multi-model routing but split scheduling from cost visibility across two different paid products (LangGraph Platform's cron vs. LangSmith's cost dashboard) or skip scheduling entirely (CrewAI). Every no-code tool (n8n, Zapier, Make) buries LLM spend inside opaque "operations/credits/activities" counters that are never actually dollars. A Mesh-native scheduled agent that (1) runs on real cron, (2) lets each step declare cheap-vs-smart and Mesh's single key resolves it against 1000+ models, (3) shows the actual USD cost per run using Mesh's own per-model pricing, and (4) inserts a human review gate before any side-effecting step, is white space — not a rebuild of n8n, LangGraph, or Inngest, but the missing connective tissue between what they each do well.

---

## Sources

- n8n Schedule Trigger — https://docs.n8n.io/integrations/builtin/core-nodes/n8n-nodes-base.scheduletrigger/ (accessed 2026-07-12)
- n8n LangChain Agent node — https://docs.n8n.io/integrations/builtin/cluster-nodes/root-nodes/n8n-nodes-langchain.agent/ (accessed 2026-07-12)
- n8n AI marketing page — https://n8n.io/ai/ (accessed 2026-07-12)
- Zapier scheduling help — https://help.zapier.com/hc/en-us/articles/8496288648461-Schedule-Zaps-to-run-at-specific-intervals (accessed 2026-07-12); Zapier Agents pages returned 404 on direct fetch — facts on Agents sourced from search snippets, UNVERIFIED against primary docs
- Make.com scheduling — https://help.make.com/schedule-a-scenario (accessed 2026-07-12)
- Make.com AI automation — https://www.make.com/en/ai-automation (accessed 2026-07-12)
- Make.com pricing — https://www.make.com/en/pricing (accessed 2026-07-12); make.com/en/agents 404'd
- LangGraph Platform — https://docs.langchain.com/langgraph-platform (accessed 2026-07-12)
- LangGraph Platform Cron Jobs — https://docs.langchain.com/langgraph-platform/cron-jobs (accessed 2026-07-12)
- LangChain models/middleware — https://docs.langchain.com/oss/python/langchain/models (accessed 2026-07-12)
- LangSmith cost tracking — https://docs.langchain.com/langsmith/cost-tracking (accessed 2026-07-12)
- LangSmith observability — https://docs.langchain.com/langsmith/observability-concepts (accessed 2026-07-12)
- CrewAI intro — https://docs.crewai.com/en/introduction (accessed 2026-07-12)
- CrewAI LLMs — https://docs.crewai.com/en/concepts/llms (accessed 2026-07-12)
- CrewAI Enterprise/Triggers — https://docs.crewai.com/en/enterprise/introduction, https://docs.crewai.com/en/enterprise/features/triggers, https://docs.crewai.com/en/enterprise/features/automations (accessed 2026-07-12)
- Trigger.dev scheduled tasks — https://trigger.dev/docs/tasks/scheduled (accessed 2026-07-12)
- Inngest AgentKit — https://agentkit.inngest.com/overview (accessed 2026-07-12); main Inngest docs cron page returned 400 on fetch, syntax detail partially UNVERIFIED
- Windmill scheduling — https://www.windmill.dev/docs/core_concepts/scheduling (accessed 2026-07-12); Windmill AI resource docs 404'd, multi-model depth UNVERIFIED
- OpenAI Assistants migration — https://developers.openai.com/api/docs/assistants/migration (accessed 2026-07-12)
- OpenAI Agents SDK (Python) — https://openai.github.io/openai-agents-python/ (accessed 2026-07-12)
- Claude Code Routines — https://code.claude.com/docs/en/routines (accessed 2026-07-12)
- Mesh API pricing/dashboard (own research, prior) — `docs/research/mesh-api.md` in this repo, sourced from developers.meshapi.ai docs
- Niche competitors (MindStudio, Gumloop, Relevance AI, Lindy AI, AnythingLLM) — identified via WebSearch on 2026-07-12; marketing-page depth only, **UNVERIFIED** beyond headline claims, not deep-audited against live docs
