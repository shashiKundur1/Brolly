"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { WavyDivider } from "@/components/landing/wavy-divider";

export function LandingHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const taglineRef = useRef<HTMLParagraphElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets: HTMLElement[] = [
      headlineRef.current,
      taglineRef.current,
      sublineRef.current,
      actionsRef.current,
    ].filter((node) => node !== null);

    if (prefersReducedMotion) {
      gsap.set(curtainRef.current, { autoAlpha: 0 });
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y: 12 });

      const timeline = gsap.timeline();
      timeline
        .to(curtainRef.current, {
          scaleX: 0,
          transformOrigin: "right center",
          duration: 0.6,
          ease: "none",
        })
        .to(
          targets,
          {
            opacity: 1,
            y: 0,
            duration: 0.3,
            ease: "none",
            stagger: 0.08,
          },
          "-=0.3"
        );
    }, rootRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={rootRef} className="relative -mx-6 md:-mx-10">
      <div
        ref={curtainRef}
        className="pointer-events-none absolute inset-0 z-10 bg-background"
        aria-hidden="true"
      />
      <section className="relative overflow-hidden bg-primary px-6 pt-16 pb-28 md:px-10 md:pt-24 md:pb-40">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-12 md:grid-cols-[1.05fr_0.95fr] md:gap-10">
          <div className="flex flex-col items-start gap-6 text-left">
            <h1
              ref={headlineRef}
              className="font-display text-7xl leading-[0.92] text-balance text-foreground sm:text-8xl md:text-9xl"
            >
              model
              <br />
              insurance
            </h1>
            <p
              ref={taglineRef}
              className="font-display text-3xl text-balance text-foreground md:text-4xl"
            >
              an umbrella for your LLM bills&hellip;kinda.
            </p>
            <p
              ref={sublineRef}
              className="max-w-prose rounded-2xl bg-card px-5 py-4 text-lg text-foreground text-balance md:text-xl"
            >
              Brolly sits in front of your model calls: it watches every
              request, routes each one to the cheapest model that still
              passes your benchmark, and hot-swaps providers mid-session the
              moment one goes down. Point your SDK at it and forget it exists
              — until it saves you.
            </p>
            <div ref={actionsRef} className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8 text-base"
                render={<Link href="/dashboard">Open the dashboard</Link>}
              />
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 text-base"
                render={<Link href="/cascade">See the cascade</Link>}
              />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-sm rounded-3xl bg-card p-5 sm:max-w-md md:max-w-none md:justify-self-end">
            <img
              src="/brand/color/scene-hero-color.svg"
              alt=""
              width={1024}
              height={1024}
              className="block h-auto w-full"
            />
          </div>
        </div>
      </section>
      <WavyDivider tone="primary" />
    </div>
  );
}
