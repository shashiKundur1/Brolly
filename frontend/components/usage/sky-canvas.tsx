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
    <div className="relative flex size-full items-center justify-center">
      <img
        src="/brand/color/hero-scene-color.svg"
        alt=""
        className="h-full max-h-full w-auto max-w-full object-contain"
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
