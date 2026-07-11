"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

export function DoodleScene() {
  const sceneRef = useRef<SVGSVGElement>(null);
  const cloudRef0 = useRef<SVGGElement>(null);
  const cloudRef1 = useRef<SVGGElement>(null);
  const cloudRef2 = useRef<SVGGElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const clouds = [cloudRef0.current, cloudRef1.current, cloudRef2.current].filter(
      (node): node is SVGGElement => node !== null
    );

    const ctx = gsap.context(() => {
      clouds.forEach((cloud, index) => {
        gsap.to(cloud, {
          x: "+=24",
          duration: 6 + index * 1.5,
          ease: "none",
          yoyo: true,
          repeat: -1,
        });
      });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div className="-mx-6 md:-mx-10">
      <svg
        ref={sceneRef}
        viewBox="0 0 1200 320"
        className="h-auto w-full"
        role="img"
        aria-label="Doodle landscape of rolling hills, clouds, and an umbrella"
      >
        <rect x="0" y="0" width="1200" height="320" fill="var(--secondary)" opacity="0.25" />
        <path
          d="M0 220 C 150 160, 300 260, 480 200 C 660 140, 820 240, 1000 190 C 1100 165, 1160 200, 1200 190 L 1200 320 L 0 320 Z"
          fill="var(--secondary)"
        />
        <path
          d="M0 260 C 200 220, 380 300, 600 250 C 800 205, 960 290, 1200 245 L 1200 320 L 0 320 Z"
          fill="var(--muted)"
        />
        <g ref={cloudRef0} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.7">
          <path d="M120 70 a18 18 0 1 1 0.1 0 M100 78 a14 14 0 1 1 0.1 0 M140 78 a14 14 0 1 1 0.1 0 M90 82 h70" />
        </g>
        <g ref={cloudRef1} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.6">
          <path d="M420 50 a15 15 0 1 1 0.1 0 M404 58 a11 11 0 1 1 0.1 0 M436 58 a11 11 0 1 1 0.1 0 M396 62 h56" />
        </g>
        <g ref={cloudRef2} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.65">
          <path d="M900 60 a17 17 0 1 1 0.1 0 M882 68 a13 13 0 1 1 0.1 0 M918 68 a13 13 0 1 1 0.1 0 M872 72 h66" />
        </g>
        <g transform="translate(560 130)">
          <path
            d="M60 0 C 25 0 0 30 -5 55 C 12 45 30 45 45 55 C 60 45 78 45 95 55 C 112 45 130 45 147 55 C 142 30 117 0 60 0 Z"
            fill="var(--primary)"
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinejoin="round"
          />
          <line x1="60" y1="55" x2="60" y2="130" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
          <path d="M60 130 q -14 10 -22 0" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none" />
        </g>
      </svg>
    </div>
  );
}
