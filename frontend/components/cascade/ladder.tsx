"use client";

import { RungCard } from "@/components/cascade/rung-card";
import { useStaggerReveal } from "@/components/cascade/use-stagger-reveal";
import { ArrowRightDoodle } from "@/components/brand/icons";
import type { LadderModel } from "@/components/cascade/types";

type LadderProps = {
  ladder: LadderModel[];
  maxSteps: number;
  enabled: boolean;
  loading: boolean;
  onSelectRung: (rung: LadderModel) => void;
};

function railPath(height: number): string {
  return `M8 6 C11 ${height * 0.22} 5 ${height * 0.42} 8 ${height * 0.6} C10.5 ${height * 0.78} 5.5 ${height - 10} 8 ${height - 6}`;
}

function chevronOffsets(count: number, height: number): number[] {
  if (count <= 0) return [];
  const step = height / (count + 1);
  return Array.from({ length: count }, (_, i) => step * (i + 1));
}

export function Ladder({ ladder, maxSteps, enabled, loading, onSelectRung }: LadderProps) {
  const containerRef = useStaggerReveal<HTMLDivElement>(!loading, [ladder]);

  const sorted = [...ladder].sort(
    (a, b) => a.prompt_usd_per_1m - b.prompt_usd_per_1m
  );

  const activeOrder = new Map<string, number>();
  if (enabled) {
    const qualifying = sorted.filter(
      (rung) => rung.benchmark === null || rung.benchmark.passed
    );
    qualifying.slice(0, maxSteps).forEach((rung, i) => {
      activeOrder.set(rung.model, i + 1);
    });
  }

  const rungHeight = 44;
  const rungGap = 20;
  const railHeight =
    sorted.length > 0
      ? sorted.length * rungHeight + (sorted.length - 1) * rungGap + 24
      : rungHeight;

  return (
    <div className="doodle-card relative flex flex-col overflow-hidden rounded-2xl px-6 py-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl leading-none">the ladder</h2>
        <p className="flex items-center gap-1 text-xs font-semibold text-muted-foreground">
          cheapest wins
          <ArrowRightDoodle className="size-3 -rotate-90 text-primary" />
          coral climbed
        </p>
      </div>
      {loading ? (
        <div className="mt-4 flex flex-col gap-2.5">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="h-12 w-full animate-pulse rounded-xl border-2 border-border bg-muted"
            />
          ))}
        </div>
      ) : sorted.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No models configured.</p>
      ) : (
        <div className="relative mt-4 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
          <div ref={containerRef} className="relative flex flex-col px-7">
            <svg
              aria-hidden="true"
              viewBox={`0 0 16 ${railHeight}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute top-0 left-1 w-4 text-foreground"
              style={{ height: railHeight }}
            >
              <path d={railPath(railHeight)} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            <svg
              aria-hidden="true"
              viewBox={`0 0 16 ${railHeight}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute top-0 right-1 w-4 text-foreground"
              style={{ height: railHeight }}
            >
              <path d={railPath(railHeight)} stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>
            {chevronOffsets(4, railHeight).map((y) => (
              <svg
                key={y}
                aria-hidden="true"
                viewBox="0 0 24 24"
                className="pointer-events-none absolute left-1/2 size-4 -translate-x-1/2 text-primary/60"
                style={{ top: y - 8 }}
              >
                <polyline
                  points="5 15 12 8 19 15"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ))}
            <div
              className="relative flex flex-col-reverse gap-5"
              style={{ minHeight: railHeight - 24 }}
            >
              {sorted.map((rung) => (
                <RungCard
                  key={rung.model}
                  rung={rung}
                  active={activeOrder.has(rung.model)}
                  order={activeOrder.get(rung.model) ?? null}
                  onClick={() => onSelectRung(rung)}
                />
              ))}
            </div>
            <div className="relative flex items-center justify-center gap-1.5 pt-2 text-xs font-bold tracking-wide text-muted-foreground uppercase">
              <svg aria-hidden="true" viewBox="0 0 24 24" className="size-3.5 -rotate-90">
                <polyline
                  points="1.1 8.01 17.11 7.96 11.01 1.1 18.04 7.97 10.91 15.05"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2.4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              request starts here
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
