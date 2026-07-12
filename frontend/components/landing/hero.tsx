import Link from "next/link";
import { Button } from "@/components/ui/button";

export function LandingHero() {
  return (
    <section className="relative -mx-6 -mt-px h-svh min-h-[640px] w-full overflow-hidden bg-secondary md:-mx-10">
      <svg
        aria-hidden="true"
        viewBox="68 312 888 410"
        preserveAspectRatio="xMidYMax slice"
        className="absolute inset-0 h-full w-full"
      >
        <image
          href="/brand/color/hero-world.svg"
          x="0"
          y="0"
          width="1024"
          height="1024"
        />
      </svg>
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/35 via-transparent to-black/15" />
      <div className="relative z-10 flex h-full w-full flex-col items-center justify-start px-6 pt-[10%] text-center sm:pt-[8%] md:pt-[7%]">
        <h1
          className="font-display text-6xl leading-[0.95] text-balance text-foreground sm:text-7xl md:text-8xl lg:text-[7.5rem]"
          style={{
            textShadow:
              "0 3px 0 #fff, 0 -3px 0 #fff, 3px 0 0 #fff, -3px 0 0 #fff, 3px 3px 0 #fff, -3px 3px 0 #fff, 3px -3px 0 #fff, -3px -3px 0 #fff, 0 6px 18px rgba(47,62,54,0.25)",
          }}
        >
          model
          <br />
          insurance
        </h1>
        <p className="mt-5 max-w-2xl rounded-full bg-card/90 px-6 py-2.5 font-display text-xl text-balance text-foreground shadow-[3px_4px_0_0_var(--foreground)] sm:text-2xl md:text-3xl">
          an umbrella for your LLM bills&hellip;kinda.
        </p>
        <div className="mt-7 flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-8 text-base"
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
