# Doodle UI Reference Playbook

Purpose: a concrete, source-backed playbook for making Brolly's UI genuinely hand-drawn and polished — not a stock shadcn look. Compiled 2026-07-12 via live web search + page fetches. Items pulled from a live page are marked with their source; anything not confirmed against a live page is marked **UNVERIFIED**.

---

## 1. Reference gallery

| Site / product | Doodle technique used | URL |
|---|---|---|
| **Excalidraw** | Whiteboard app whose entire rendering engine *is* the doodle technique: freehand vector shapes drawn via Rough.js-style sketchy rendering, with a user-adjustable "sloppiness"/roughness slider. Hand-drawn look communicates "this is a draft, not final" — the aesthetic itself signals informality. | [excalidraw.com](https://excalidraw.com/) |
| **tldraw** | Same hand-drawn canvas category as Excalidraw but positioned as an embeddable "canvas SDK" — engineering owns custom shapes/state/persistence rather than just a whiteboard. Tighter snapping and more refined toolset UI than Excalidraw while keeping the wobbly marker-line rendering. | [tldraw.com](https://tldraw.com/) |
| **Rough.js (library, not a product, but shapes many doodle sites)** | Canvas/SVG primitives (line, rectangle, circle, arc, polygon, path) rendered with sketchy strokes. Two knobs matter most: `roughness` (0.5 subtle → 2.8+ chaotic stroke irregularity) and `bowing` (px of intentional curve added to straight lines). 8 fill styles (hachure default, solid, zigzag, cross-hatch, dots, sunburst, dashed, zigzag-line). Under 9kB gzipped. Powers Excalidraw, diagrams.net, Terrastruct. | [roughjs.com](https://roughjs.com/), [GitHub](https://github.com/rough-stuff/rough) |
| **Wired Elements / wired.js** | Common HTML form controls (buttons, inputs, checkboxes, sliders) re-skinned with Rough.js sketchy borders — a working example of doodle-izing *standard UI controls*, not just illustrations. | [wiredjs.com](https://wiredjs.com/) |
| **DoodleCSS** | Pure CSS/HTML theme: `.doodle` root class + `.doodle-border` utility puts a hand-drawn box around any element; ships with a companion `doodles.svg` sprite sheet for inline vector doodles; pairs with the "Short Stack" handwriting Google Font for body-adjacent UI text. Proof that a full component theme (buttons, selects, textareas, checkboxes) can be doodle-fied without canvas/JS. | [chr15m.github.io/DoodleCSS](https://chr15m.github.io/DoodleCSS/), [GitHub](https://github.com/chr15m/DoodleCSS) |
| **Codrops SVG Filter Effects series** | Not a product but the definitive technique reference for the `feTurbulence` + `feDisplacementMap` combo that produces hand-drawn "boiling"/jitter distortion on any SVG shape or border — the mechanism Brolly should use for a subtle animated wobble. | [tympanus.net/codrops feTurbulence article](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) |
| **Camillo Visini — "Simulating Hand-Drawn Motion with SVG Filters"** | Working demo + code for animating the turbulence/displacement combo by stepping `baseFrequency` on an interval (not animating `seed`), with an "animation scale" slider (0 = static, 1 = full wobble). Gives concrete numbers to start from (see §2). | [camillovisini.com](https://camillovisini.com/coding/simulating-hand-drawn-motion-with-svg-filters) |
| **Duolingo** | Not doodle-rendered, but the reference for *illustration restraint*: shape language keeps strokes at one consistent weight, palette is loud but confined to 4 semantic colors (green=go, orange=streak, red=wrong, blue=XP), and every screen has exactly one dominant playful element rather than doodles everywhere at once. Relevant as the "one loud thing" discipline reference, not as a rendering technique. | [design.duolingo.com](https://design.duolingo.com/), [blog.duolingo.com shape language](https://blog.duolingo.com/shape-language-duolingos-art-style/) |
| **Streamline "Freehand" icon families** | Large (11,000+) icon set explicitly in a "friendly, hand-drawn feeling" doodle style with subtly curved, cartoonish shapes — useful as a fallback/benchmark for stroke weight and corner looseness, though Brolly should keep using its own in-house set (see §4). **UNVERIFIED** exact icon count claim (only confirmed via search snippet, not fetched). | [home.streamlinehq.com](https://home.streamlinehq.com/) |

Note on method: Firecrawl (self-hosted) successfully scraped `excalidraw.com`, `tldraw.com`, and the Codrops feTurbulence article (HTTP 200 each, 30-34s). The two canvas-app homepages returned near-empty markdown (they're JS-canvas apps with almost no server-rendered text) — confirmed via WebFetch + search instead, which is why those two entries above lean on WebFetch summaries rather than scraped body copy. No fabricated URLs: every link above resolved in a live fetch or was returned verbatim by web search.

---

## 2. Techniques for our stack (ranked by effort/payoff)

Brolly stack: CSS-only wobble already started (`.doodle-card` asymmetric border-radius in `frontend/app/globals.css`), Tailwind v4, Next.js 16, shadcn/ui, plus an in-house 16-icon doodle set (`frontend/components/brand/icons.tsx`) and 16 scene SVGs (`frontend/components/brand/scenes.tsx`) — both already hand-drawn `<path>` data with `vectorEffect="non-scaling-stroke"`.

1. **CSS-only asymmetric border-radius wobble** — *Effort: trivial. Payoff: high.*
   Brolly already has this in `.doodle-card`: `border-radius: 255px 15px 225px 15px / 15px 225px 15px 255px`. Extend the same pattern to buttons, badges, and dialog panels with 2-3 alternate radius strings so not every card uses the identical wobble (visual monotony is the #1 failure mode of this trick — see §3 "consistent stroke weight" rule). Zero JS, zero new deps, works today.

2. **Offset "sketch" box-shadow instead of blur shadow** — *Effort: trivial. Payoff: high.*
   Already in `.doodle-shadow` / `.doodle-shadow-lg` (`box-shadow: 4px 4px 0 0 var(--border)`, no blur). This is the single highest-leverage doodle signal shadcn defaults don't have — shadcn ships soft blurred shadows, Brolly's hard offset shadow reads as "drawn," not "rendered." Keep using it on every elevated surface (cards, popovers, the coral CTA button) instead of Tailwind's default `shadow-md`.

3. **Reuse the existing in-house SVG icon/scene set everywhere before reaching for Phosphor** — *Effort: low (already built). Payoff: high.*
   `icons.tsx` (16 icons) and `scenes.tsx` (16 illustrations) are hand-authored wobbly-stroke paths already matching the ink/coral/mint palette. Per `docs/design.md` rule 3, Phosphor duotone is the fallback for icons *not* covered by the in-house set — but any new UI surface (empty states, onboarding, error pages) should check `scenes.tsx` first. This is strictly cheaper than adding rough.js and looks more "ours" than a generic sketch library.

4. **SVG `feTurbulence` + `feDisplacementMap` jitter filter on borders/dividers** — *Effort: medium. Payoff: medium-high, use sparingly.*
   Confirmed working technique (Codrops, Ben Gammon, Camillo Visini): define one shared `<filter>` in a hidden SVG def block, apply via `filter: url(#roughen)` to a bordered element. Starting values from Camillo Visini's demo: `feTurbulence type="turbulence" baseFrequency="0.02–0.03" numOctaves="2" seed="1"` piped into `feDisplacementMap scale="4-8"` (keep scale small — his demo used 20 for a dramatic effect; Brolly wants "hand-drawn," not "melting"). For a static hand-drawn edge, skip animation entirely — just apply the filter once to dividers, section-break rules, or the sidebar edge. Only animate (stepping `baseFrequency` every ~100ms per his technique) on a single hero/marketing moment, never on persistent chrome — respect `prefers-reduced-motion` and gate the animated variant behind it per Brolly's existing GSAP motion rule.

5. **Rough.js for charts and dividers** — *Effort: medium-high (new dependency, canvas or SVG render layer). Payoff: medium, narrow use case.*
   Add only if/when Brolly ships data charts that should look sketched rather than corporate (e.g. the cost/usage chart on the dashboard). `roughness: 0.8-1.2` and `bowing: 1-2` read as "intentionally hand-drawn" without becoming illegible; higher roughness breaks readability on axes/gridlines. Not worth adding just for borders or icons — items 1-3 already cover that ground with zero dependencies. Fill style `hachure` (the default) suits bar charts; avoid `zigzag`/`sunburst` for anything with real data in it.

6. **Paper-grain / texture overlay** — *Effort: low to add, high risk to taste. Payoff: low unless done very lightly.*
   A very-low-opacity (2-4%) noise/grain overlay on the page background can reinforce "paper" without hurting contrast, since Brolly's background is flat `#ffffff`. Not confirmed against a specific live reference in this research pass — **UNVERIFIED** as a named technique from a real product, treat as an optional final 5% polish, not a core technique. If added, it must sit *under* text layers and never reduce body-text contrast below AA (see §3).

7. **Wired-element-style control re-skinning (sketchy inputs/checkboxes)** — *Effort: high. Payoff: low for Brolly specifically.*
   Wired.js proves the concept works, but re-skinning shadcn's Radix-based form primitives with true sketchy (rough.js-rendered) borders is a large undertaking for controls that must stay pixel-precise and screen-reader-friendly. Recommend Brolly stop at "dashed border + offset shadow" (item 2) for form controls rather than going full sketchy-canvas on inputs — the usability risk (see §3, stroke-weight consistency and click-target clarity) outweighs the payoff.

---

## 3. Doodle UX rules — without hurting usability

| Rule | Why | Source |
|---|---|---|
| **Hand-drawn/script fonts are for display only, never body text.** Shantell Sans (or any hand font) stays on h1/h2, the wordmark, and big empty-state numbers; body copy stays in a clean sans (Nunito). | Hand-drawn character that gives display fonts their warmth is the same trait that reduces legibility at small sizes; script/handwriting fonts should be reserved for headlines and accents, paired with a neutral sans for anything that needs to read at body size. | [typematch.io Shantell Sans guide](https://typematch.io/font/gochi-hand/guide) (via search), general font-pairing consensus across multiple 2026 UI font-pairing guides |
| **Body text must clear WCAG AA contrast** (4.5:1 normal text, 3:1 large text/18px+ bold), never gray-on-gray or text over busy doodle texture. | This is a hard accessibility floor, not a style preference — decorative backgrounds and illustration are exempt, but any text a user must read is not. | WCAG 2.x AA contrast requirement, restated in multiple accessible-typography guides surfaced in search |
| **Never below ~20px for a hand-drawn display font**; keep a minimum 16px body size and ≥1.5× line-height. | Hand fonts lose their distinguishing strokes and become mush below a certain size; the same 1.5×-line-height / 16px-minimum rule that applies to any UI type applies here on top. | Brolly's own `docs/design.md` rule ("Shantell Sans... never below 20px"), corroborated by general accessible-typography line-height guidance from search results |
| **Consistent stroke weight across all doodle elements in one view.** Icons, dividers, and illustration linework should share one stroke width family (Brolly already standardizes on `strokeWidth="2"`–`3.5"` with `strokeLinecap="round"` across `icons.tsx`/`scenes.tsx`) — don't mix a 1px sketchy icon next to a 4px offset-shadow card border without a deliberate hierarchy reason. | Visual noise/monotony is the most common failure mode of doodle UI: too many different "hand-drawn" treatments fighting each other reads as sloppy rather than crafted. Untidy or inconsistent stroke weight is what separates "polished doodle" (Duolingo, Excalidraw) from "clip-art doodle." | Cross-referenced from Duolingo shape-language writeup and general doodle-UI critique in search results; reinforced by Brolly's own icon set already being internally consistent |
| **One loud thing per view.** Every screen should have exactly one element that visually wins (via size, color, or whitespace) — usually the coral CTA or the single hero illustration — with everything else quieter (ink linework, muted fills). | Prevents doodle enthusiasm from turning into visual chaos; matches Brolly's own written rule ("coral... the one loud thing per view") and the general visual-hierarchy principle that a screen needs one dominant focal element named and reinforced through contrast/size/whitespace. | [uxpilot.ai visual hierarchy](https://uxpilot.ai/blogs/visual-hierarchy) (via search); Brolly's own `docs/design.md` |
| **Motion should be linear/flipbook, not bouncy/spring.** Wobble lives in the *shapes*, not in easing curves — a hand-drawn card should not also spring-bounce when it enters. | Matches Brolly's existing GSAP rule (`ease: "none"`, no spring physics — "the doodle world moves like a flipbook") and the broader finding that decorative auto-animation reads as delightful once, tiresome the second time, annoying the third. | Brolly's own `docs/design.md` Motion section; [NN/g — Animation for Attention and Comprehension](https://www.nngroup.com/articles/animation-usability/) |
| **Respect `prefers-reduced-motion` on every doodle animation**, especially any feTurbulence-driven wobble or GSAP stagger — gate the tween, don't just slow it down. | Decorative animation (which a hand-drawn jitter effect is, by definition) must be optional; essential tasks must never depend on motion being visible. | [NN/g — Role of Animation and Motion in UX](https://www.nngroup.com/articles/animation-purpose-ux/); reinforced by multiple motion-accessibility articles in search results |
| **Doodle illustration and texture must never sit under interactive click/tap targets in a way that obscures their boundary.** A wobbly border is fine on a card; a wobbly border that makes a button's clickable edge ambiguous is not. | Sketchy rendering intentionally blurs "exact" edges — great for illustration, risky for anything users must click precisely, especially on touch/mobile hit targets. | Derived from Wired.js / Rough.js UI-control critique in search results; general touch-target-size usability heuristic (NN/g 10 heuristics — visibility of system status / user control) |
| **Keep the palette small and semantic**, don't let "playful" become "every color at once." Brolly's 8-token palette (paper/ink/coral/mint/butter/mist/fern + sage) should map 1:1 to meaning (coral = primary action, mint = success, butter = warning-lite) exactly like Duolingo confines its loud palette to 4 semantic colors. | A doodle aesthetic already adds visual energy through linework; stacking a large uncontrolled color palette on top compounds cognitive load instead of charm. | [Duolingo shape-language blog](https://blog.duolingo.com/shape-language-duolingos-art-style/) (via search); Brolly's own `docs/design.md` color table |

---

## 4. Apply-to-Brolly component cheatsheet

One doodle technique per component — enough to read as hand-crafted, not so much it hurts usability.

| Component | ONE doodle technique to apply | Notes |
|---|---|---|
| **Button** | `.doodle-shadow` hard offset shadow (no blur) + slightly asymmetric border-radius on the primary/coral CTA only. Secondary/ghost buttons stay flat — the CTA is the "one loud thing." | Keep the *click target itself* perfectly rectangular under the hood (Radix slot); only the visual radius wobbles, hitbox does not shrink. |
| **Input / textarea** | `.doodle-border` (2px dashed fern) on focus-visible state; solid border at rest so the field doesn't look "broken" before interaction. | Never dashed on the resting state of an input — dashed reads as "incomplete" to users at a glance, save it for an explicit focus/active signal. |
| **Chat box / message bubble** | Reuse a `scenes.tsx`-style hand-drawn speech-bubble outline (asymmetric radius, ink stroke) for the AI/system message only; user messages stay a plain filled pill. | Creates a visual distinction between "system voice" (doodle-framed) and "user voice" (plain) without needing two colors. |
| **Card** | Existing `.doodle-card` asymmetric border-radius + `.doodle-card-shadow`. Vary the radius string across 2-3 card types (stat card vs. content card) so the wobble doesn't feel copy-pasted. | This is already built — just needs to be applied consistently and with slight per-context variation. |
| **Dropdown / select menu** | Keep the panel itself clean/rectangular (Radix positioning needs precision) but give it `.doodle-shadow` and a single hand-drawn chevron icon from `icons.tsx` instead of a generic caret. | Don't wobble the dropdown panel edges — floating menus need crisp edges for scannability; the doodle signal lives in the icon and shadow only. |
| **Badge / tag** | Small asymmetric-radius pill + 1.5-2px ink border, filled with a semantic palette token (coral/mint/butter). No shadow (badges are small enough that a shadow reads as clutter). | This is the cheapest, safest place to push the wobble harder since badges carry no critical click precision. |
| **Tabs** | Underline indicator as a short hand-drawn squiggle (`feTurbulence`-jittered or a hand-authored wavy SVG path) instead of a straight Tailwind border-bottom. | Static only — no animated jitter on a persistent nav element; motion belongs to state transitions (tab switch slide), not idle chrome. |
| **Dialog / modal** | `.doodle-shadow-lg` + `.doodle-card` radius on the panel; overlay stays a flat scrim (no texture) so focus stays on the modal content. | Modal close (X) icon should come from `icons.tsx`, not a generic Radix/Phosphor X, to keep the hand-drawn signal even on system chrome. |
| **Table** | Keep table borders/rules clean and straight — no wobble on rules or gridlines. Doodle signal limited to a hand-drawn empty-state illustration when the table has zero rows, and fern dashed row dividers per `docs/design.md`'s existing chart rule. | Tables are the highest-precision-scanning component in the app; this is the one place to actively suppress the doodle effect on structure while keeping it on decoration (empty state only). |

---

## 5. Sources

- Rough.js — [roughjs.com](https://roughjs.com/), [GitHub rough-stuff/rough](https://github.com/rough-stuff/rough)
- Excalidraw — [excalidraw.com](https://excalidraw.com/) (Firecrawl-scraped, thin canvas-app markdown; supplemented by WebFetch summary and search)
- tldraw — [tldraw.com](https://tldraw.com/) (Firecrawl-scraped, thin canvas-app markdown; supplemented by WebFetch summary and search)
- Wired Elements — [wiredjs.com](https://wiredjs.com/)
- DoodleCSS — [chr15m.github.io/DoodleCSS](https://chr15m.github.io/DoodleCSS/), [GitHub chr15m/DoodleCSS](https://github.com/chr15m/DoodleCSS)
- Codrops, "SVG Filter Effects: Creating Texture with `<feTurbulence>`" — [tympanus.net](https://tympanus.net/codrops/2019/02/19/svg-filter-effects-creating-texture-with-feturbulence/) (Firecrawl-scraped in full, 36KB markdown)
- Ben Gammon, "Rough CSS borders with SVG filters" — [bengammon.co.uk](https://bengammon.co.uk/rough-css-borders-with-svg-filters/)
- Camillo Visini, "Simulating Hand-Drawn Motion with SVG Filters" — [camillovisini.com](https://camillovisini.com/coding/simulating-hand-drawn-motion-with-svg-filters)
- MDN, `<feTurbulence>` — [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/SVG/Reference/Element/feTurbulence)
- Duolingo shape language / brand — [blog.duolingo.com](https://blog.duolingo.com/shape-language-duolingos-art-style/), [design.duolingo.com](https://design.duolingo.com/)
- NN/g, "The Role of Animation and Motion in UX" — [nngroup.com](https://www.nngroup.com/articles/animation-purpose-ux/)
- NN/g, "Animation for Attention and Comprehension" — [nngroup.com](https://www.nngroup.com/articles/animation-usability/)
- NN/g, "10 Usability Heuristics for User Interface Design" — [nngroup.com](https://www.nngroup.com/articles/ten-usability-heuristics/)
- Streamline hand-drawn/freehand icon families — [home.streamlinehq.com](https://home.streamlinehq.com/) (**UNVERIFIED** icon-count claim, search-snippet only, not fetched)
- Visual hierarchy / "one loud thing" — [uxpilot.ai](https://uxpilot.ai/blogs/visual-hierarchy) (via search)
- Shantell Sans usage guidance — [typematch.io](https://typematch.io/font/gochi-hand/guide) (via search)
- Brolly's own design system — `/Users/shashi/Documents/projects/brolly/docs/design.md`, `/Users/shashi/Documents/projects/brolly/frontend/app/globals.css`, `/Users/shashi/Documents/projects/brolly/frontend/components/brand/icons.tsx`, `/Users/shashi/Documents/projects/brolly/frontend/components/brand/scenes.tsx`

Anything above not tagged **UNVERIFIED** was confirmed either by a direct WebFetch/Firecrawl page fetch or by a live WebSearch result returned in this session on 2026-07-12.
