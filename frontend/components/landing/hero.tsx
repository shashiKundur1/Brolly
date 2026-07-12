import Link from "next/link";
import { Button } from "@/components/ui/button";
import { WavyDivider } from "@/components/landing/wavy-divider";

export function LandingHero() {
  return (
    <div className="relative -mx-6 md:-mx-10">
      <section className="relative overflow-hidden bg-primary px-6 pt-16 pb-28 md:px-10 md:pt-24 md:pb-40">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
          <div className="flex flex-col items-start gap-6 text-left">
            <h1 className="font-display text-7xl leading-[0.92] text-balance text-foreground sm:text-8xl md:text-9xl">
              model
              <br />
              insurance
            </h1>
            <p className="font-display text-3xl text-balance text-foreground md:text-4xl">
              an umbrella for your LLM bills&hellip;kinda.
            </p>
            <p className="max-w-prose rounded-2xl bg-card px-5 py-4 text-lg text-foreground text-balance md:text-xl">
              Brolly sits in front of your model calls: it watches every
              request, routes each one to the cheapest model that still
              passes your benchmark, and hot-swaps providers mid-session the
              moment one goes down. Point your SDK at it and forget it exists
              — until it saves you.
            </p>
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 text-base"
                render={<Link href="/dashboard">Open the dashboard</Link>}
              />
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base"
                render={<Link href="/cascade">See the cascade</Link>}
              />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-card p-5 sm:max-w-md md:max-w-none md:justify-self-end">
            <img
              src="/brand/color/scene-hero-color.svg"
              alt=""
              width={1024}
              height={1024}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>
      <WavyDivider tone="primary" />
    </div>
  );
}
