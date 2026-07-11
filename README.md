# Brolly ☂️ — Model Insurance for your LLM apps

Built on the [Mesh API](https://meshapi.ai) unified gateway for the Mesh Hackathon (Multi-model track).

One proxy endpoint. Three protections:

1. **Live usage & limits dashboard** — point your tools at Brolly and see spend, burn rate, and "this run will eat 30% of your weekly limit" projections across every provider Mesh routes to.
2. **Cost cascade routing** — each request tries the cheapest model that passes *your own* mini-benchmark, escalating only on failure. Your benchmark, not their leaderboard.
3. **Mid-session failover with behavior distillation** — a model dies mid-conversation, the session hot-swaps to the closest-behavior fallback carrying full context.

Every AI call visibly routes through the Mesh API (`backend/src/mesh.js`).

## Structure

- `frontend/` — Next.js dashboard + landing (doodle UI, GSAP, shadcn, Phosphor icons)
- `backend/` — Node.js proxy (OpenAI-compatible passthrough → Mesh) + usage tracking
- `docs/` — research and API notes

## Run

```sh
cd backend && npm i && npm run dev    # proxy on :4000
cd frontend && npm i && npm run dev   # dashboard on :3000
```

Set `MESH_API_KEY` in `backend/.env`. Without a key, `MOCK=1` serves deterministic demo traffic so the dashboard always has data.
