"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function useStaggerReveal<T extends HTMLElement>(
  ready: boolean,
  deps: unknown[] = []
) {
  const containerRef = useRef<T | null>(null);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ready || !containerRef.current || hasAnimated.current) return;

    const items = containerRef.current.querySelectorAll("[data-reveal]");
    if (items.length === 0) return;

    hasAnimated.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (reduceMotion) {
      gsap.set(items, { opacity: 1, y: 0 });
      return;
    }

    const tween = gsap.fromTo(
      items,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: "none", stagger: 0.08 }
    );

    return () => {
      tween.kill();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ready, ...deps]);

  return containerRef;
}
