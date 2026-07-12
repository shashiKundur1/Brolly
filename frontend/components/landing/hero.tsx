"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { InlineDoodleSvg } from "@/components/landing/inline-doodle-svg";
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
      <section className="relative overflow-hidden bg-primary px-6 pt-14 pb-24 md:px-10 md:pb-32">
        <div className="mx-auto grid w-full max-w-7xl grid-cols-1 items-center gap-10 md:grid-cols-[1.1fr_0.9fr] md:gap-6">
          <div className="flex flex-col items-start gap-5 text-left">
            <h1
              ref={headlineRef}
              className="font-display text-6xl leading-[0.95] text-balance text-foreground sm:text-7xl md:text-8xl"
            >
              model
              <br />
              insurance
            </h1>
            <p
              ref={taglineRef}
              className="font-display text-2xl text-balance text-foreground md:text-3xl"
            >
              an umbrella for your LLM bills&hellip;kinda.
            </p>
            <p
              ref={sublineRef}
              className="max-w-prose rounded-2xl bg-card px-4 py-3 text-base text-foreground text-balance md:text-lg"
            >
              Pay the cheapest model that passes your benchmark. Never lose a
              session when a provider goes down.
            </p>
            <div ref={actionsRef} className="flex flex-wrap items-center gap-4 pt-2">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-7"
                render={<Link href="/dashboard">Open the dashboard</Link>}
              />
            </div>
          </div>
          <div className="relative mx-auto w-full max-w-xs sm:max-w-sm md:max-w-none md:scale-125 md:justify-self-end">
            <InlineDoodleSvg
              src="/brand/bento/hero-character-umbrella.svg"
              className="block h-auto w-full text-primary-foreground [&_svg]:h-auto [&_svg]:w-full"
            />
          </div>
        </div>
      </section>
      <WavyDivider tone="primary" />
    </div>
  );
}
