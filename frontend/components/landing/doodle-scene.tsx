import { ScrollReveal } from "@/components/landing/scroll-reveal";

export function DoodleScene() {
  return (
    <section className="w-full py-16 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-secondary/30 p-6 md:mx-0">
          <img
            src="/brand/color/scene-split-color.svg"
            alt=""
            width={1024}
            height={1024}
            className="block h-auto w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-5 text-left">
          <p className="flex items-center gap-2 font-display text-2xl text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            see your burn
          </p>
          <h2 className="font-display text-5xl leading-tight text-balance md:text-6xl">
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
