import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative -mx-6 flex h-svh min-h-160 flex-col overflow-hidden bg-card px-6 pb-6 md:-mx-10 md:px-10 md:pb-36">
      <svg
        aria-hidden="true"
        viewBox="0 0 864 1184"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-x-0 top-0 bottom-24 w-full md:hidden"
      >
        <image href="/brand/color/hero-tall.svg" width="864" height="1184" />
      </svg>
      <div className="relative z-10 mx-auto flex w-full max-w-6xl flex-col items-center gap-5 pt-8 text-center md:flex-row md:items-end md:justify-between md:gap-10 md:pt-8">
        <h1
          className="text-6xl leading-none font-bold text-foreground sm:text-7xl lg:text-8xl"
          style={{
            textShadow:
              "-3px -3px 0 var(--card), 3px -3px 0 var(--card), -3px 3px 0 var(--card), 3px 3px 0 var(--card), 0 -4px 0 var(--card), 0 4px 0 var(--card), -4px 0 0 var(--card), 4px 0 0 var(--card), 6px 7px 0 var(--primary)",
          }}
        >
          <span className="block -rotate-2">model</span>
          <span className="block rotate-1 md:mt-1">insurance</span>
        </h1>
        <div className="flex flex-col items-center gap-3 md:items-end md:pb-3">
          <p className="doodle-card cell-butter rotate-1 px-4 py-2 font-body text-sm font-bold text-balance text-foreground sm:text-base md:-rotate-1 md:px-5 md:py-2.5 md:text-lg">
            an umbrella for your LLM apps — usage, cost, outages: covered.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 md:justify-end">
            <Button
              className="-rotate-1 rounded-full bg-foreground px-6 text-card hover:bg-foreground/90 md:h-11 md:px-7 md:text-base"
              render={<Link href="/dashboard">Open the dashboard</Link>}
            />
            <Button
              variant="outline"
              className="rotate-1 rounded-full px-6 md:h-11 md:px-7 md:text-base"
              render={<Link href="/failover">See the failover demo</Link>}
            />
          </div>
        </div>
      </div>
      <figure className="doodle-rough doodle-shadow-lg relative mx-auto mt-6 hidden w-full max-w-6xl flex-1 overflow-hidden border-2 border-foreground md:block">
        <svg
          role="img"
          aria-label="A big doodle kid catching a rain of gold coins in a huge coral umbrella while friends cheer on the hills"
          viewBox="0 40 1344 690"
          preserveAspectRatio="xMidYMid slice"
          className="absolute inset-0 h-full w-full"
        >
          <image href="/brand/color/hero-panel.svg" width="1344" height="768" />
        </svg>
      </figure>
    </section>
  );
}
