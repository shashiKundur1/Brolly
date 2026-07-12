"use client";

import { CheckDoodle, CrossDoodle } from "@/components/brand/icons";
import { cn } from "@/lib/utils";
import { formatUsd, type LadderModel } from "@/components/cascade/types";

type RungCardProps = {
  rung: LadderModel;
  active: boolean;
  order: number | null;
  tilt: number;
  onClick: () => void;
};

const TIER_ACTIVE: Record<number, string> = {
  1: "bg-secondary text-secondary-foreground",
  2: "bg-accent text-accent-foreground",
  3: "bg-primary/25 text-foreground",
};

const TIER_INACTIVE: Record<number, string> = {
  1: "bg-secondary/45 text-foreground/75",
  2: "bg-accent/45 text-foreground/75",
  3: "bg-primary/20 text-foreground/75",
};

const TIER_CIRCLE: Record<number, string> = {
  1: "bg-secondary text-secondary-foreground",
  2: "bg-accent text-accent-foreground",
  3: "bg-primary/30 text-foreground",
};

export function RungCard({ rung, active, order, tilt, onClick }: RungCardProps) {
  const benchmark = rung.benchmark;
  const fillClass = active
    ? (TIER_ACTIVE[rung.tier] ?? TIER_ACTIVE[1])
    : (TIER_INACTIVE[rung.tier] ?? TIER_INACTIVE[1]);
  const circleClass = TIER_CIRCLE[rung.tier] ?? TIER_CIRCLE[1];

  return (
    <button
      type="button"
      data-reveal
      onClick={onClick}
      style={{ transform: `rotate(${tilt}deg)` }}
      className={cn(
        "doodle-press-sm relative flex w-full shrink-0 origin-center items-center justify-between gap-3 rounded-xl border-foreground px-3.5 py-2.5 text-left motion-safe:transition-transform motion-safe:duration-150",
        fillClass,
        active
          ? "scale-100 ring-2 ring-primary ring-offset-2 ring-offset-card"
          : "scale-[0.92] hover:scale-[0.97] hover:opacity-90"
      )}
    >
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 -left-3 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground",
          active ? "bg-primary" : "bg-card"
        )}
      />
      <span
        aria-hidden="true"
        className={cn(
          "absolute top-1/2 -right-3 h-2.5 w-2.5 translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-foreground",
          active ? "bg-primary" : "bg-card"
        )}
      />
      {active && order !== null && (
        <span
          aria-hidden="true"
          style={{ transform: "rotate(-10deg)" }}
          className="doodle-press-sm absolute -top-3 left-5 z-10 flex size-6 items-center justify-center rounded-full bg-primary font-mono text-xs font-bold tabular-nums text-primary-foreground"
        >
          {order}
        </span>
      )}
      <span className="flex min-w-0 flex-1 items-center justify-between gap-3">
        <span className="flex min-w-0 items-center gap-2">
          <span
            className={cn(
              "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-xs font-bold tabular-nums",
              circleClass
            )}
          >
            {rung.tier}
          </span>
          <span className="truncate font-mono text-xs font-semibold tabular-nums">{rung.model}</span>
          {active && (
            <span
              style={{ transform: "rotate(-2deg)" }}
              className="hidden shrink-0 rounded-full border-2 border-foreground bg-primary px-1.5 py-0.5 font-mono text-[10px] font-bold tracking-wide text-primary-foreground uppercase sm:inline"
            >
              in rotation
            </span>
          )}
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="hidden font-mono text-xs font-semibold tabular-nums sm:inline">
            {formatUsd(rung.prompt_usd_per_1m)}/{formatUsd(rung.completion_usd_per_1m)}
          </span>
          {benchmark === null ? (
            <span className="rounded-full border-2 border-foreground bg-card px-2 py-0.5 text-xs text-muted-foreground">
              untested
            </span>
          ) : (
            <span
              style={{ transform: "rotate(-2deg)" }}
              className={cn(
                "flex items-center gap-1 rounded-full border-2 border-foreground px-2 py-0.5 font-mono text-xs font-bold tabular-nums",
                benchmark.passed
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground"
              )}
            >
              {benchmark.passed ? (
                <CheckDoodle className="size-3" />
              ) : (
                <CrossDoodle className="size-3" />
              )}
              {benchmark.score}/{benchmark.total}
            </span>
          )}
        </span>
      </span>
    </button>
  );
}
