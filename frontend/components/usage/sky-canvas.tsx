"use client";

import { useEffect, useMemo, useState } from "react";
import { Hills, Sun, Umbrella, UmbrellaBlown } from "@/components/brand/scenes";
import { CloudDoodle } from "@/components/usage/cloud-doodle";
import {
  cloudFieldHeight,
  layoutClouds,
  rainIntensityFor,
  recentBurnByModel,
  totalRecentBurn,
  type ForecastLevel,
} from "@/components/usage/weather";
import type { ModelRollup, UsageEvent } from "@/components/usage/types";

const FIELD_WIDTH = 640;
const VIEW_WIDTH = 800;
const VIEW_HEIGHT = 420;
const FIELD_X = (VIEW_WIDTH - FIELD_WIDTH) / 2;
const FIELD_Y = 12;
const HILLS_HEIGHT = 90;
const HILLS_Y = VIEW_HEIGHT - HILLS_HEIGHT;
const FIELD_SLOT_HEIGHT = HILLS_Y - FIELD_Y - 4;
const UMBRELLA_WIDTH = 96;

type SkyCanvasProps = {
  modelRows: ModelRollup[];
  events: UsageEvent[];
  forecastLevel: ForecastLevel;
  selectedModel: string | null;
  onSelectModel: (model: string | null) => void;
};

export function SkyCanvas({
  modelRows,
  events,
  forecastLevel,
  selectedModel,
  onSelectModel,
}: SkyCanvasProps) {
  const [reducedMotion, setReducedMotion] = useState(
    () =>
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const listener = (e: MediaQueryListEvent) => setReducedMotion(e.matches);
    mq.addEventListener("change", listener);
    return () => mq.removeEventListener("change", listener);
  }, []);

  const layouts = useMemo(() => layoutClouds(modelRows, FIELD_WIDTH), [modelRows]);
  const contentHeight = useMemo(
    () => cloudFieldHeight(modelRows, FIELD_WIDTH),
    [modelRows]
  );
  const burnByModel = useMemo(() => recentBurnByModel(events), [events]);
  const noRecentBurn = totalRecentBurn(burnByModel) === 0;
  const UmbrellaShape = forecastLevel === "storm" ? UmbrellaBlown : Umbrella;

  return (
    <svg
      viewBox={`0 0 ${VIEW_WIDTH} ${VIEW_HEIGHT}`}
      className="h-full w-full"
      role="img"
      aria-label="Weather map of model spend, rendered as rain clouds"
    >
      <rect x="0" y="0" width={VIEW_WIDTH} height={VIEW_HEIGHT} fill="var(--muted)" />

      {noRecentBurn && (
        <svg x={VIEW_WIDTH - 116} y={20} width={72} height={72}>
          <Sun className="size-full text-accent" />
        </svg>
      )}

      <svg
        x={FIELD_X}
        y={FIELD_Y}
        width={FIELD_WIDTH}
        height={FIELD_SLOT_HEIGHT}
        viewBox={`0 0 ${FIELD_WIDTH} ${contentHeight}`}
        preserveAspectRatio="xMidYMin meet"
      >
        {layouts.length === 0 ? (
          <text
            x={FIELD_WIDTH / 2}
            y={contentHeight / 2}
            textAnchor="middle"
            fontFamily="var(--font-display)"
            fontSize={22}
            fill="var(--foreground)"
          >
            clear skies, no spend yet
          </text>
        ) : (
          layouts.map((layout) => (
            <CloudDoodle
              key={layout.model}
              layout={layout}
              rain={rainIntensityFor(layout.model, burnByModel)}
              label={truncateModel(layout.model)}
              costLabel={`$${layout.cost.toFixed(2)}`}
              selected={selectedModel === layout.model}
              reducedMotion={reducedMotion}
              onSelect={() =>
                onSelectModel(selectedModel === layout.model ? null : layout.model)
              }
            />
          ))
        )}
      </svg>

      <svg x={0} y={HILLS_Y} width={VIEW_WIDTH} height={HILLS_HEIGHT}>
        <Hills className="size-full text-foreground" />
      </svg>

      <svg
        x={(VIEW_WIDTH - UMBRELLA_WIDTH) / 2}
        y={HILLS_Y - UMBRELLA_WIDTH * 0.62}
        width={UMBRELLA_WIDTH}
        height={UMBRELLA_WIDTH}
      >
        <UmbrellaShape className="size-full" />
      </svg>
    </svg>
  );
}

function truncateModel(model: string): string {
  if (typeof model !== "string") return "unknown";
  const parts = model.split("/");
  return parts.length > 1 ? parts[parts.length - 1] : model;
}
