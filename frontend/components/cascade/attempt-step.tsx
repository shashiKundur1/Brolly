"use client";

import { CheckIcon, CloudRainIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { ChatAttempt } from "@/components/cascade/types";

type AttemptStepProps = {
  attempt: ChatAttempt;
  reveal: boolean;
};

export function AttemptStep({ attempt, reveal }: AttemptStepProps) {
  return (
    <div
      data-reveal
      className={cn(
        "flex items-center justify-between gap-3 rounded-lg px-2.5 py-1.5 motion-safe:transition-transform",
        attempt.ok ? "doodle-shadow bg-card" : "doodle-border -rotate-2 bg-card",
        !reveal && "opacity-0"
      )}
    >
      <span className="flex items-center gap-2">
        {attempt.ok ? (
          <CheckIcon size={16} weight="bold" className="text-secondary-foreground" />
        ) : (
          <CloudRainIcon size={16} weight="duotone" className="text-primary" />
        )}
        <span className="font-mono text-xs tabular-nums">{attempt.model}</span>
      </span>
      {attempt.ok ? (
        <span className="rounded-full border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
          picked
        </span>
      ) : (
        <span className="rounded-full border-2 border-dashed border-border px-2 py-0.5 text-xs text-muted-foreground">
          {attempt.reason || "failed"}
        </span>
      )}
    </div>
  );
}
