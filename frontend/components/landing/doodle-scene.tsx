import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function DoodleScene() {
  return (
    <section className="w-full bg-secondary/30 py-16 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 px-6 md:grid-cols-[1.05fr_0.95fr] md:gap-16 md:px-10">
        <div className="doodle-rough relative flex items-center justify-center overflow-hidden bg-card p-4 md:order-1">
          <img
            src="/brand/color/sticker-stars.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 -left-4 size-16 md:size-20"
            width={80}
            height={80}
          />
          <img
            src="/brand/color/scene-split-color.svg"
            alt="Dashboard scene showing spend and requests split across models"
            width={1024}
            height={1024}
            className="block h-auto w-full max-w-2xl"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-5 text-left md:order-2">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            see your burn
          </p>
          <h2 className="font-display text-5xl leading-tight font-semibold text-balance md:text-6xl">
            every call, every cost, one screen
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            The dashboard streams every request the moment it happens: which
            model answered, how many tokens it burned, and what it cost you
            in real dollars. No end-of-month invoice surprise, no digging
            through provider consoles. You watch the number climb live, and
            you know exactly why it climbed.
          </p>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            Filter by model, by day, by app. Spot the one workflow that is
            quietly eating your budget before it eats your whole month.
          </p>
        </div>
      </ScrollReveal>
    </section>
  );
}
