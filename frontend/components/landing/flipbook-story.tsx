"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  Cloud2,
  Confetti,
  Hills,
  RainStreaks,
  Umbrella,
  CharacterArmDown,
  CharacterArmRaised,
} from "@/components/brand/scenes";

gsap.registerPlugin(ScrollTrigger);

const beats = [
  "3am. your model gets deprecated mid-run.",
  "brolly drifts in.",
  "hooked. context carried over.",
  "you never even noticed the weather.",
];

export function FlipbookStory() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const umbrellaRef = useRef<HTMLDivElement>(null);
  const armDownRef = useRef<HTMLDivElement>(null);
  const armRaisedRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return;

    ScrollTrigger.getAll().forEach((trigger) => {
      if (trigger.trigger === sectionRef.current) trigger.kill();
    });

    const captions = captionRefs.current.filter(
      (node): node is HTMLParagraphElement => node !== null
    );

    const ctx = gsap.context(() => {
      gsap.set(captions, { autoAlpha: 0 });
      gsap.set(cloudRef.current, { autoAlpha: 0, y: -16 });
      gsap.set(rainRef.current, { autoAlpha: 0 });
      gsap.set(umbrellaRef.current, { autoAlpha: 0, x: 60, y: -30 });
      gsap.set(armRaisedRef.current, { autoAlpha: 0 });
      gsap.set(armDownRef.current, { autoAlpha: 1 });
      gsap.set(confettiRef.current, { autoAlpha: 0, scale: 0.6 });

      const timeline = gsap.timeline({ paused: true, defaults: { ease: "none" } });

      timeline.addLabel("rain");
      timeline.to(cloudRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, "rain");
      timeline.to(rainRef.current, { autoAlpha: 1, duration: 0.3 }, "rain+=0.2");
      timeline.to(captions[0], { autoAlpha: 1, duration: 0.2 }, "rain");
      timeline.to(captions[0], { autoAlpha: 0, duration: 0.2 }, "rain+=0.9");

      timeline.addLabel("drift", "rain+=1.1");
      timeline.to(
        umbrellaRef.current,
        { autoAlpha: 1, x: 0, y: 0, duration: 0.8, ease: "steps(8)" },
        "drift"
      );
      timeline.to(captions[1], { autoAlpha: 1, duration: 0.2 }, "drift");
      timeline.to(captions[1], { autoAlpha: 0, duration: 0.2 }, "drift+=0.9");

      timeline.addLabel("hook", "drift+=1.0");
      timeline.to(
        umbrellaRef.current,
        { x: -120, y: 90, duration: 0.5, ease: "steps(6)" },
        "hook"
      );
      timeline.to(armDownRef.current, { autoAlpha: 0, duration: 0.1 }, "hook+=0.35");
      timeline.to(armRaisedRef.current, { autoAlpha: 1, duration: 0.1 }, "hook+=0.35");
      timeline.to(rainRef.current, { autoAlpha: 0, duration: 0.3 }, "hook+=0.1");
      timeline.to(
        confettiRef.current,
        { autoAlpha: 1, scale: 1, duration: 0.3, ease: "steps(4)" },
        "hook+=0.4"
      );
      timeline.to(captions[2], { autoAlpha: 1, duration: 0.2 }, "hook");
      timeline.to(captions[2], { autoAlpha: 0, duration: 0.2 }, "hook+=0.9");

      timeline.addLabel("clear", "hook+=1.0");
      timeline.to(cloudRef.current, { autoAlpha: 0, y: -16, duration: 0.4 }, "clear");
      timeline.to(confettiRef.current, { autoAlpha: 0, duration: 0.3 }, "clear");
      timeline.to(captions[3], { autoAlpha: 1, duration: 0.2 }, "clear");

      ScrollTrigger.create({
        trigger: sectionRef.current,
        start: "top 70%",
        toggleActions: "play reverse play reverse",
        onEnter: () => timeline.play(),
        onLeaveBack: () => timeline.reverse(),
      });

      return () => {
        timeline.kill();
      };
    }, sectionRef);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion !== false) {
    return (
      <section className="-mx-6 px-6 py-10 md:-mx-10 md:px-10">
        <div className="relative mx-auto flex h-72 max-w-2xl items-center justify-center overflow-hidden rounded-2xl bg-secondary/20">
          <Hills className="absolute inset-x-0 bottom-0 h-24 w-full" />
          <Umbrella className="absolute top-8 right-[28%] h-16 w-16 text-foreground" />
          <div className="absolute bottom-10 left-1/2 h-24 w-14 -translate-x-1/2">
            <CharacterArmRaised className="h-full w-full text-foreground" />
          </div>
          <Confetti className="absolute top-6 left-[30%] h-16 w-16 text-primary" />
        </div>
        <p className="mt-6 text-center font-display text-2xl text-balance">
          {beats[beats.length - 1]}
        </p>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="-mx-6 px-6 py-10 md:-mx-10 md:px-10">
      <div className="relative mx-auto flex h-80 max-w-2xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-secondary/20 md:h-96">
        <div ref={cloudRef} className="absolute top-16 left-[26%] w-24 text-foreground/70 md:top-20 md:w-28">
          <Cloud2 className="h-auto w-full" />
          <div ref={rainRef} className="mt-[-4px]">
            <RainStreaks className="h-10 w-full text-secondary-foreground/50 md:h-12" />
          </div>
        </div>

        <div ref={umbrellaRef} className="absolute top-20 right-[24%] h-16 w-16 text-foreground md:top-24 md:h-20 md:w-20">
          <Umbrella className="h-full w-full" />
        </div>

        <div className="absolute bottom-10 left-1/2 h-28 w-16 -translate-x-1/2 md:h-32 md:w-20">
          <div ref={armDownRef} className="absolute inset-0 text-foreground">
            <CharacterArmDown className="h-full w-full" />
          </div>
          <div ref={armRaisedRef} className="absolute inset-0 text-foreground">
            <CharacterArmRaised className="h-full w-full" />
          </div>
        </div>

        <div ref={confettiRef} className="absolute top-8 left-[28%] h-16 w-16 text-primary">
          <Confetti className="h-full w-full" />
        </div>

        <Hills className="absolute inset-x-0 bottom-0 h-20 w-full" aria-hidden="true" />

        {beats.map((beat, index) => (
          <p
            key={beat}
            ref={(node) => {
              captionRefs.current[index] = node;
            }}
            className="pointer-events-none absolute inset-x-0 top-4 z-10 mx-auto max-w-prose px-6 text-center font-display text-xl text-balance md:text-2xl"
          >
            {beat}
          </p>
        ))}
      </div>
    </section>
  );
}
