"use client";

import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import {
  CloudRainIcon,
  UmbrellaIcon,
  LinkIcon,
  SunIcon,
} from "@phosphor-icons/react/dist/ssr";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

const beats = [
  {
    number: "1",
    caption: "3am. your model gets deprecated mid-run.",
    icon: CloudRainIcon,
  },
  {
    number: "2",
    caption: "brolly swoops in.",
    icon: UmbrellaIcon,
  },
  {
    number: "3",
    caption: "hooked. context carried over.",
    icon: LinkIcon,
  },
  {
    number: "4",
    caption: "you never even noticed the weather.",
    icon: SunIcon,
  },
];

const umbrellaPath =
  "M 980 40 C 900 120, 1020 220, 860 300 C 780 360, 760 420, 694 406";

const confettiTicks = [
  { x: 674, y: 396, rotate: 10 },
  { x: 702, y: 384, rotate: -18 },
  { x: 654, y: 416, rotate: 32 },
  { x: 724, y: 406, rotate: -6 },
  { x: 689, y: 436, rotate: 22 },
  { x: 664, y: 376, rotate: -30 },
];

export function FlipbookStory() {
  const [reducedMotion, setReducedMotion] = useState<boolean | null>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const cloudRef = useRef<SVGGElement>(null);
  const rainRef = useRef<SVGGElement>(null);
  const rainBounceRef = useRef<SVGGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const umbrellaRef = useRef<SVGGElement>(null);
  const characterRef = useRef<SVGGElement>(null);
  const characterBobRef = useRef<SVGGElement>(null);
  const handRef = useRef<SVGGElement>(null);
  const confettiRef = useRef<SVGGElement>(null);
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
      if (captions[0]) gsap.set(captions[0], { autoAlpha: 1 });

      const pathLength = pathRef.current?.getTotalLength() ?? 0;
      gsap.set(pathRef.current, {
        strokeDasharray: pathLength,
        strokeDashoffset: pathLength,
      });
      gsap.set(cloudRef.current, { y: -220, autoAlpha: 0 });
      gsap.set(rainRef.current, { autoAlpha: 0 });
      gsap.set(rainBounceRef.current, { autoAlpha: 0 });
      gsap.set(umbrellaRef.current, {
        x: 980,
        y: 40,
        autoAlpha: 0,
        rotate: -8,
        transformOrigin: "center bottom",
      });
      gsap.set(confettiRef.current, { autoAlpha: 0 });

      gsap.to(rainRef.current, {
        y: 18,
        duration: 0.5,
        ease: "steps(6)",
        repeat: -1,
      });

      gsap.to(characterBobRef.current, {
        y: -3,
        duration: 0.6,
        ease: "steps(2)",
        repeat: -1,
        yoyo: true,
      });

      const isMobile = window.matchMedia("(max-width: 767px)").matches;
      const end = isMobile ? "+=200%" : "+=300%";

      const master = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end,
          pin: stageRef.current,
          scrub: true,
          anticipatePin: 1,
        },
      });

      master.addLabel("beat1", 0);
      master.to(
        cloudRef.current,
        { y: 0, autoAlpha: 1, duration: 1, ease: "none" },
        "beat1"
      );
      master.to(
        rainRef.current,
        { autoAlpha: 1, duration: 0.4, ease: "none" },
        "beat1+=0.4"
      );
      master.to(captions[0], { autoAlpha: 1, duration: 0.2, ease: "none" }, "beat1");
      master.to(captions[0], { autoAlpha: 0, duration: 0.2, ease: "none" }, "beat1+=0.9");

      master.addLabel("beat2", 1);
      master.to(
        pathRef.current,
        { strokeDashoffset: 0, duration: 1.4, ease: "none" },
        "beat2"
      );
      master.to(
        umbrellaRef.current,
        { autoAlpha: 1, duration: 0.1, ease: "none" },
        "beat2"
      );
      master.to(
        umbrellaRef.current,
        {
          motionPath: {
            path: umbrellaPath,
            autoRotate: false,
          },
          duration: 1.4,
          ease: "none",
        },
        "beat2"
      );
      master.to(captions[1], { autoAlpha: 1, duration: 0.2, ease: "none" }, "beat2");
      master.to(captions[1], { autoAlpha: 0, duration: 0.2, ease: "none" }, "beat2+=1.2");

      master.addLabel("beat3", 2.4);
      master.to(
        pathRef.current,
        { autoAlpha: 0, duration: 0.2, ease: "none" },
        "beat3"
      );
      master.to(
        umbrellaRef.current,
        { rotate: 6, duration: 0.15, ease: "steps(3)" },
        "beat3"
      );
      master.to(
        umbrellaRef.current,
        { scale: 1.15, duration: 0.1, ease: "steps(2)" },
        "beat3+=0.15"
      );
      master.to(
        umbrellaRef.current,
        { scale: 1, rotate: 0, duration: 0.15, ease: "steps(2)" },
        "beat3+=0.25"
      );
      master.to(
        handRef.current,
        { rotate: -12, transformOrigin: "center", duration: 0.15, ease: "steps(2)" },
        "beat3+=0.15"
      );
      master.to(
        confettiRef.current,
        { autoAlpha: 1, duration: 0.05, ease: "none" },
        "beat3+=0.2"
      );
      confettiTicks.forEach((tick, index) => {
        master.to(
          `#confetti-tick-${index}`,
          {
            y: 60 + (index % 3) * 20,
            x: `+=${tick.rotate}`,
            rotate: tick.rotate * 4,
            duration: 0.6,
            ease: "steps(5)",
          },
          "beat3+=0.2"
        );
      });
      master.to(captions[2], { autoAlpha: 1, duration: 0.2, ease: "none" }, "beat3");
      master.to(captions[2], { autoAlpha: 0, duration: 0.2, ease: "none" }, "beat3+=0.55");

      master.addLabel("beat4", 3);
      master.to(
        rainBounceRef.current,
        { autoAlpha: 1, duration: 0.1, ease: "none" },
        "beat4"
      );
      master.to(
        rainBounceRef.current,
        { y: 12, duration: 0.4, ease: "steps(4)", repeat: 3 },
        "beat4"
      );
      master.to(
        characterRef.current,
        { y: -18, duration: 0.2, ease: "steps(3)", repeat: 3, yoyo: true },
        "beat4"
      );
      master.to(captions[3], { autoAlpha: 1, duration: 0.2, ease: "none" }, "beat4");
    }, sectionRef);

    const refreshId = requestAnimationFrame(() => ScrollTrigger.refresh());
    let cancelled = false;
    document.fonts.ready.then(() => {
      if (!cancelled) ScrollTrigger.refresh();
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(refreshId);
      ctx.revert();
    };
  }, [reducedMotion]);

  if (reducedMotion) {
    return (
      <section className="-mx-6 px-6 py-16 md:-mx-10 md:px-10">
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:gap-8">
          {beats.map((beat) => {
            const Icon = beat.icon;
            return (
              <div
                key={beat.number}
                className="doodle-border doodle-shadow flex flex-col items-center gap-3 rounded-2xl bg-card px-6 py-8 text-center"
              >
                <Icon size={36} weight="duotone" className="text-primary" />
                <p className="font-display text-xl text-balance">{beat.caption}</p>
              </div>
            );
          })}
        </div>
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="relative -mx-6 md:-mx-10">
      <div
        ref={stageRef}
        className="relative flex h-svh w-full items-center justify-center overflow-hidden bg-background"
      >
        <svg
          viewBox="0 0 1200 700"
          className="h-full w-full max-w-none"
          preserveAspectRatio="xMidYMax slice"
          role="img"
          aria-label="Doodle story of a coral umbrella descending on a wavy path to hook onto a waiting character as rain falls"
        >
          <path
            d="M0 560 C 200 500, 380 600, 600 540 C 800 490, 960 590, 1200 530 L 1200 700 L 0 700 Z"
            fill="var(--secondary)"
          />

          <g ref={cloudRef} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none">
            <path d="M280 90 a26 26 0 1 1 0.1 0 M250 102 a20 20 0 1 1 0.1 0 M312 102 a20 20 0 1 1 0.1 0 M234 108 h100" />
          </g>
          <g ref={rainRef} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" strokeDasharray="6 10">
            <line x1="250" y1="130" x2="240" y2="170" />
            <line x1="280" y1="135" x2="270" y2="180" />
            <line x1="310" y1="130" x2="300" y2="170" />
            <line x1="340" y1="135" x2="330" y2="180" />
          </g>
          <g ref={rainBounceRef} stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" strokeDasharray="4 8">
            <line x1="600" y1="90" x2="590" y2="130" />
            <line x1="640" y1="95" x2="630" y2="135" />
            <line x1="680" y1="90" x2="670" y2="130" />
            <line x1="560" y1="95" x2="550" y2="135" />
            <line x1="720" y1="95" x2="710" y2="135" />
          </g>

          <path
            ref={pathRef}
            d={umbrellaPath}
            fill="none"
            stroke="var(--foreground)"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeDasharray="3 12"
          />

          <g ref={umbrellaRef}>
            <path
              d="M0 -130 C -35 -130 -60 -100 -65 -75 C -48 -85 -30 -85 -15 -75 C 0 -85 18 -85 35 -75 C 52 -85 70 -85 87 -75 C 82 -100 57 -130 0 -130 Z"
              fill="var(--primary)"
              stroke="var(--foreground)"
              strokeWidth="2.5"
              strokeLinejoin="round"
            />
            <line x1="0" y1="-75" x2="0" y2="-14" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" />
            <path d="M0 -14 q -14 10 -22 0" stroke="var(--foreground)" strokeWidth="3" strokeLinecap="round" fill="none" />
          </g>

          <g ref={confettiRef}>
            {confettiTicks.map((tick, index) => (
              <line
                key={index}
                id={`confetti-tick-${index}`}
                x1={tick.x}
                y1={tick.y}
                x2={tick.x + 14}
                y2={tick.y}
                stroke="var(--primary)"
                strokeWidth="4"
                strokeLinecap="round"
              />
            ))}
          </g>

          <g ref={characterRef} transform="translate(660 470)">
            <g ref={characterBobRef}>
              <circle cx="0" cy="-90" r="26" fill="var(--card)" stroke="var(--foreground)" strokeWidth="3" />
              <circle cx="-9" cy="-92" r="2.5" fill="var(--foreground)" />
              <circle cx="9" cy="-92" r="2.5" fill="var(--foreground)" />
              <path d="M-8 -80 q 8 6 16 0" fill="none" stroke="var(--foreground)" strokeWidth="2.5" strokeLinecap="round" />
              <line x1="0" y1="-64" x2="0" y2="30" stroke="var(--foreground)" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="0" y1="-30" x2="-32" y2="-4" stroke="var(--foreground)" strokeWidth="3.5" strokeLinecap="round" />
              <g ref={handRef}>
                <line x1="0" y1="-30" x2="34" y2="-64" stroke="var(--foreground)" strokeWidth="3.5" strokeLinecap="round" />
              </g>
              <line x1="0" y1="30" x2="-20" y2="80" stroke="var(--foreground)" strokeWidth="3.5" strokeLinecap="round" />
              <line x1="0" y1="30" x2="20" y2="80" stroke="var(--foreground)" strokeWidth="3.5" strokeLinecap="round" />
            </g>
          </g>

          <path
            d="M0 610 C 220 560, 400 650, 620 600 C 840 550, 1000 640, 1200 590 L 1200 700 L 0 700 Z"
            fill="var(--muted)"
          />
        </svg>

        {beats.map((beat, index) => (
          <p
            key={beat.number}
            ref={(node) => {
              captionRefs.current[index] = node;
            }}
            className="pointer-events-none absolute inset-x-0 bottom-16 mx-auto max-w-prose px-6 text-center font-display text-2xl text-balance md:bottom-24 md:text-3xl"
          >
            {beat.caption}
          </p>
        ))}
      </div>
    </section>
  );
}
