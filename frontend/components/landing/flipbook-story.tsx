"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  Cloud2,
  Confetti,
  Hills,
  RainStreaks,
  Umbrella,
  UmbrellaBlown,
  CharacterArmDown,
  CharacterArmRaised,
} from "@/components/brand/scenes";

gsap.registerPlugin(MotionPathPlugin);

const beats = [
  "3am. your model gets deprecated mid-run.",
  "brolly drifts in.",
  "hooked. tied off. covered.",
  "you never even noticed the weather.",
];

const frameWidth = 130;
const frameHeight = 190;
const ropeStart = { x: 108, y: 0 };
const ropeEnd = { x: 84, y: 154 };
const umbrellaLand = { x: 65, y: 100 };
const ropePath = `M${ropeStart.x} ${ropeStart.y}C98 30 122 52 108 84C96 112 70 128 ${ropeEnd.x} ${ropeEnd.y}`;
const knotPath =
  "M84 154C90 150 97 151 98 157C99 163 92 167 86 165C81 163 80 158 84 155C86 153 91 153 93 155";
const umbrellaKeyframes = [
  { x: 0, y: 0 },
  { x: -6, y: 22 },
  { x: 4, y: 38 },
  { x: -4, y: 60 },
  { x: -14, y: 82 },
  { x: umbrellaLand.x - ropeStart.x, y: umbrellaLand.y - ropeStart.y },
];

export function FlipbookStory() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<HTMLDivElement>(null);
  const rainRef = useRef<HTMLDivElement>(null);
  const rainDeflectRef = useRef<HTMLDivElement>(null);
  const umbrellaWrapRef = useRef<HTMLDivElement>(null);
  const umbrellaClosedRef = useRef<HTMLDivElement>(null);
  const umbrellaOpenRef = useRef<HTMLDivElement>(null);
  const ropeRef = useRef<SVGPathElement>(null);
  const knotRef = useRef<SVGPathElement>(null);
  const armDownRef = useRef<HTMLDivElement>(null);
  const armRaisedRef = useRef<HTMLDivElement>(null);
  const confettiRef = useRef<HTMLDivElement>(null);
  const captionRefs = useRef<(HTMLParagraphElement | null)[]>([]);
  const playedRef = useRef(false);

  useEffect(() => {
    const query = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(query.matches);
    sync();
    query.addEventListener("change", sync);
    return () => query.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (reducedMotion !== false) return;
    const section = sectionRef.current;
    if (!section) return;

    const captions = captionRefs.current.filter(
      (node): node is HTMLParagraphElement => node !== null
    );

    const ropeLength = ropeRef.current?.getTotalLength() ?? 0;
    const knotLength = knotRef.current?.getTotalLength() ?? 0;

    const ctx = gsap.context(() => {
      gsap.set(captions, { autoAlpha: 0 });
      gsap.set(cloudRef.current, { autoAlpha: 0, y: -16 });
      gsap.set(rainRef.current, { autoAlpha: 0 });
      gsap.set(rainDeflectRef.current, { autoAlpha: 0 });
      gsap.set(armRaisedRef.current, { autoAlpha: 0 });
      gsap.set(armDownRef.current, { autoAlpha: 1 });
      gsap.set(confettiRef.current, { autoAlpha: 0, scale: 0.6 });
      gsap.set(umbrellaWrapRef.current, { autoAlpha: 0, xPercent: -50, yPercent: 0 });
      gsap.set(umbrellaOpenRef.current, { autoAlpha: 0, scale: 0.7 });
      gsap.set(umbrellaClosedRef.current, { autoAlpha: 1, scale: 1 });
      gsap.set(ropeRef.current, {
        autoAlpha: 1,
        strokeDasharray: ropeLength,
        strokeDashoffset: ropeLength,
      });
      gsap.set(knotRef.current, {
        autoAlpha: 0,
        strokeDasharray: knotLength,
        strokeDashoffset: knotLength,
      });

      const timeline = gsap.timeline({
        paused: true,
        defaults: { ease: "none" },
      });

      timeline.addLabel("rain");
      timeline.to(cloudRef.current, { autoAlpha: 1, y: 0, duration: 0.4 }, "rain");
      timeline.to(rainRef.current, { autoAlpha: 1, duration: 0.3 }, "rain+=0.2");
      timeline.to(captions[0], { autoAlpha: 1, duration: 0.2 }, "rain");
      timeline.to(captions[0], { autoAlpha: 0, duration: 0.2 }, "rain+=0.9");

      timeline.addLabel("drift", "rain+=1.1");
      timeline.to(umbrellaWrapRef.current, { autoAlpha: 1, duration: 0.2 }, "drift");
      timeline.to(captions[1], { autoAlpha: 1, duration: 0.2 }, "drift");
      timeline.to(captions[1], { autoAlpha: 0, duration: 0.2 }, "drift+=0.9");

      timeline.addLabel("descend", "drift+=1.0");
      timeline.to(
        ropeRef.current,
        { strokeDashoffset: 0, duration: 1.1, ease: "none" },
        "descend"
      );
      timeline.to(
        umbrellaWrapRef.current,
        {
          duration: 1.1,
          ease: "none",
          motionPath: {
            path: umbrellaKeyframes,
            curviness: 1,
          },
        },
        "descend"
      );

      timeline.addLabel("hook", "descend+=1.1");
      timeline.to(knotRef.current, { autoAlpha: 1, duration: 0.05 }, "hook");
      timeline.to(
        knotRef.current,
        { strokeDashoffset: 0, duration: 0.4, ease: "none" },
        "hook"
      );
      timeline.to(armDownRef.current, { autoAlpha: 0, duration: 0.1 }, "hook+=0.15");
      timeline.to(armRaisedRef.current, { autoAlpha: 1, duration: 0.1 }, "hook+=0.15");
      timeline.to(
        umbrellaClosedRef.current,
        { autoAlpha: 0, scale: 0.85, duration: 0.2 },
        "hook+=0.4"
      );
      timeline.to(
        umbrellaOpenRef.current,
        { autoAlpha: 1, scale: 1, duration: 0.25, ease: "steps(5)" },
        "hook+=0.4"
      );
      timeline.to(rainRef.current, { autoAlpha: 0, duration: 0.2 }, "hook+=0.5");
      timeline.to(rainDeflectRef.current, { autoAlpha: 1, duration: 0.2 }, "hook+=0.6");
      timeline.to(
        confettiRef.current,
        { autoAlpha: 1, scale: 1, duration: 0.3, ease: "steps(4)" },
        "hook+=0.7"
      );
      timeline.to(confettiRef.current, { autoAlpha: 0, duration: 0.3 }, "hook+=1.3");
      timeline.to(captions[2], { autoAlpha: 1, duration: 0.2 }, "hook");
      timeline.to(captions[2], { autoAlpha: 0, duration: 0.2 }, "hook+=1.4");

      timeline.addLabel("clear", "hook+=1.6");
      timeline.to(cloudRef.current, { autoAlpha: 0, y: -16, duration: 0.4 }, "clear");
      timeline.to(rainDeflectRef.current, { autoAlpha: 0, duration: 0.3 }, "clear");
      timeline.to(captions[3], { autoAlpha: 1, duration: 0.2 }, "clear+=0.3");

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting && !playedRef.current) {
              playedRef.current = true;
              timeline.play();
            }
          });
        },
        { threshold: 0.4 }
      );
      observer.observe(section);

      return () => observer.disconnect();
    }, section);

    return () => ctx.revert();
  }, [reducedMotion]);

  if (reducedMotion !== false) {
    return (
      <section className="-mx-6 px-6 py-10 md:-mx-10 md:px-10">
        <div className="relative mx-auto flex h-80 max-w-2xl flex-col items-center justify-center overflow-hidden rounded-2xl bg-secondary/20 md:h-96">
          <Hills className="absolute inset-x-0 bottom-0 h-20 w-full" />
          <div className="absolute top-[8%] left-1/2 h-[62%] w-32 -translate-x-1/2 md:w-40">
            <svg
              viewBox={`0 0 ${frameWidth} ${frameHeight}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 h-full w-full text-foreground"
              aria-hidden="true"
            >
              <path
                d={ropePath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
              <path
                d={knotPath}
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <div
              className="absolute h-14 w-14 -translate-x-1/2 text-foreground md:h-16 md:w-16"
              style={{
                left: `${(umbrellaLand.x / frameWidth) * 100}%`,
                top: `${(umbrellaLand.y / frameHeight) * 100}%`,
              }}
            >
              <UmbrellaBlown className="h-full w-full" />
            </div>
          </div>
          <div className="absolute bottom-10 left-1/2 h-28 w-16 -translate-x-1/2 md:h-32 md:w-20">
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

        <div className="absolute top-[8%] left-1/2 z-[1] h-[62%] w-32 -translate-x-1/2 md:w-40">
          <svg
            viewBox={`0 0 ${frameWidth} ${frameHeight}`}
            preserveAspectRatio="none"
            className="pointer-events-none absolute inset-0 h-full w-full text-foreground"
            aria-hidden="true"
          >
            <path
              ref={ropeRef}
              d={ropePath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            <path
              ref={knotRef}
              d={knotPath}
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <div
            ref={umbrellaWrapRef}
            className="absolute z-[2] h-14 w-14 md:h-16 md:w-16"
            style={{
              left: `${(ropeStart.x / frameWidth) * 100}%`,
              top: `${(ropeStart.y / frameHeight) * 100}%`,
            }}
          >
            <div ref={umbrellaClosedRef} className="absolute inset-0">
              <Umbrella className="h-full w-full text-foreground" />
            </div>
            <div ref={umbrellaOpenRef} className="absolute inset-0">
              <UmbrellaBlown className="h-full w-full text-foreground" />
            </div>
          </div>

          <div
            ref={rainDeflectRef}
            className="absolute h-10 w-20 -translate-x-1/2 md:h-12 md:w-24"
            style={{
              left: `${(umbrellaLand.x / frameWidth) * 100}%`,
              top: `${((umbrellaLand.y - 30) / frameHeight) * 100}%`,
            }}
          >
            <RainStreaks className="h-full w-full rotate-180 text-secondary-foreground/50" />
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 h-28 w-16 -translate-x-1/2 md:h-32 md:w-20">
          <div ref={armDownRef} className="absolute inset-0 text-foreground">
            <CharacterArmDown className="h-full w-full" />
          </div>
          <div ref={armRaisedRef} className="absolute inset-0 text-foreground">
            <CharacterArmRaised className="h-full w-full" />
          </div>
        </div>

        <div ref={confettiRef} className="absolute top-8 left-[28%] z-[2] h-16 w-16 text-primary">
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
