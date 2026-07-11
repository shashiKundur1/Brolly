"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";
import { Cloud1, Cloud2, Cloud3 } from "@/components/brand/scenes";
import { cn } from "@/lib/utils";
import type { CloudLayout, RainIntensity } from "@/components/usage/weather";

const CLOUD_COMPONENTS = [Cloud1, Cloud2, Cloud3];
const CLOUD_WIDTH = 100;
const CLOUD_HEIGHT = (CLOUD_WIDTH * 80) / 140;
const RAIN_HEIGHT = 20;

type CloudDoodleProps = {
  layout: CloudLayout;
  rain: RainIntensity;
  label: string;
  costLabel: string;
  selected: boolean;
  reducedMotion: boolean;
  onSelect: () => void;
};

export function CloudDoodle({
  layout,
  rain,
  label,
  costLabel,
  selected,
  reducedMotion,
  onSelect,
}: CloudDoodleProps) {
  const cloudRef = useRef<SVGGElement>(null);
  const rainRef = useRef<SVGGElement>(null);

  useEffect(() => {
    if (reducedMotion || !cloudRef.current) return;
    const tween = gsap.to(cloudRef.current, {
      y: 4,
      duration: 1.4,
      ease: "steps(4)",
      yoyo: true,
      repeat: -1,
      delay: layout.variant * 0.2,
    });
    return () => {
      tween.kill();
    };
  }, [reducedMotion, layout.variant]);

  useEffect(() => {
    if (reducedMotion || rain.streaks === 0 || !rainRef.current) return;
    const drops = Array.from(rainRef.current.children);
    const tweens = drops.map((node, i) =>
      gsap.fromTo(
        node,
        { y: -3, opacity: 0.35 },
        {
          y: 6,
          opacity: 1,
          duration: 0.55 / rain.speed,
          ease: "steps(3)",
          yoyo: true,
          repeat: -1,
          delay: i * 0.1,
        }
      )
    );
    return () => {
      tweens.forEach((t) => t.kill());
    };
  }, [reducedMotion, rain.streaks, rain.speed]);

  const CloudShape = CLOUD_COMPONENTS[layout.variant % CLOUD_COMPONENTS.length];
  const width = CLOUD_WIDTH * layout.scale;
  const height = CLOUD_HEIGHT * layout.scale;
  const rainCount = rain.streaks;
  const rainWidth = width * 0.66;
  const labelY = height + RAIN_HEIGHT + 18;

  return (
    <g
      transform={`translate(${layout.x - width / 2} ${layout.y - height / 2})`}
      role="button"
      tabIndex={0}
      aria-label={`${label}, ${costLabel} over 7 days`}
      aria-pressed={selected}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === "Enter" || event.key === " ") {
          event.preventDefault();
          onSelect();
        }
      }}
      style={{ cursor: "pointer", outline: "none" }}
    >
      <rect
        x={-8}
        y={-8}
        width={width + 16}
        height={labelY + 20}
        fill="transparent"
      />
      {selected && (
        <ellipse
          cx={width / 2}
          cy={height / 2}
          rx={width * 0.72}
          ry={height * 0.72}
          fill="var(--primary)"
          opacity={0.14}
        />
      )}
      <g ref={cloudRef}>
        <svg x={0} y={0} width={width} height={height}>
          <CloudShape className={cn("size-full", selected ? "text-primary" : "text-foreground")} />
        </svg>
      </g>
      {rainCount > 0 && (
        <g
          ref={rainRef}
          transform={`translate(${(width - rainWidth) / 2} ${height - 4})`}
        >
          {Array.from({ length: rainCount }).map((_, i) => {
            const spacing = rainWidth / Math.max(1, rainCount);
            const x = spacing * i + spacing / 2;
            return (
              <line
                key={i}
                x1={x}
                y1={0}
                x2={x - 3}
                y2={RAIN_HEIGHT}
                stroke="var(--secondary-foreground)"
                strokeWidth={2.5}
                strokeDasharray="4 4"
                strokeLinecap="round"
              />
            );
          })}
        </g>
      )}
      <text
        x={width / 2}
        y={labelY}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono, monospace)"
        fontSize={10}
        fill="var(--foreground)"
      >
        {label}
      </text>
      <text
        x={width / 2}
        y={labelY + 13}
        textAnchor="middle"
        fontFamily="var(--font-geist-mono, monospace)"
        fontSize={12}
        fontWeight={700}
        fill={selected ? "var(--primary)" : "var(--foreground)"}
      >
        {costLabel}
      </text>
    </g>
  );
}
