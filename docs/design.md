# Brolly ☂️ — Brand & Design System

## Brand

**Name:** Brolly — British slang for umbrella. Model insurance for your LLM apps: something over your head when a provider rains on you.

**One-liner:** "Insurance for your AI models."

**Voice:** Warm, wry, plainspoken. A friend who has been paged at 3am and now carries an umbrella everywhere. Never corporate ("leverage", "seamless" are banned). Puns about weather/rain/cover are encouraged, one per surface max.

**Naming in copy:** Brolly (capitalized), never BROLLY or brolly mid-sentence. Features are lowercase: the dashboard, the cascade, failover.

## Logo

Doodle umbrella, single-color, drawn with a visible hand (slightly wobbly strokes). Lives as **SVG only** — no raster logos anywhere.

- Component: `frontend/components/brand/logo.tsx` (`<BrollyLogo />`, inherits `currentColor`)
- File: `frontend/public/brand/brolly-logo.svg`
- Favicon: `frontend/app/icon.svg`
- Clearspace: half the canopy width. Minimum size 20px. Never recolor with gradients, never add drop shadows.

## Color

Soft-pastel doodle palette (from the pixel-forest reference). All colors flow through the shadcn CSS variables in `frontend/app/globals.css` — components never hardcode hex.

| Token | Hex | CSS var | Use |
|---|---|---|---|
| Sage mist | `#e8efe6` | `--background` | Page background |
| Paper | `#f7f9f4` | `--card` | Cards, surfaces |
| Deep pine | `#2f3e36` | `--foreground` | Ink: text, logo, strokes |
| Coral | `#e8756a` | `--primary` | CTAs, the one loud thing per view |
| Mint | `#bcd9cf` | `--secondary` | Secondary chips, fills |
| Butter | `#f2d98c` | `--accent` | Highlights, warnings-lite |
| Mist | `#d7e3da` | `--muted` | Muted fills, table stripes |
| Fern | `#9db5a6` | `--border` | Borders, dashed doodle strokes |

Semantic extras: success = mint, danger = coral (reused deliberately — the palette stays small). Charts use pine ink bars on paper with fern dashed gridlines; coral only for the "over budget" state.

## Typography

- **Display:** Gochi Hand (`--font-display`) — h1/h2, wordmark, big numbers on empty states. Never below 20px (it gets illegible).
- **Body:** Nunito (`--font-body`) — everything else, 16px base.
- **Numbers/code:** `font-mono` (system mono) — token counts, costs, model ids. Model ids always render in mono: `openai/gpt-4o-mini`.

## Doodle style rules

1. `.doodle-border` = 2px dashed fern border; `.doodle-shadow` = small solid offset shadow. Cards that matter get both.
2. Corners are round (`--radius: 1rem`), nothing sharp.
3. Icons: `@phosphor-icons/react` `*Icon` exports only. Weight "duotone" for feature icons, "regular" elsewhere. Streamline-freehand energy: prefer playful icons (UmbrellaIcon, CloudRainIcon, LightningIcon, PiggyBankIcon).
4. Illustrations are inline SVG doodles in ink/coral/mint. No PNGs, no photos, no gradients.
5. As few divs as possible: semantic elements + shadcn subcomponents (CardHeader/CardContent/CardTitle, Field, TableHeader…).
6. Full-width layouts only: `w-full` with `px-6 md:px-10`. Never `max-w-3xl`/`max-w-4xl`.
7. No arbitrary Tailwind values. No code comments.

## Motion (GSAP)

Linear and honest — no bouncy easing, no spring physics. The doodle world moves like a flipbook.

- **Page wipe:** a sage-mist curtain wipes off the hero on load, `ease: "none"`, 0.6s, left→right (reference: the pixel-forest landing).
- **Stagger reveals:** cards/sections fade-up 12px, `ease: "none"`, 0.3s, stagger 0.08s.
- **Numbers:** count up once on first paint, 0.8s linear. Never re-animate on poll updates.
- **Failover moment:** the killed model card tips over (rotate 8deg, linear), fallback card slides in from the right. This is the demo's money shot — it may take 1s total, nothing else may.
- Respect `prefers-reduced-motion`: gate every tween.

## Layout patterns

- Nav: `SiteNav` — wordmark left, three links, coral CTA right.
- Pages open with a Gochi Hand h1 + one-line Nunito subtitle, then content.
- Dashboards: stat cards row (4-up desktop, 2-up tablet, 1-up mobile) → chart → table.
- Empty states: big doodle icon + Gochi Hand line + one coral action. Never a bare "No data".
