"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Cloud1, Cloud2, Cloud3, Hills, RainStreaks, Umbrella } from "@/components/brand/scenes";

export function DoodleScene() {
  const sceneRef = useRef<HTMLDivElement>(null);
  const cloudRef0 = useRef<HTMLDivElement>(null);
  const cloudRef1 = useRef<HTMLDivElement>(null);
  const cloudRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (prefersReducedMotion) return;

    const clouds = [cloudRef0.current, cloudRef1.current, cloudRef2.current].filter(
      (node): node is HTMLDivElement => node !== null
    );

    const ctx = gsap.context(() => {
      clouds.forEach((cloud, index) => {
        gsap.to(cloud, {
          x: "+=18",
          duration: 7 + index * 1.5,
          ease: "none",
          yoyo: true,
          repeat: -1,
        });
      });
    }, sceneRef);

    return () => ctx.revert();
  }, []);

  return (
    <div ref={sceneRef} className="-mx-6 md:-mx-10">
      <div className="relative h-56 w-full overflow-hidden bg-secondary/20 md:h-72">
        <div ref={cloudRef0} className="absolute top-6 left-[8%] w-28 text-foreground/70 md:w-36">
          <Cloud1 className="h-auto w-full" />
          <RainStreaks className="mt-[-6px] h-10 w-full text-secondary-foreground/40 md:h-12" />
        </div>
        <div ref={cloudRef1} className="absolute top-2 left-[42%] w-20 text-foreground/60 md:w-28">
          <Cloud2 className="h-auto w-full" />
        </div>
        <div ref={cloudRef2} className="absolute top-10 right-[10%] w-24 text-foreground/65 md:w-32">
          <Cloud3 className="h-auto w-full" />
          <RainStreaks className="mt-[-4px] h-9 w-full text-secondary-foreground/40 md:h-11" />
        </div>
        <Hills className="absolute inset-x-0 bottom-0 h-32 w-full md:h-40" />
        <Umbrella className="absolute bottom-16 left-1/2 h-20 w-20 -translate-x-1/2 text-foreground md:bottom-20 md:h-24 md:w-24" />
      </div>
    </div>
  );
}
