"use client";

import { useId, useState } from "react";
import {
  CloudLightningIcon,
  CloudRainIcon,
  SunIcon,
} from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Forecast, ForecastLevel } from "@/components/usage/weather";

const LEVEL_ICON: Record<ForecastLevel, typeof SunIcon> = {
  calm: SunIcon,
  drizzle: CloudRainIcon,
  storm: CloudLightningIcon,
};

type ForecastStripProps = {
  forecast: Forecast;
  budget: number;
  onBudgetChange: (value: number) => void;
  ready: boolean;
};

export function ForecastStrip({
  forecast,
  budget,
  onBudgetChange,
  ready,
}: ForecastStripProps) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState("");
  const inputId = useId();
  const LevelIcon = LEVEL_ICON[forecast.level];
  const accent = forecast.level === "storm" ? "text-primary" : "text-foreground";

  const commitDraft = () => {
    const value = Number(draft);
    if (!Number.isNaN(value) && value > 0) {
      onBudgetChange(value);
    }
    setEditing(false);
    setDraft("");
  };

  return (
    <div className="flex w-full flex-wrap items-center justify-between gap-x-6 gap-y-2 rounded-xl border-2 border-border bg-card px-5 py-3">
      <div className="flex items-center gap-2">
        <LevelIcon size={22} weight="duotone" className={cn("shrink-0", accent)} />
        <p className={cn("font-display text-xl leading-none", accent)}>
          {ready ? forecast.label : "reading the sky…"}
        </p>
      </div>

      <div className="flex items-center gap-2 font-mono text-sm tabular-nums text-muted-foreground">
        <span>${ready ? forecast.dailySpend.toFixed(2) : "0.00"}/day</span>
        <span aria-hidden="true">·</span>
        <span
          className={cn("font-semibold", forecast.level === "storm" && "text-primary")}
        >
          {ready ? Math.round(forecast.percent) : 0}%
        </span>
        <span>{forecast.trail}</span>
      </div>

      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>budget</span>
        {editing ? (
          <Input
            id={inputId}
            type="number"
            min="1"
            step="1"
            autoFocus
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            onBlur={commitDraft}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitDraft();
            }}
            className="h-7 w-20 px-2 text-sm"
          />
        ) : (
          <button
            type="button"
            onClick={() => {
              setEditing(true);
              setDraft(String(budget));
            }}
            className="font-mono text-sm font-semibold text-foreground underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
            aria-label="Edit weekly budget"
          >
            ${budget.toFixed(0)}
          </button>
        )}
      </div>
    </div>
  );
}
