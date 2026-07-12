# Design

Full brand book: `docs/design.md` (palette table, typography, motion spec, layout laws). This file captures the component-level visual system.

## Theme

Soft-pastel doodle. Sage-mist page (#e8efe6), paper surfaces (#f7f9f4), deep-pine ink (#2f3e36), coral primary (#e8756a), mint (#bcd9cf), butter (#f2d98c), fern borders (#9db5a6). Tokens live in `frontend/app/globals.css` as shadcn CSS variables; components never hardcode hex.

## Typography

Shantell Sans (display: h1/h2, dialog titles, empty states, ≥20px only). Nunito (body, controls, labels). Mono for numbers, costs, and model ids.

## Component vocabulary — "sticker press"

The border style is the affordance: **dashed = passive container, solid ink = pressable**.

- **Press mechanic** (`.doodle-press`): interactive controls sit on a solid ink offset shadow (3px 3px 0). Hover lifts (-1px translate, 4px shadow). Active presses flat (2px translate, no shadow). 150ms, none under reduced motion.
- **Buttons**: big (h-11 default, h-12 lg), border-2 ink, rounded-xl, font-semibold. Coral default, mint secondary, paper outline. Links underline `decoration-wavy`.
- **Inputs/Selects**: h-11, border-2 solid ink on paper, coral focus ring. Select dropdown: paper popover, border-2 ink, offset shadow, mint item hover, coral check.
- **Cards**: paper, border-2 fern, rounded-2xl, 2px fern offset shadow. Important cards add `.doodle-border` (dashed) + `.doodle-shadow`.
- **Badges**: sticker chips — border-2 ink, rounded-full, coral/mint/butter fills.
- **Tabs**: bordered paper pill rail; active tab coral with mini press shadow.
- **Switch**: h-7 w-12, border-2 ink, coral when on, bordered paper thumb.
- **Dialog**: paper, border-2 ink, 6px offset shadow, ink/40 overlay, Shantell Sans title.
- **Tooltip**: inverse — ink bg, paper text.
- **Table**: dashed border-2 header rule, mint/30 row hover, mono numerics right-aligned.
- **Skeleton**: mist fill, dashed fern border, pulse.

## Motion

Linear/flipbook (see docs/design.md). Product surfaces: 150–250ms state transitions only. Landing: 0.6s sage wipe, staggered fade-ups, drifting clouds.

## Layout

100% full-width pages (`w-full px-6 md:px-10`), never `max-w-*` page constraints. gap-6/8 rhythm, items-center on flex rows, equal-height cards, generous vertical air (`py-8+`).
