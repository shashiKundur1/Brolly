import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative -mx-6 h-svh min-h-160 overflow-hidden bg-secondary/30 md:-mx-10">
      <svg
        aria-hidden="true"
        viewBox="0 0 1344 768"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 hidden h-full w-full md:block"
      >
        <image href="/brand/color/hero-wide.svg" width="1344" height="768" />
      </svg>
      <svg
        aria-hidden="true"
        viewBox="0 0 864 1184"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 top-0 bottom-24 w-full md:hidden"
      >
        <image href="/brand/color/hero-tall.svg" width="864" height="1184" />
      </svg>
      <img
        src="/brand/color/sticker-stars.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-40 right-8 hidden size-24 rotate-12 lg:block"
        width={96}
        height={96}
      />
      <div className="relative z-10 flex h-full flex-col items-center px-6 pt-8 text-center sm:pt-10 md:pt-12">
        <div className="doodle-card cell-paper -rotate-1 px-7 py-5 sm:px-10 sm:py-6 md:px-14 md:py-7">
          <h1 className="text-5xl leading-none font-semibold text-balance text-foreground sm:text-6xl md:text-7xl lg:text-8xl">
            model insurance
          </h1>
          <p className="mt-3 font-body text-lg font-bold text-balance text-foreground sm:text-xl md:text-2xl">
            an umbrella for your LLM apps — usage, cost, and outages, covered.
          </p>
        </div>
        <div className="mt-6 flex flex-wrap items-center justify-center gap-4 md:mt-8">
          <Button
            size="lg"
            className="rounded-full bg-foreground px-8 text-base text-card hover:bg-foreground/90"
            render={<Link href="/dashboard">Open the dashboard</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base"
            render={<Link href="/failover">See the failover demo</Link>}
          />
        </div>
      </div>
    </section>
  );
}
