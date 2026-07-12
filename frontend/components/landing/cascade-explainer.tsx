import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function CascadeExplainer() {
  return (
    <section className="-mx-6 bg-accent/30 px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="flex flex-col items-start gap-5 text-left md:order-1">
          <p className="flex items-center gap-2 font-display text-2xl text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            pay less by default
          </p>
          <h2 className="font-display text-5xl leading-tight text-balance md:text-6xl">
            the cost cascade
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            You define a benchmark once: the kind of answer that counts as
            good enough for this call. Brolly tries the cheapest model that
            clears it first. If that model fails the bar, it cascades up to
            the next tier automatically, and the next, until one passes.
          </p>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            You never manually pick a model again. You just stop overpaying
            for calls that a smaller model could have handled just fine.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base"
            render={<Link href="/cascade">See the cascade in action</Link>}
          />
        </div>
        <div className="mx-auto w-full max-w-md rounded-3xl bg-card p-6 md:order-2 md:mx-0 md:justify-self-end">
          <img
            src="/brand/color/coins-color.svg"
            alt=""
            width={1024}
            height={1024}
            className="block h-auto w-full"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
