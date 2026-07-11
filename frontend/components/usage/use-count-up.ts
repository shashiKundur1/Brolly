"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";

export function useCountUp(value: number, ready: boolean): number {
  const [display, setDisplay] = useState(0);
  const hasAnimated = useRef(false);

  useEffect(() => {
    if (!ready || hasAnimated.current) return;
    hasAnimated.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const counter = { current: 0 };
    const tween = gsap.to(counter, {
      current: value,
      duration: reduceMotion ? 0 : 0.8,
      ease: "none",
      onUpdate: () => setDisplay(counter.current),
    });

    return () => {
      tween.kill();
    };
  }, [ready, value]);

  return display;
}
