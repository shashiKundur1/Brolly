import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="-mx-6 bg-primary px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="flex flex-col items-start justify-center gap-5 text-left">
          <h2 className="font-display text-5xl leading-tight font-semibold text-balance text-primary-foreground md:text-6xl">
            point your tools here
          </h2>
          <p className="max-w-prose text-lg text-primary-foreground text-balance md:text-xl">
            One base URL. The cascade and the failover start covering you on
            your very next request.
          </p>
          <Button
            size="lg"
            variant="secondary"
            className="rounded-full px-8 text-base"
            render={<Link href="/dashboard">Open the dashboard</Link>}
          />
        </div>
        <div className="doodle-rough relative flex items-center justify-center overflow-hidden bg-card p-4 md:order-2">
          <img
            src="/brand/color/sticker-stars.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -top-4 -right-4 size-16 md:size-20"
            width={80}
            height={80}
          />
          <img
            src="/brand/color/scene-cta-color.svg"
            alt="Model insurance covering your last mile, come rain or shine"
            width={1024}
            height={1024}
            className="block h-auto w-full max-w-2xl"
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
