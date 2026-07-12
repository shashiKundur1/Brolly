"use client";

import { RungCard } from "@/components/cascade/rung-card";
import { useStaggerReveal } from "@/components/cascade/use-stagger-reveal";
import type { LadderModel } from "@/components/cascade/types";

type LadderProps = {
  ladder: LadderModel[];
  maxSteps: number;
  enabled: boolean;
  loading: boolean;
  onSelectRung: (rung: LadderModel) => void;
};

export function Ladder({ ladder, maxSteps, enabled, loading, onSelectRung }: LadderProps) {
  const containerRef = useStaggerReveal<HTMLDivElement>(!loading, [ladder]);

  const sorted = [...ladder].sort(
    (a, b) => a.prompt_usd_per_1m - b.prompt_usd_per_1m
  );

  let stepsUsed = 0;
  const activeModels = new Set<string>();
  if (enabled) {
    for (const rung of sorted) {
      if (stepsUsed >= maxSteps) break;
      stepsUsed += 1;
      if (rung.benchmark === null || rung.benchmark.passed) {
        activeModels.add(rung.model);
        if (rung.benchmark?.passed) break;
      }
    }
  }

  const rungsTopFirst = [...sorted].reverse();
  const rungHeight = 44;
  const rungGap = 8;
  const railHeight =
    rungsTopFirst.length > 0
      ? rungsTopFirst.length * rungHeight + (rungsTopFirst.length - 1) * rungGap
      : rungHeight;

  return (
    <div className="doodle-card flex h-full flex-col rounded-2xl px-6 py-6">
      <div className="flex items-baseline justify-between gap-2">
        <h2 className="font-display text-2xl leading-none">the ladder</h2>
        <p className="text-xs text-muted-foreground">cheapest wins, coral climbed</p>
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
      ) : rungsTopFirst.length === 0 ? (
        <p className="mt-3 text-sm text-muted-foreground">No models configured.</p>
      ) : (
        <div className="relative mt-4 pr-1" style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}>
          <div
            ref={containerRef}
            className="relative flex flex-col"
            style={{ minHeight: railHeight }}
          >
            <svg
              aria-hidden="true"
              viewBox={`0 0 24 ${railHeight}`}
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-y-0 left-3 h-full w-6 text-border"
            >
              <path
                d={`M4 4 C7 ${railHeight * 0.2} 1 ${railHeight * 0.4} 4 ${railHeight * 0.6} C6 ${railHeight * 0.8} 2 ${railHeight - 8} 4 ${railHeight - 4}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
              <path
                d={`M20 4 C17 ${railHeight * 0.2} 23 ${railHeight * 0.4} 20 ${railHeight * 0.6} C18 ${railHeight * 0.8} 22 ${railHeight - 8} 20 ${railHeight - 4}`}
                stroke="currentColor"
                strokeWidth="2"
                fill="none"
                strokeLinecap="round"
              />
            </svg>
            <div className="flex flex-col gap-2.5">
              {rungsTopFirst.map((rung) => (
                <RungCard
                  key={rung.model}
                  rung={rung}
                  active={activeModels.has(rung.model)}
                  onClick={() => onSelectRung(rung)}
                />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
