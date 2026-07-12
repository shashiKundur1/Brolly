# Brolly Doodle Redesign — Shared Contract (every redesign agent obeys this)

Distilled from docs/design/doodle-references.md + component-audit.md. Consistency across components matters more than any single clever effect.

## Palette (CSS vars only — never hardcode hex in components)
bg/card `#ffffff` · ink `--foreground #2f3e36` · coral `--primary #e8756a` · mint `--secondary #bcd9cf` · butter `--accent #f2d98c` · fern border `#9db5a6` · muted `#eef2ee`.

## Fonts
- Shantell Sans (`font-display`) — DISPLAY ONLY: h1/h2, dialog titles, empty-state lines, big numbers. Never on control labels or body. Never below 20px.
- Nunito (`font-body`) — all UI labels, body, buttons.
- JetBrains Mono (`font-mono`) — every number, cost, model id, with `tabular-nums`.

## The doodle language (apply consistently)
1. **Wobble = asymmetric border-radius**, not random. Use the established `.doodle-card` trick family (255px 15px 225px 15px / 15px 225px 15px 255px). Vary the corner values per component so no two shapes are identical, but keep the SAME technique.
2. **Ink border 2px** on pressable/interactive things (solid `--foreground`). **Dashed fern border** on passive containers/dividers.
3. **Offset shadow** `Npx Npx 0 0 var(--foreground|--border)` — chunky, hard, no blur. Hover lifts (-1px, bigger shadow), active presses flat. Gate motion behind `prefers-reduced-motion`.
4. **One loud coral thing per view.** Everything else sage/mint/paper. Coral = the single primary action or the alert state, never decoration.
5. **Icons: prefer the in-house doodle set** `@/components/brand/icons` (GaugeDoodle, CoinsDoodle, UmbrellaDoodle, CheckDoodle, ArrowRightDoodle, SparkDoodle, etc. + DoodleCircle). Replace Phosphor for UI chrome where a doodle icon fits.
6. Motion: linear / stepped / flipbook. NO bounce, NO spring. 150–250ms. Reduced-motion = instant/crossfade.

## Usability guardrails (non-negotiable — from the references)
- Body/label text stays WCAG AA (≥4.5:1). Ink on white/mint/butter passes; ink on coral fails → coral buttons use white text.
- Hand font never on anything you must read fast (labels, data, inputs).
- Consistent stroke weight (2px) across the whole system — the #1 tell of amateur doodle UI is mixed weights.
- Every interactive component keeps ALL states: default, hover, focus-visible (coral ring), active, disabled, aria-invalid.
- Keep every existing export name, prop, variant key, size key. Redesign = classNames + small structure, NOT API changes (pages depend on them).

## Hard rules
ZERO code comments. NO arbitrary Tailwind values (put custom geometry/shadows in globals.css `@layer utilities`; inline `style` only for true data like SVG path geometry). Minimal divs — semantic elements + shadcn subcomponents. `"use client"` only where needed.

**NO DOTTED OR DASHED BORDERS. ANYWHERE.** Never `border-dashed`, never `border-dotted`, never `.doodle-border`. Every container/cell/card/divider uses a SOLID border (the `.doodle-card`/`.doodle-rough` family — solid ink 2px + offset shadow + wobble radius) or no border at all. Dividers use a solid thin line or whitespace, not a dashed rule. This is non-negotiable and applies to outer containers too.

**NO MEANINGLESS DECORATION.** Every illustration must MEAN something relevant to what its cell shows (a spend chart for spend, a cascade/ladder for routing). Do not fill a data cell with a generic decorative character. **NO EMPTY SPACE** — a cell must not be mostly blank around a small illustration; size content to fill its cell, or make the cell smaller. If a cell has nothing meaningful to show, remove it and let the grid reflow tighter.

## Verify (every agent)
`cd frontend && npx tsc --noEmit` clean for your files. Screenshot your component live via Playwright in an ISOLATED context (`browser_run_code_unsafe` → `page`) at 1440 AND 375, read the image back, iterate until it visibly reads hand-drawn AND stays legible. Commit as **shashiKundur1 only — never a Co-Authored-By trailer**.
