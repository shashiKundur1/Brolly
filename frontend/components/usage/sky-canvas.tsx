"use client";

import { useMemo } from "react";
import { InlineBrandSvg } from "@/components/usage/inline-brand-svg";
import { recentBurnByModel, totalRecentBurn, type ForecastLevel } from "@/components/usage/weather";
import { cn } from "@/lib/utils";
import type { UsageEvent } from "@/components/usage/types";

type SkyCanvasProps = {
  events: UsageEvent[];
  forecastLevel: ForecastLevel;
};

export function SkyCanvas({ events, forecastLevel }: SkyCanvasProps) {
  const burnByModel = useMemo(() => recentBurnByModel(events), [events]);
  const isRaining = totalRecentBurn(burnByModel) > 0;

  return (
    <div className="relative size-full">
      <InlineBrandSvg
        src="/brand/bento/hero-umbrella-hills.svg"
        className={cn(
          "block size-full [&_svg]:size-full",
          forecastLevel === "storm" ? "text-primary" : "text-foreground"
        )}
      />
      {isRaining && (
        <InlineBrandSvg
          src="/brand/bento/rain-cloud.svg"
          className="absolute top-4 right-4 size-12 text-secondary-foreground [&_svg]:size-full md:size-16"
        />
      )}
    </div>
  );
}
