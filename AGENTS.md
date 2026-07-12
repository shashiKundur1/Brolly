# Brolly — Agent & Contributor Guide

Brolly is "model insurance for your LLM apps": a Node proxy in front of the **Mesh API** gateway (usage dashboard, cost-cascade routing, mid-session failover) with a doodle-styled Next.js frontend. Built for the Mesh hackathon (Multi-model track).

Read this before touching code. It captures the conventions you can't infer from the tree.

## Layout

- `backend/` — Node 22, ESM (`"type":"module"`), Express + `mongodb`, **no build step, no TypeScript**. Entry `src/server.js`.
- `frontend/` — Next.js 16 (App Router, Turbopack), React 19, Tailwind v4, shadcn/ui (base-ui, **not** Radix), TypeScript.
- `docs/` — research (`docs/research/**`), design system (`docs/design/**`). Read `docs/design/REDESIGN-CONTRACT.md` before any UI work.
- Root: `PRODUCT.md` (strategy), `DESIGN.md` (visual system), `docker-compose.yml`.

## Run & test

```sh
# backend (needs backend/.env — see below)
cd backend && npm i && npm run dev        # proxy on :4000, node --watch
cd backend && npm test                     # node --test, 78 tests, must stay green

# frontend
cd frontend && npm i && npm run dev         # :3000
cd frontend && npx tsc --noEmit             # type-check (gate for every FE change)
cd frontend && npm run lint                 # eslint
```

Docker: `docker compose up --build` → frontend :3001, backend :4001, mongo :27017. **Note:** compose hardcodes `MOCK:"1"`; local `.env` runs live.

## The one hard rule (hackathon)

**Every AI call must visibly route through the Mesh API.** All Mesh HTTP lives in one file: `backend/src/mesh.js` (`meshChat`, `meshChatStream`, `meshModels`). Do not scatter model calls elsewhere — a judge must open that file and see the integration.

## Backend conventions

- Env in `backend/.env` (gitignored, never commit): `MESH_API_KEY=rsk_...`, `MESH_BASE_URL=https://api.meshapi.ai/v1`, `PORT=4000`, `MOCK=0`, optional `MONGO_URL`. Without a key, `MOCK=1` serves deterministic demo traffic.
- **Live mode degrades gracefully:** a real Mesh `402 spend_limit_exceeded` falls back to a mock completion (flagged `brolly_degraded`) so the app never crashes on an empty balance. Top up Mesh → real output, zero code change.
- Model taxonomy + prices: `src/models.js` `CATALOG` (tier 1/2/3, $/1M). Usage log: `src/usage.js` (JSONL + optional Mongo mirror). Orchestration: `src/pipeline.js` (`completeChat`).
- Validate at trust boundaries, never lose a usage event on error. Tests boot the app on an ephemeral port with `NODE_ENV=test MOCK=1` — mirror `test/smoke.test.js`. Tests must be order-independent (a dirty `data/` dir breaks them — clean between manual live testing and `npm test`).

## Frontend conventions (non-negotiable)

- **ZERO code comments.** Anywhere.
- **No arbitrary Tailwind values** (`w-[13px]`, `bg-[#hex]`). Use canonical classes and the CSS-variable tokens in `app/globals.css` (`bg-primary`, `text-foreground`, `border-border`, …). Custom geometry/shadows go in `globals.css` `@layer utilities`; inline `style` only for true data (SVG path geometry).
- **Icons:** `@phosphor-icons/react` using the `*Icon`-suffixed exports, OR the in-house doodle set at `components/brand/icons.tsx` (prefer these for chrome). **Never `lucide-react`.**
- **Full-width layouts only:** `w-full` with `px-6 md:px-10`. Never `max-w-3xl`/`max-w-4xl` page constraints.
- **Fewest divs possible:** semantic elements + shadcn subcomponents (`CardHeader`/`CardContent`, `Field`, `TableHeader`) over div soup.
- `"use client"` only where needed. shadcn primitives are **base-ui** — state selectors are `data-checked`/`data-open`/`data-disabled`, and polymorphism is the `render` prop, **not** Radix `asChild`.
- This is a modified Next.js — read `node_modules/next/dist/docs/` before assuming an API; heed deprecation notices.

## Design system (doodle)

Palette, fonts, motion, and the "sticker-press" component vocabulary are in `DESIGN.md` + `docs/design/REDESIGN-CONTRACT.md`. Essentials: white paper bg, ink `#2f3e36`, coral `#e8756a` (the one loud thing per view), mint/butter accents. Gochi Hand = display only (≥20px, never on labels/data). Nunito = body. JetBrains Mono + `tabular-nums` = every number/cost/model id. Wobble = asymmetric `border-radius` (`.doodle-card` family); 2px ink border = pressable, dashed fern = passive. Motion is linear/stepped, gated behind `prefers-reduced-motion`. Body text stays WCAG AA — decoration never costs legibility.

## Git & workflow

- **Commits carry the author's name only. NEVER add a `Co-Authored-By` trailer** (no Claude/agent co-author, ever).
- Small, frequent, honest commits. Conventional-commit style: `feat(ui): …`, `fix(backend): …`, `docs(design): …`. Reference issues when closing (`closes #N`).
- Branch off the default branch for non-trivial work; commit/push only when asked.
- Verify before claiming done: `npx tsc --noEmit` for FE, `npm test` for BE, and a **live Playwright screenshot** for any visual change (use an isolated browser context — the shared one gets hijacked). Report real output, including failures.

## Doing UI redesign work

1. Read `REDESIGN-CONTRACT.md` — it's the shared design language so parallel work stays consistent.
2. Own a bounded file set; keep every export/prop/variant/size key (pages depend on them — redesign = classNames + small structure, not API changes).
3. Screenshot the result live at 1440 and 375, look at it, iterate until it reads hand-drawn *and* legible.
4. `tsc --noEmit` clean, then commit (author name only) and close the issue.
