"use client";

import { useMemo } from "react";
import { recentBurnByModel, totalRecentBurn, type ForecastLevel } from "@/components/usage/weather";
import type { UsageEvent } from "@/components/usage/types";

type SkyCanvasProps = {
  events: UsageEvent[];
  forecastLevel: ForecastLevel;
};

export function SkyCanvas({ events, forecastLevel }: SkyCanvasProps) {
  const burnByModel = useMemo(() => recentBurnByModel(events), [events]);
  const isRaining = totalRecentBurn(burnByModel) > 0;

  return (
    <div className="relative size-full overflow-hidden">
      <img
        src="/brand/color/hero-spend-chart.svg"
        alt="Spend chart with a coin and an umbrella shielding falling coins, representing cost protection"
        className="absolute size-full object-contain"
        style={{ transform: "scale(1.6)" }}
        width={1024}
        height={1024}
        loading="eager"
        data-forecast={forecastLevel}
      />
      {isRaining && (
        <img
          src="/brand/color/rain-color.svg"
          alt=""
          className="absolute top-4 right-4 size-12 md:size-16"
          width={64}
          height={64}
        />
      )}
    </div>
  );
}
