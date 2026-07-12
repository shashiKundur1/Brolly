"use client";

import { useEffect, useRef, type ReactNode } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

type ScrollRevealProps = {
  children: ReactNode;
  className?: string;
  stagger?: number;
  y?: number;
};

export function ScrollReveal({
  children,
  className,
  stagger = 0.12,
  y = 28,
}: ScrollRevealProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const targets = Array.from(root.children) as HTMLElement[];

    if (prefersReducedMotion || targets.length === 0) {
      gsap.set(targets, { opacity: 1, y: 0 });
      return;
    }

    const ctx = gsap.context(() => {
      gsap.set(targets, { opacity: 0, y });
      gsap.to(targets, {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: "none",
        stagger,
        scrollTrigger: {
          trigger: root,
          start: "top 82%",
          toggleActions: "play none none reverse",
        },
      });
    }, root);

    return () => ctx.revert();
  }, [stagger, y]);

  return (
    <div ref={rootRef} className={className}>
      {children}
    </div>
  );
}
