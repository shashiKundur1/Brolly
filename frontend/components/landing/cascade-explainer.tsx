import { StorySplit } from "@/components/landing/story-split";

export function CascadeExplainer() {
  return (
    <StorySplit
      kicker="pay less by default"
      title="the cost cascade"
      band="bg-accent/30"
      panelTone="cell-butter"
      art={{
        src: "/brand/color/cascade-scene.svg",
        alt: "A doodle kid celebrating on the smallest of three coin stacks, umbrella in hand",
      }}
      artCover
      coverBox="110 130 964 624"
      cta={{ href: "/cascade", label: "See the cascade in action" }}
      flip
    >
      <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
        You define what a good-enough answer looks like, once. Brolly tries
        the cheapest model first and only climbs to a pricier tier when the
        answer misses your bar. You never manually pick a model again — and
        you stop paying frontier prices for calls a small model handles
        fine.
      </p>
      <p className="rounded-xl bg-card px-4 py-2 font-mono text-sm tabular-nums text-foreground doodle-card-shadow">
        tier 1 $0.25 → tier 2 $1.10 → tier 3 $3.00 /1M
      </p>
    </StorySplit>
  );
}
