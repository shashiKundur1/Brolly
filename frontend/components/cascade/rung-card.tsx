"use client";

import { cn } from "@/lib/utils";
import { formatUsd, type LadderModel } from "@/components/cascade/types";

type RungCardProps = {
  rung: LadderModel;
  active: boolean;
  onClick: () => void;
};

const TIER_FILL: Record<string, string> = {
  "1": "bg-secondary text-secondary-foreground",
  "2": "bg-accent text-accent-foreground",
  "3": "bg-muted text-foreground",
};

export function RungCard({ rung, active, onClick }: RungCardProps) {
  const benchmark = rung.benchmark;
  const tierClass = TIER_FILL[rung.tier] ?? "bg-secondary";

  return (
    <button
      type="button"
      data-reveal
      onClick={onClick}
      className={cn(
        "doodle-press-sm relative ml-9 flex shrink-0 items-center justify-between gap-3 rounded-xl bg-card px-3 py-2 text-left motion-safe:transition-opacity",
        active ? "opacity-100" : "opacity-45 hover:opacity-70"
      )}
    >
      <span
        aria-hidden="true"
        className="absolute top-1/2 -left-6 h-0.5 w-6 -translate-y-1/2 bg-border"
      />
      <span className="flex min-w-0 items-center gap-2">
        <span
          className={cn(
            "flex size-6 shrink-0 items-center justify-center rounded-full border-2 border-foreground text-xs font-bold tabular-nums",
            tierClass
          )}
        >
          {rung.tier}
        </span>
        <span className="truncate font-mono text-xs tabular-nums">{rung.model}</span>
      </span>
      <span className="flex shrink-0 items-center gap-2">
        <span className="hidden font-mono text-xs tabular-nums text-muted-foreground sm:inline">
          {formatUsd(rung.prompt_usd_per_1m)}/{formatUsd(rung.completion_usd_per_1m)}
        </span>
        {benchmark === null ? (
          <span className="rounded-full border-2 border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground">
            untested
          </span>
        ) : (
          <span
            className={cn(
              "-rotate-2 rounded-full border-2 border-foreground px-2 py-0.5 font-mono text-xs font-bold tabular-nums",
              benchmark.passed
                ? "bg-secondary text-secondary-foreground"
                : "bg-primary text-primary-foreground"
            )}
          >
            {benchmark.score}/{benchmark.total}
          </span>
        )}
      </span>
    </button>
  );
}
