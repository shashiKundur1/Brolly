"use client";

import { useId, useState } from "react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import type { Forecast, ForecastLevel } from "@/components/usage/weather";

const LEVEL_COPY: Record<ForecastLevel, string> = {
  calm: "spend is calm this week",
  drizzle: "spend is picking up",
  storm: "spend is running hot",
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
    <div className="flex h-full flex-col justify-center gap-3">
      <p className={cn("font-display text-4xl leading-none md:text-5xl", accent)}>
        {ready ? forecast.label : "reading the sky…"}
      </p>
      <p className="max-w-sm text-sm text-muted-foreground">
        {ready ? LEVEL_COPY[forecast.level] : "waiting for live traffic"} · $
        {ready ? forecast.dailySpend.toFixed(2) : "0.00"}/day
      </p>
      <div className="flex items-center gap-2 text-sm text-muted-foreground">
        <span>weekly budget</span>
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
