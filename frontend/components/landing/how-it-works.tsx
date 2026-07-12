"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    icon: "/brand/color/how-plug-color.svg",
    panelTone: "bg-primary/25",
    title: "Point your tools here",
    description:
      "Swap your base URL to Brolly's endpoint. Every SDK that already speaks the OpenAI chat-completions format speaks Brolly with zero code changes beyond that one string.",
    href: null as string | null,
  },
  {
    icon: "/brand/color/how-ladder-color.svg",
    panelTone: "bg-secondary/60",
    title: "Pay less by default",
    description:
      "Each call climbs a cascade of models, cheapest first, and stops the moment one passes your benchmark. You stop overpaying for calls a smaller model could handle.",
    href: "/cascade",
  },
  {
    icon: "/brand/color/how-shield-color.svg",
    panelTone: "bg-accent/60",
    title: "Survive the outage",
    description:
      "A model dies mid-session, Brolly hot-swaps to a healthy one and carries the context across. Your user never notices the provider had a bad day.",
    href: "/failover",
  },
];

export function HowItWorks() {
  const gridRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const cards = Array.from(grid.children) as HTMLElement[];

    if (prefersReducedMotion || cards.length === 0) {
      gsap.set(cards, { opacity: 1, rotateY: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(cards, {
        opacity: 0,
        rotateY: -90,
        transformPerspective: 800,
        transformOrigin: "center center",
      });
      gsap.to(cards, {
        opacity: 1,
        rotateY: 0,
        duration: 0.6,
        ease: "none",
        stagger: 0.15,
        scrollTrigger: {
          trigger: grid,
          start: "top 80%",
          toggleActions: "play none none reverse",
        },
      });
    }, grid);

    return () => ctx.revert();
  }, []);

  return (
    <section className="w-full py-16 md:py-24">
      <div className="flex w-full flex-col items-center gap-3 text-center">
        <h2 className="font-display text-5xl md:text-6xl">how it works</h2>
        <p className="max-w-prose text-lg text-muted-foreground text-balance">
          Three moves. Point, cascade, survive.
        </p>
      </div>
      <div ref={gridRef} className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-3">
        {steps.map((step) => {
          const content = (
            <>
              <div className={`mx-(--card-spacing) mt-(--card-spacing) overflow-hidden rounded-2xl ${step.panelTone} px-6 pt-8 pb-6`}>
                <img
                  src={step.icon}
                  alt=""
                  width={1024}
                  height={1024}
                  className="mx-auto block h-32 w-32"
                />
              </div>
              <CardHeader className="pt-5">
                <CardTitle className="font-display text-3xl font-normal">
                  {step.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="pb-2">
                <p className="text-base text-muted-foreground">{step.description}</p>
              </CardContent>
            </>
          );

          return (
            <Card key={step.title} className="py-0">
              {step.href ? (
                <Link href={step.href} className="flex h-full flex-col">
                  {content}
                </Link>
              ) : (
                <div className="flex h-full flex-col">{content}</div>
              )}
            </Card>
          );
        })}
      </div>
    </section>
  );
}
