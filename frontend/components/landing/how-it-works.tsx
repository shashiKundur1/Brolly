"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ArtCrop } from "@/components/landing/art-crop";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const steps = [
  {
    icon: "/brand/color/how-plug-color.svg",
    box: "162 266 700 506",
    panelTone: "cell-mint",
    title: "point your tools here",
    description:
      "Swap one base URL. Every SDK that speaks the OpenAI format now speaks Brolly — zero other code changes.",
    href: null as string | null,
  },
  {
    icon: "/brand/color/how-ladder-color.svg",
    box: "178 42 658 938",
    panelTone: "cell-butter",
    title: "pay less by default",
    description:
      "Calls climb the cascade, cheapest model first, and stop at the first one that clears your benchmark.",
    href: "/cascade",
  },
  {
    icon: "/brand/color/how-shield-color.svg",
    box: "120 172 764 616",
    panelTone: "cell-paper",
    title: "survive the outage",
    description:
      "A model dies mid-session, Brolly hot-swaps to a healthy one and carries the context across.",
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
    <section className="-mx-6 bg-secondary/30 px-6 py-16 md:-mx-10 md:px-10 md:py-24">
      <div className="mx-auto flex w-full max-w-7xl flex-col items-center gap-3 text-center">
        <h2 className="text-4xl font-semibold sm:text-5xl md:text-6xl">
          how it works
        </h2>
        <p className="max-w-prose text-lg text-muted-foreground text-balance">
          Three moves. Point, cascade, survive.
        </p>
      </div>
      <div
        ref={gridRef}
        className="mx-auto mt-12 grid w-full max-w-7xl grid-cols-1 gap-8 md:grid-cols-3"
      >
        {steps.map((step) => {
          const content = (
            <>
              <figure
                className={`flex items-center justify-center overflow-hidden rounded-t-2xl ${step.panelTone} px-6 pt-8 pb-6`}
              >
                <ArtCrop
                  src={step.icon}
                  box={step.box}
                  className="block h-56 w-full md:h-64"
                />
              </figure>
              <div className="flex flex-1 flex-col gap-2 px-6 pt-5 pb-7">
                <h3 className="font-display text-3xl font-semibold">
                  {step.title}
                </h3>
                <p className="text-base text-muted-foreground">
                  {step.description}
                </p>
              </div>
            </>
          );

          return (
            <article
              key={step.title}
              className="doodle-rough overflow-hidden bg-card backface-hidden"
            >
              {step.href ? (
                <Link
                  href={step.href}
                  className="flex h-full flex-col outline-none focus-visible:ring-3 focus-visible:ring-ring/50 motion-safe:transition-transform motion-safe:duration-150 motion-safe:ease-linear motion-safe:hover:-translate-y-1"
                >
                  {content}
                </Link>
              ) : (
                <div className="flex h-full flex-col">{content}</div>
              )}
            </article>
          );
        })}
      </div>
    </section>
  );
}
