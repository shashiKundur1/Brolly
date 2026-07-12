import Link from "next/link";
import { Button } from "@/components/ui/button";
import { RainCloudDoodle, SparkDoodle } from "@/components/brand/icons";

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
      <SparkDoodle className="absolute top-56 left-16 hidden size-10 -rotate-12 text-primary md:block" />
      <SparkDoodle className="absolute top-80 left-36 hidden size-6 rotate-12 text-foreground md:block" />
      <RainCloudDoodle className="absolute top-80 right-48 hidden size-14 rotate-3 text-foreground md:block" />
      <img
        src="/brand/color/sticker-stars.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute top-40 right-8 hidden size-24 rotate-12 lg:block"
        width={96}
        height={96}
      />
      <div className="relative z-10 flex h-full flex-col items-center px-6 pt-10 text-center sm:pt-12 md:pt-14">
        <h1 className="-rotate-2 text-6xl leading-none font-bold text-balance text-foreground sm:text-7xl md:text-8xl lg:text-9xl">
          model insurance
        </h1>
        <svg
          aria-hidden="true"
          viewBox="0 0 320 18"
          className="-mt-1 h-4 w-56 -rotate-2 overflow-visible text-primary sm:w-72 md:mt-0 md:h-5 md:w-112"
        >
          <path
            d="M4 12 C 44 4 84 16 124 9 C 164 2 204 15 244 8 C 274 3 300 10 316 6"
            fill="none"
            stroke="currentColor"
            strokeWidth={7}
            strokeLinecap="round"
            style={{ filter: "url(#doodle-rough-filter)" }}
          />
        </svg>
        <p className="doodle-card cell-butter mt-6 rotate-1 px-6 py-3 font-body text-lg font-bold text-balance text-foreground sm:text-xl md:mt-8 md:text-2xl">
          an umbrella for your LLM apps — usage, cost, outages: covered.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4 md:mt-9">
          <Button
            size="lg"
            className="-rotate-1 rounded-full bg-foreground px-8 text-base text-card hover:bg-foreground/90"
            render={<Link href="/dashboard">Open the dashboard</Link>}
          />
          <Button
            size="lg"
            variant="outline"
            className="rotate-1 rounded-full px-8 text-base"
            render={<Link href="/failover">See the failover demo</Link>}
          />
        </div>
      </div>
    </section>
  );
}
