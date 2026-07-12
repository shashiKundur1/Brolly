"use client";

import { useMemo, useState } from "react";
import { ForecastStrip } from "@/components/usage/forecast-strip";
import { SkyCanvas } from "@/components/usage/sky-canvas";
import { ModelPills } from "@/components/usage/model-pills";
import { StatCell } from "@/components/usage/stat-cell";
import { LedgerList, JustHappenedList } from "@/components/usage/ledger-rail";
import { WeatherStationSkeleton } from "@/components/usage/weather-station-skeleton";
import { WeatherStationErrorState } from "@/components/usage/weather-station-error-state";
import { useUsageData } from "@/components/usage/use-usage-data";
import { useWeeklyBudget } from "@/components/usage/use-weekly-budget";
import {
  averageCostPerToken,
  lastNDays,
  rollupByModel,
  totalSpend,
  totalTokens,
} from "@/components/usage/types";

export default function DashboardPage() {
  const { summary, events, loading, error, refresh } = useUsageData();
  const [budget, setBudget] = useWeeklyBudget();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);

  const totals = useMemo(() => summary?.totals ?? [], [summary]);
  const modelRows = useMemo(() => rollupByModel(totals), [totals]);
  const dailySpend = useMemo(() => lastNDays(totals, 1), [totals]);
  const costPerToken = useMemo(() => averageCostPerToken(totals), [totals]);
  const spendToday = dailySpend.length > 0 ? dailySpend[dailySpend.length - 1].spend : 0;
  const projectedTokensPerHour = summary?.projectedTokensPerHour ?? 0;
  const projectedDailyCost = projectedTokensPerHour * 24 * costPerToken;
  const projectedWeeklySpend = projectedDailyCost * 7;
  const ready = summary !== null;

  const spend = useMemo(() => totalSpend(totals), [totals]);
  const tokens = useMemo(() => totalTokens(totals), [totals]);
  const requests = useMemo(
    () => totals.reduce((sum, t) => sum + (t.requests || 0), 0),
    [totals]
  );
  const cheapestPassing = modelRows.length > 0 ? modelRows[modelRows.length - 1] : null;
  const topModelRows = useMemo(() => modelRows.slice(0, 6), [modelRows]);

  const forecast = useMemo(() => {
    const percent = budget > 0 ? (projectedWeeklySpend / budget) * 100 : 0;
    if (percent > 80) {
      return { level: "storm" as const, label: "storm warning", trail: "by friday", percent, dailySpend: spendToday };
    }
    if (percent >= 40) {
      return { level: "drizzle" as const, label: "light drizzle", trail: "of budget", percent, dailySpend: spendToday };
    }
    return { level: "calm" as const, label: "clear skies", trail: "of budget", percent, dailySpend: spendToday };
  }, [budget, projectedWeeklySpend, spendToday]);

  const eventList = events ?? [];

  if (error && !summary) {
    return (
      <section className="doodle-border rounded-3xl bg-card p-8">
        <WeatherStationErrorState onRetry={refresh} />
      </section>
    );
  }

  if (loading && !summary) {
    return (
      <section className="doodle-border rounded-3xl bg-card p-8">
        <WeatherStationSkeleton />
      </section>
    );
  }

  return (
    <section className="doodle-border relative grid gap-4 overflow-hidden rounded-3xl bg-card p-4 md:gap-6 md:p-6">
      <img
        src="/brand/color/sticker-stars.svg"
        alt=""
        className="pointer-events-none absolute -right-4 top-24 hidden size-16 opacity-80 md:block"
        width={64}
        height={64}
      />
      <div className="grid grid-cols-1 gap-4 md:grid-cols-10 md:gap-6">
        <div className="doodle-card flex flex-col justify-center rounded-2xl px-6 py-5 md:col-span-7 md:px-8">
          <ForecastStrip
            forecast={forecast}
            budget={budget}
            onBudgetChange={setBudget}
            ready={ready}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-3 md:grid-cols-1 md:gap-6">
          <StatCell
            value={ready ? `${Math.round(forecast.percent)}%` : "0%"}
            label={
              forecast.trail === "of budget"
                ? "of weekly budget"
                : `of budget, ${forecast.trail}`
            }
            accent={forecast.level === "storm"}
            className="min-h-0"
          />
          <StatCell
            value={ready ? `$${spend.toFixed(2)}` : "$0.00"}
            label="total spend"
            icon="/brand/color/coins-color.svg"
            className="min-h-0"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-10 md:gap-6">
        <div className="doodle-card h-[22rem] overflow-hidden rounded-2xl bg-card p-4 md:col-span-7">
          <SkyCanvas totals={totals} forecastLevel={forecast.level} />
        </div>
        <div className="grid h-[22rem] grid-rows-2 gap-4 md:col-span-3 md:gap-6">
          <div className="doodle-card flex min-h-0 flex-col rounded-2xl px-5 py-4">
            <h2 className="mb-3 shrink-0 font-body text-sm font-semibold text-foreground">
              the ledger
            </h2>
            <LedgerList
              modelRows={modelRows}
              selectedModel={selectedModel}
              onSelectModel={setSelectedModel}
            />
          </div>
          <div className="doodle-card flex min-h-0 flex-col rounded-2xl px-5 py-4">
            <h2 className="mb-3 shrink-0 font-body text-sm font-semibold text-foreground">
              just happened
            </h2>
            <JustHappenedList events={eventList} />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-10 md:gap-6">
        <div className="doodle-card relative flex flex-col justify-center overflow-hidden rounded-2xl px-6 py-5 md:col-span-5">
          <h2 className="mb-4 font-body text-sm font-semibold text-foreground">
            top models in play
          </h2>
          <ModelPills
            modelRows={topModelRows}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
          <img
            src="/brand/color/balloon-umbrellas.svg"
            alt=""
            className="pointer-events-none absolute -bottom-3 -right-3 size-14 opacity-80"
            width={56}
            height={56}
          />
        </div>
        <div className="grid grid-cols-2 gap-4 md:col-span-5">
          <StatCell
            value={tokens.toLocaleString()}
            label="tokens processed"
            icon="/brand/color/chart-color.svg"
            className="min-h-0"
          />
          <StatCell value={requests.toLocaleString()} label="requests routed" className="min-h-0" />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8 border-t-2 border-border pt-6 md:grid-cols-2 md:gap-16">
        <div className="flex flex-col gap-2">
          <h3 className="font-body text-sm font-semibold text-foreground">
            Where your spend goes
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {modelRows.length > 0
              ? `${truncateModel(modelRows[0].model)} leads the bill at $${modelRows[0].cost.toFixed(2)}, routed through cost-cascade so cheaper tiers absorb the rest.`
              : "No spend yet — traffic will settle here as it arrives."}
          </p>
        </div>
        <div className="flex flex-col gap-2">
          <h3 className="font-body text-sm font-semibold text-foreground">
            Your cheapest passing model
          </h3>
          <p className="max-w-prose text-sm leading-relaxed text-muted-foreground">
            {cheapestPassing
              ? `${truncateModel(cheapestPassing.model)} is clearing requests at $${cheapestPassing.cost.toFixed(2)} total — the cascade's safety net when quality still checks out.`
              : "Once a cheap model earns its keep, it shows up here."}
          </p>
        </div>
      </div>
    </section>
  );
}

function truncateModel(model: string): string {
  if (typeof model !== "string") return "unknown";
  const parts = model.split("/");
  return parts.length > 1 ? parts[parts.length - 1] : model;
}
