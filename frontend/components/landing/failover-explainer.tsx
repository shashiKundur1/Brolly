import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function FailoverExplainer() {
  return (
    <section className="w-full bg-secondary/30 py-16 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-stretch gap-10 px-6 md:grid-cols-[0.95fr_1.05fr] md:gap-16 md:px-10">
        <div className="doodle-rough relative flex items-center justify-center overflow-hidden bg-card p-4 md:order-1">
          <img
            src="/brand/color/sticker-stars.svg"
            alt=""
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-4 -left-4 size-16 md:size-20"
            width={80}
            height={80}
          />
          <img
            src="/brand/color/rain-color.svg"
            alt="A model provider going down in the rain while Brolly hot-swaps to a healthy one"
            width={1024}
            height={1024}
            className="block h-auto w-full max-w-2xl"
          />
        </div>
        <div className="flex flex-col items-start justify-center gap-5 text-left md:order-2">
          <p className="flex items-center gap-2 font-display text-2xl font-semibold text-foreground">
            <span className="size-2.5 rounded-full bg-primary" aria-hidden="true" />
            survive the outage
          </p>
          <h2 className="font-display text-5xl leading-tight font-semibold text-balance md:text-6xl">
            mid-session failover
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            A provider goes down mid-conversation, mid-agent-run, mid-anything.
            Brolly notices before your user does, hot-swaps to a healthy
            model, and carries the context across so the conversation keeps
            going like nothing happened.
          </p>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            No dropped session, no &quot;please try again later,&quot; no 3am
            page. One provider having a bad day stops being your incident.
          </p>
          <Button
            size="lg"
            variant="outline"
            className="rounded-full px-8 text-base"
            render={<Link href="/failover">See failover in action</Link>}
          />
        </div>
      </ScrollReveal>
    </section>
  );
}
