"use client";

import { useMemo, useState } from "react";
import { ForecastStrip } from "@/components/usage/forecast-strip";
import { SkyCanvas } from "@/components/usage/sky-canvas";
import { LedgerRail } from "@/components/usage/ledger-rail";
import { WeatherStationSkeleton } from "@/components/usage/weather-station-skeleton";
import { WeatherStationErrorState } from "@/components/usage/weather-station-error-state";
import { useUsageData } from "@/components/usage/use-usage-data";
import { useWeeklyBudget } from "@/components/usage/use-weekly-budget";
import { useViewportFit } from "@/components/usage/use-viewport-fit";
import { computeForecast } from "@/components/usage/weather";
import {
  averageCostPerToken,
  lastNDays,
  rollupByModel,
} from "@/components/usage/types";

export default function DashboardPage() {
  const { summary, events, loading, error, refresh } = useUsageData();
  const [budget, setBudget] = useWeeklyBudget();
  const [selectedModel, setSelectedModel] = useState<string | null>(null);
  const navHeight = useViewportFit();
  const frameStyle = {
    "--frame-height": `calc(100svh - ${navHeight}px)`,
  } as React.CSSProperties;

  const totals = useMemo(() => summary?.totals ?? [], [summary]);
  const modelRows = useMemo(() => rollupByModel(totals), [totals]);
  const dailySpend = useMemo(() => lastNDays(totals, 1), [totals]);
  const costPerToken = useMemo(() => averageCostPerToken(totals), [totals]);
  const spendToday = dailySpend.length > 0 ? dailySpend[dailySpend.length - 1].spend : 0;
  const projectedTokensPerHour = summary?.projectedTokensPerHour ?? 0;
  const projectedDailyCost = projectedTokensPerHour * 24 * costPerToken;
  const projectedWeeklySpend = projectedDailyCost * 7;
  const ready = summary !== null;

  const forecast = useMemo(
    () => computeForecast(spendToday, projectedWeeklySpend, budget),
    [spendToday, projectedWeeklySpend, budget]
  );

  const eventList = events ?? [];

  if (error && !summary) {
    return (
      <section
        className="grid min-h-0 grid-rows-1 max-sm:h-auto sm:h-(--frame-height)"
        style={frameStyle}
      >
        <WeatherStationErrorState onRetry={refresh} />
      </section>
    );
  }

  if (loading && !summary) {
    return (
      <section
        className="min-h-0 py-4 max-sm:h-auto sm:h-(--frame-height)"
        style={frameStyle}
      >
        <WeatherStationSkeleton />
      </section>
    );
  }

  return (
    <section
      className="grid min-h-0 grid-rows-[auto_1fr] gap-6 py-4 max-sm:h-auto sm:h-(--frame-height)"
      style={frameStyle}
    >
      <ForecastStrip
        forecast={forecast}
        budget={budget}
        onBudgetChange={setBudget}
        ready={ready}
      />
      <div className="grid min-h-0 grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="doodle-border h-80 overflow-hidden rounded-2xl bg-muted sm:h-auto sm:min-h-0 lg:col-span-2">
          <SkyCanvas
            modelRows={modelRows}
            events={eventList}
            forecastLevel={forecast.level}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
        <div className="min-h-0">
          <LedgerRail
            modelRows={modelRows}
            events={eventList}
            selectedModel={selectedModel}
            onSelectModel={setSelectedModel}
          />
        </div>
      </div>
    </section>
  );
}
