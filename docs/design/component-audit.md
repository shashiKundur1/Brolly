# Brolly component audit — screenshot-grounded

Purpose: before reworking the UI to look genuinely hand-drawn, establish exactly what already
looks hand-drawn vs. what still reads as generic/stock-shadcn, component by component and page
by page. Audit only — no code was changed.

Method: live app at `localhost:3000` (backend `localhost:4000`), captured with an isolated
Playwright browser context at 1440x900 (desktop) and 375x812 (mobile). Screenshots live in
`frontend/.audit-screenshots/` (gitignored-adjacent scratch dir, referenced by filename below).
Source for every component claim below was cross-checked against
`frontend/components/ui/*.tsx`, `frontend/app/globals.css`, and `frontend/components/brand/icons.tsx`.

Screenshots referenced (all under `frontend/.audit-screenshots/`):
`gallery-preview-1440x900.png`, `gallery-preview-375x812.png`,
`gallery-preview-select-open-1440x900.png`, `gallery-preview-button-hover-1440x900.png`,
`gallery-preview-button-focus-1440x900.png`, `gallery-preview-dialog-open-1440x900.png`,
`landing-1440x900.png`, `landing-375x812.png`, `dashboard-1440x900.png`, `dashboard-375x812.png`,
`cascade-1440x900.png`, `cascade-375x812.png`, `failover-1440x900.png`, `failover-375x812.png`.

All 5 pages loaded cleanly at both viewports with `networkidle` — no 500s, no failed loads.
One capture caveat: the "select-open" screenshot did not visibly render the popup open (likely
closed before the screenshot fired); the Select's open/hover state was instead verified from
the `gallery-preview-button-hover-1440x900.png` frame, which incidentally caught the Select
trigger's focus-ring state (a plain coral ring, see verdict below), and from source in
`components/ui/select.tsx`.

A floating dark circular "N" badge appears in the bottom-left of several captures — that's a
third-party devtool/extension overlay, not part of the Brolly app. Ignore it in all screenshots.

---

## Per-component verdict table

| Component | Hand-drawn or generic | What's wrong (or what's already working) | Verdict |
|---|---|---|---|
| **Button** | Mostly hand-drawn | Has a genuine wobble-path SVG outline (`WobbleOutline`, hand-plotted bezier in `button.tsx`) plus a `doodle-press` offset hard-shadow that shifts on hover/active. This is real custom work, not shadcn default. But: `ghost` and `link` variants opt out of the wobble/press treatment entirely and fall back to plain `rounded-xl` + `hover:bg-muted` — flat and generic next to their siblings (visible in the "ghost" row of `gallery-preview-1440x900.png`, which is indistinguishable from any shadcn ghost button). Disabled state also just dims to 60% opacity — no hand-drawn "greyed out" treatment. | **TWEAK** — bring ghost/link in line with the wobble family, or give them an intentional distinct-but-still-doodle treatment. |
| **Input** | Generic | Plain `rounded-xl`, solid 2px border, standard `focus-visible:ring-3` blue-ish ring — textbook shadcn input. No wobble, no organic shape, no hand-drawn corner irregularity. Sits right next to the wobble Button and looks flat by comparison in `gallery-preview-1440x900.png`'s "Inputs" section. Same shape used verbatim in the chat compose field (`failover-1440x900.png`) and cascade "ask the cascade" field. | **REDESIGN** — highest-visibility generic component; every page has at least one. |
| **Chat compose box (`ChatPanel`)** | Generic (not a real textarea) | Not actually a multi-line/chat textarea — it's a single-line `<Input>` (`components/failover/chat-panel.tsx:128`) with a generic `send` button. Message bubbles use plain `rounded-xl` with solid 2px borders — no doodle-card blob shape, no wobble. Header icon (`ChatCircleIcon`) and send icon (`PaperPlaneTiltIcon`) are Phosphor duotone icons, clashing with the mono-line doodle icon language everywhere else. Visible in `failover-1440x900.png`. | **REDESIGN** — most template-y surface in the app; reads like a generic chat-widget component, not a Brolly-native one. |
| **Card** | Hand-drawn | Genuinely custom: `doodle-card` uses an asymmetric elliptical `border-radius` (`255px 15px 225px 15px / 15px 225px 15px 255px`) to fake a hand-drawn "not quite rectangular" blob, plus an offset 1px hard shadow. Dashed footer border (`border-t border-dashed`) reinforces the sketch feel. Clearly visible warped corners on every card in `gallery-preview-1440x900.png` and the "receipts" cards on the landing page. `plain`/nested cards correctly step down to a flatter `doodle-card-soft` to avoid double-blob nesting. | **KEEP** — best-executed component in the system; a model for the others. |
| **Select (trigger)** | Half hand-drawn | Trigger button uses `doodle-press` (hard offset shadow, hover/active shift) — good. But the popup content (`SelectContent`) is plain `rounded-xl` with a solid 2px border and only `doodle-shadow` (a flat drop shadow, not the offset/press style) — reads as a standard dropdown menu once open. Item rows have zero doodle treatment (`rounded-lg`, `focus:bg-secondary`) — generic listbox styling. Chevron/check icons are Phosphor (`CaretDownIcon`, `CheckIcon`), not doodle icons. | **TWEAK** — trigger is fine, popup and items need the doodle pass. |
| **Badge** | Generic | Plain `rounded-full` pill with a solid 2px border — the single most "generic SaaS UI kit" shape in the whole system (visible on every status chip: "Active", "Covered", "At risk", "Lapsed" in `dashboard-1440x900.png` and `gallery-preview-1440x900.png`). No wobble, no hand-drawn irregularity, no texture. Six variants exist but they only vary fill/border color, never shape. | **REDESIGN** — used constantly (status chips, model tags) so its genericness is high-visibility; also the easiest to fix (needs a hand-drawn pill/blob shape, maybe borrowing the Card's asymmetric border-radius trick at smaller scale). |
| **Tabs** | Half hand-drawn | Active tab gets `doodle-press-sm` (small offset shadow) — good, visible in `gallery-preview-1440x900.png` "Overview" tab. But the `TabsList` container is a plain `rounded-xl` solid-border pill-bar, and inactive tabs are flat text with a plain `hover:bg-secondary/60` — no hand-drawn signal until you're already active. The "line" variant is functionally identical to "default" in this build (no underline rendering visible), which is confusing. | **TWEAK** — active state is fine, inactive/list-container and the "line" variant need work. |
| **Switch** | Fully generic | Zero doodle treatment. Standard `rounded-full` track + `rounded-full` thumb, solid 2px border, linear slide transition — could be lifted from any shadcn/Radix demo unchanged. Visible in `gallery-preview-1440x900.png` "Switch" section: perfectly circular thumb, perfectly straight track. The one binary toggle used on the Cascade page ("enabled") is the most generic-looking control on that entire screen (`cascade-1440x900.png`). | **REDESIGN** — no hand-drawn work has touched this component at all; stands out precisely because everything around it (buttons, cards) doesn't look like this. |
| **Dialog** | Mostly generic despite trying | Popup shell gets `doodle-shadow-lg` (offset hard shadow) and `rounded-2xl`, which helps, but the shape is still a plain rectangle with uniform corner radius — no blob/organic border like Card gets. Footer has a flat `bg-muted/50` band with a plain dashed top border. Close button is a small ghost icon button with a Phosphor `XIcon`. Overlay is a standard semi-transparent backdrop-blur scrim. Screenshot `gallery-preview-dialog-open-1440x900.png` shows a clean but forgettable modal — nothing here signals "doodle app" beyond the shadow. | **TWEAK** — give the popup the same organic-corner treatment Card already has; it's a very close relative and currently looks like a different, less finished product. |
| **Tooltip** | Fully generic | Plain `rounded-lg`, solid `bg-foreground` fill, small drop arrow — completely standard tooltip chrome, no relationship to the doodle system at all (no border, no dash, no wobble). Barely visible in static screenshots since it's hover-triggered, but confirmed from `components/ui/tooltip.tsx` source. | **TWEAK** — low page-time visibility lowers priority, but it's a one-off from the rest of the kit and should at least pick up the ink/coral palette and a hand-drawn arrow. |
| **Table** | Half hand-drawn, mobile-broken | Desktop treatment is decent: dashed header/footer rules (`border-b-2 border-dashed`) tie it to the doodle-card and separator language, and it reads fine in `gallery-preview-1440x900.png` and the Dashboard's "the ledger" list. But cell/row chrome (padding, hover state `hover:bg-secondary/30`) is plain, and on mobile it does not reflow — `dashboard-375x812.png` shows model names truncated to "cla…" / "claude-haiku-…" and the gallery table's "Status" header clipped to "Sta" with no visible scroll affordance. | **TWEAK** (desktop) / **REDESIGN** (mobile behavior) — needs a small-screen card/list fallback, not just an overflow scroll. |
| **Skeleton** | Hand-drawn | Dashed border (`border-2 border-dashed border-border`) on top of the pulse animation ties it into the sketch language consistently — visible in `gallery-preview-1440x900.png`. One of the more coherent pieces of the kit despite being a "boring" utility component. | **KEEP**. |
| **Separator** | Hand-drawn | Consistently dashed (`border-t-2 border-dashed` / `border-l-2 border-dashed`) both horizontal and vertical — matches Card footer and Table rules. Used pervasively and correctly across the gallery page and real pages. | **KEEP**. |
| **Doodle icon set (`icons.tsx`)** | Genuinely hand-drawn | 17 icons (Gauge, Coins, Umbrella, RainCloud, Lightning, Skull, Check, Cross, ArrowRight, Spark, Sun, Storm, Wallet, Clock, Ladder, Wrench) plus `DoodleCircle` wrapper, all hand-plotted wobbly-line SVGs (irregular polyline/polygon points, not geometric primitives) at `viewBox 0 0 24 24`, mono-weight `strokeWidth 2`. This is the best asset in the codebase and is barely used (see icon-adoption gap below). | **KEEP the icons; REDESIGN their adoption.** |

---

## Per-page notes

### Landing (`/`) — `landing-1440x900.png`, `landing-375x812.png`
Strongest page in the app and the clearest evidence the "hand-drawn" direction is achievable:
wavy hand-drawn section-divider SVGs between every section, a full illustrated hero scene
(rolling hills, rain clouds, a lone stick figure under an umbrella), wobble-outline CTA buttons,
dashed-border "receipts" quote cards, and a hand-drawn umbrella logo mark. The nav bar itself is
plain text links (no doodle treatment, no hover underline shown) and is the flattest element on
the page — everything below it commits, the header doesn't. Mobile reflows cleanly to a single
column with no truncation or overflow issues; this page is mobile-ready.

### Dashboard (`/dashboard`) — `dashboard-1440x900.png`, `dashboard-375x812.png`
The weather-station metaphor (cloud icons scaled by spend, sun for the cheapest untouched
model, umbrella centered in the hill scene) is a genuinely distinctive, on-brand visual and is
the single best "why this app looks different" screenshot in the whole product. The two side
cards ("the ledger", "just happened") correctly use `doodle-card` and read well. Weak spots: the
budget summary bar at the top is a plain rounded-rect with no doodle treatment (flat next to the
scene below it), and the "priciest" badge and status pills are the generic pill Badge flagged
above. On mobile, the ledger table truncates model names ("cla…") instead of reflowing — the one
real functional/legibility bug found in this audit, not just a style note.

### Cascade (`/cascade`) — `cascade-1440x900.png`, `cascade-375x812.png`
Functionally dense (ladder of 9 models, benchmark runner, live "try it" box) but visually the
flattest of the four real pages — mostly dashed-border plain rectangles with numbered circle
badges, the fully-generic Switch for "enabled", and a plain-outline `max steps` select. No
illustration, no wavy dividers, no scene — it reads like an admin/settings screen dropped into a
doodle app rather than a page that was designed doodle-first. On mobile the model-name ladder
truncates ("anthropic/clau…", "google/gemini-…") same as the dashboard table issue.

### Failover (`/failover`) — `failover-1440x900.png`, `failover-375x812.png`
Good bones (doodle-card panels, wobble "kill it" button with a Skull doodle icon, wavy card
edges) but a large amount of dead whitespace below both panels at desktop width (roughly half
the viewport height is empty in `failover-1440x900.png`) — the layout doesn't fill or anchor to
the page the way Landing/Dashboard do. The chat panel itself is the weakest single surface
identified in this audit (see Chat compose box row above) — generic single-line input, generic
Phosphor icons, plain message bubbles. "the wire" panel is essentially an empty state
placeholder at rest, so its real visual quality can't be judged from a static screenshot — worth
a follow-up capture once a failover swap is triggered live.

---

## Icon adoption gap

The in-house doodle icon set (`frontend/components/brand/icons.tsx`, 17 icons + `DoodleCircle`)
is well made — hand-plotted, consistent 2px mono stroke, genuinely wobbly — but it is used
almost nowhere outside the gallery page that exists to showcase it.

Instead, **`@phosphor-icons/react` (duotone weight) is imported in 17 component files**, i.e.
it is the de facto default icon library for real product UI:

```
app/failover/page.tsx
components/ui/select.tsx          (CaretDownIcon, CheckIcon, CaretUpIcon)
components/ui/dialog.tsx          (XIcon)
components/landing/hero.tsx
components/landing/landing-footer.tsx
components/landing/feature-trio.tsx
components/usage/weather-station-error-state.tsx
components/usage/forecast-strip.tsx
components/usage/ledger-rail.tsx
components/cascade/benchmark-panel.tsx
components/cascade/try-it-box.tsx
components/cascade/benchmark-detail-dialog.tsx
components/cascade/attempt-step.tsx
components/failover/chat-panel.tsx   (ChatCircleIcon, PaperPlaneTiltIcon, CircleNotchIcon)
components/failover/empty-state.tsx
components/failover/the-wire.tsx
components/failover/kill-switch.tsx  (mixed: SkullDoodle used for the button, but wrapped by phosphor UI elsewhere)
components/failover/behavior-card.tsx
```

No `lucide-react` usage was found anywhere in the codebase — that's a genuine positive (the team
already made a deliberate choice against the single most generic icon set in the shadcn
ecosystem) — but swapping to Phosphor duotone instead of finishing the doodle set is functionally
the same mistake: a polished, mainstream icon library with rounded duotone fills sitting next to
hand-drawn mono-line icons reads as two different products bolted together. This is most jarring
in `select.tsx` (doodle-pressed trigger, Phosphor caret inside it) and `chat-panel.tsx` (doodle
Skull icon on the kill-switch button one page over, Phosphor chat/paper-plane icons in the panel
itself, both on `/failover`).

**Fix direction:** either (a) expand `icons.tsx` to cover the ~10-15 additional glyphs Phosphor
is currently filling (caret/chevron, X/close, spinner/loading, paper-plane/send, warning
triangle) so every UI-chrome icon is doodle-native, or (b) if full coverage isn't feasible soon,
at minimum stop using duotone weight — switch Phosphor calls to `weight="regular"` or
`"thin"` mono-line so they visually match stroke width and don't fill with a second color.

---

## Top 8 highest-impact changes, ranked

1. **Redesign the Input component.** It's the single most generic-looking primitive and appears
   on every real page (chat compose, cascade benchmark box, gallery). Fixing one component fixes
   the app's most repeated flat surface. Give it the wobble/doodle-press treatment Button and
   Card already have — right now it's the loudest "this is shadcn" tell in every screenshot.

2. **Rebuild the chat compose surface (`ChatPanel`) as a first-class doodle component**, not a
   generic `<Input>` + `<Button>` + Phosphor icons. This is the emotional centerpiece of
   `/failover` and currently looks the least like the rest of the product.

3. **Redesign Badge.** Currently a plain solid-border pill — the most repeated "generic SaaS UI
   kit" shape in the system (every status chip on Dashboard, Cascade, and the gallery). High
   repetition means high leverage: fixing the shape once fixes dozens of on-screen instances.

4. **Redesign Switch.** Zero doodle treatment at all — completely stock. It's rare (one instance
   found, on `/cascade`) but stands out badly for being the one control untouched by the design
   system everything else follows.

5. **Close the icon gap: replace Phosphor duotone with doodle-native icons for UI chrome**
   (dropdown carets, close/X, send, spinner, warning). 17 files currently import Phosphor;
   this is the most systemic mismatch in the codebase even though no single instance is as
   visually loud as the Input or Badge problems.

6. **Give Select's popup and item rows the same doodle-press/blob treatment as its trigger.**
   Right now opening the dropdown drops you from a hand-drawn button into a stock listbox —
   confirmed from `select.tsx` (`SelectContent` = plain `rounded-xl` solid border,
   `SelectItem` = plain `rounded-lg` hover state).

7. **Fix mobile table/list truncation on Dashboard and Cascade** (`dashboard-375x812.png`,
   `cascade-375x812.png`). Model names truncate to unreadable fragments ("cla…",
   "anthropic/clau…") instead of reflowing to a stacked/card layout — this is a legibility bug,
   not just a style gap, and it's the one finding in this audit that blocks real usage rather
   than just looking generic.

8. **Give Dialog the organic-corner treatment Card already has**, and fill the dead whitespace
   under the two panels on `/failover` at desktop width. Both are smaller than #1-3 but cheap
   relative to their visibility: Dialog is a near-identical sibling of Card and currently looks
   like a different, less-finished component; the Failover page layout gap is visible on every
   visit to that route at desktop width.

---

## What's already good (don't touch)

- **Card** — the organic asymmetric-border-radius trick plus offset shadow is the best executed
  piece of the system and should be the reference for fixing Dialog, Select popup, Badge.
- **Button (default/outline/secondary/destructive variants)** — wobble-path SVG outline is a
  genuinely clever, cheap-to-render hand-drawn effect. `ghost`/`link` variants need to join it
  (see #1 in "half-hand-drawn" list above) but the core mechanism doesn't need reinventing.
- **The doodle icon set itself** — well drawn, consistent, just needs wider adoption (see icon
  gap section) rather than a redesign.
- **Skeleton, Separator, Table's dashed rules** — small, consistent, correctly tied into the
  "dashed border = sketch line" visual language used across Card footers too.
- **Landing and Dashboard page illustrations** (hills, weather scene, wavy dividers, stick
  figure) — proof the direction works at the page level; the component layer needs to catch up
  to what the page layer already does.
