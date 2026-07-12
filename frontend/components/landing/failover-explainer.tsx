import Link from "next/link";
import { ScrollReveal } from "@/components/landing/scroll-reveal";
import { Button } from "@/components/ui/button";

export function FailoverExplainer() {
  return (
    <section className="w-full py-16 md:py-24">
      <ScrollReveal className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[0.95fr_1.05fr] md:gap-16">
        <div className="mx-auto w-full max-w-md rounded-3xl bg-secondary/30 p-6 md:mx-0">
          <img
            src="/brand/color/rain-color.svg"
            alt=""
            width={1024}
            height={1024}
            className="block h-auto w-full"
          />
        </div>
        <div className="flex flex-col items-start gap-5 text-left">
          <p className="font-display text-2xl text-primary">survive the outage</p>
          <h2 className="font-display text-5xl leading-tight text-balance md:text-6xl">
            mid-session failover
          </h2>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            A provider goes down mid-conversation, mid-agent-run, mid-anything.
            Brolly notices before your user does, hot-swaps to a healthy
            model, and carries the context across so the conversation keeps
            going like nothing happened.
          </p>
          <p className="max-w-prose text-lg text-muted-foreground text-balance md:text-xl">
            No dropped session, no "please try again later," no 3am page.
            One provider having a bad day stops being your incident.
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
