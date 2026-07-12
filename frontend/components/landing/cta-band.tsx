import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function CtaBand() {
  return (
    <section className="-mx-6 bg-primary px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.05fr_0.95fr] md:gap-16">
        <div className="flex flex-col items-start gap-5 text-left">
          <h2 className="font-display text-5xl leading-tight text-balance text-foreground md:text-6xl">
            point your tools here
          </h2>
          <p className="max-w-prose text-lg text-foreground text-balance md:text-xl">
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
        <div className="mx-auto w-full max-w-sm rounded-3xl bg-card p-6 md:mx-0 md:justify-self-end">
          <img
            src="/brand/color/scene-cta-color.svg"
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
