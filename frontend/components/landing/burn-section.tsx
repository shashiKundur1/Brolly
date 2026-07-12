import { StorySplit } from "@/components/landing/story-split";

export function BurnSection() {
  return (
    <StorySplit
      kicker="see your burn"
      title="every call, every cost, one screen"
      band="bg-secondary/30"
      panelTone="cell-mint"
      art={{
        src: "/brand/color/burn-scene.svg",
        alt: "A doodle kid pointing at a wall dashboard where coins trend up a rising bar chart",
      }}
      artCover
      coverBox="90 110 1004 664"
      cta={{ href: "/dashboard", label: "Watch it live" }}
    >
      <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
        The dashboard streams every request as it happens: which model
        answered, how many tokens it burned, and what it cost in real
        dollars. No end-of-month surprise, no digging through provider
        consoles.
      </p>
      <p className="rounded-xl bg-card px-4 py-2 font-mono text-sm tabular-nums text-foreground doodle-card-shadow">
        gpt-5-mini · 1,204 tok · $0.0042
      </p>
    </StorySplit>
  );
}
