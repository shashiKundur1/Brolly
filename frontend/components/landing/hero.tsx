"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BrollyLogo } from "@/components/brand/logo";
import { CloudRainIcon } from "@phosphor-icons/react/dist/ssr";

export function LandingHero() {
  const rootRef = useRef<HTMLDivElement>(null);
  const curtainRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const sublineRef = useRef<HTMLParagraphElement>(null);
  const actionsRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    const targets: HTMLElement[] = [
      badgeRef.current,
      headlineRef.current,
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
      <section className="flex w-full flex-col items-center justify-center gap-6 px-6 py-16 text-center md:px-10">
        <div ref={badgeRef} className="flex flex-col items-center gap-3">
          <div className="flex items-center gap-3">
            <BrollyLogo className="size-8 text-foreground" />
            <span className="font-display text-2xl">Brolly</span>
          </div>
          <Badge variant="secondary" className="gap-1.5">
            <CloudRainIcon size={14} weight="bold" />
            model insurance, not model worship
          </Badge>
        </div>
        <h1
          ref={headlineRef}
          className="font-display text-6xl leading-tight text-balance md:text-7xl"
        >
          Insurance for your
          <br />
          AI models.
        </h1>
        <p
          ref={sublineRef}
          className="max-w-prose text-lg text-muted-foreground text-balance"
        >
          Pay the cheapest model that passes your benchmark. Never lose a
          session when a provider goes down.
        </p>
        <div ref={actionsRef} className="flex flex-wrap items-center justify-center gap-4">
          <Button
            size="lg"
            className="rounded-full px-6"
            render={<Link href="/dashboard">Open the dashboard</Link>}
          />
          <Button
            size="lg"
            variant="ghost"
            className="rounded-full px-6"
            render={<Link href="/failover">See the failover demo</Link>}
          />
        </div>
      </section>
    </div>
  );
}
