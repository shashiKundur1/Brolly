"use client";

import { useId, useMemo } from "react";
import { lastNDays, type UsageTotal } from "@/components/usage/types";
import type { ForecastLevel } from "@/components/usage/weather";

type SkyCanvasProps = {
  totals: UsageTotal[];
  forecastLevel: ForecastLevel;
};

const CHART_WIDTH = 560;
const CHART_HEIGHT = 300;
const PADDING_TOP = 34;
const PADDING_BOTTOM = 46;
const PADDING_X = 20;
const BAR_GAP = 18;
const MIN_BAR_HEIGHT = 6;
const PLOT_HEIGHT = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;

const DAY_LABELS = ["sun", "mon", "tue", "wed", "thu", "fri", "sat"];

function dayLabel(day: string): string {
  const parsed = new Date(`${day}T00:00:00Z`);
  if (Number.isNaN(parsed.getTime())) return day;
  return DAY_LABELS[parsed.getUTCDay()];
}

function formatCost(value: number): string {
  if (value === 0) return "$0";
  if (value < 0.01) return `$${value.toFixed(3)}`;
  if (value < 1) return `$${value.toFixed(2)}`;
  return `$${value.toFixed(2)}`;
}

export function SkyCanvas({ totals, forecastLevel }: SkyCanvasProps) {
  const roughId = useId();
  const days = useMemo(() => lastNDays(totals, 7), [totals]);
  const weekTotal = useMemo(
    () => days.reduce((sum, d) => sum + d.spend, 0),
    [days]
  );
  const maxSpend = Math.max(0, ...days.map((d) => d.spend));
  const hasSpend = weekTotal > 0;

  const barWidth =
    days.length > 0
      ? (CHART_WIDTH - PADDING_X * 2 - BAR_GAP * (days.length - 1)) / days.length
      : 0;

  return (
    <div className="relative flex size-full flex-col gap-2 overflow-hidden">
      <svg width={0} height={0} aria-hidden="true">
        <filter id={roughId}>
          <feTurbulence
            type="fractalNoise"
            baseFrequency="0.02"
            numOctaves={2}
            seed={4}
            result="noise"
          />
          <feDisplacementMap in="SourceGraphic" in2="noise" scale={2.4} />
        </filter>
      </svg>
      <div className="flex shrink-0 items-baseline justify-between gap-3 px-1">
        <h2 className="font-display text-2xl leading-none text-foreground md:text-3xl">
          spend, last 7 days
        </h2>
        <p className="font-mono text-lg font-bold tabular-nums leading-none text-foreground">
          {formatCost(weekTotal)}
        </p>
      </div>
      <div className="relative min-h-0 flex-1">
        <img
          src="/brand/color/umbrella-icon-color.svg"
          alt=""
          className="pointer-events-none absolute top-1 right-1 size-9 opacity-90 md:size-11"
          width={44}
          height={44}
        />
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="size-full"
          role="img"
          aria-label={
            hasSpend
              ? `Bar chart of spend over the last 7 days, totaling ${formatCost(weekTotal)}`
              : "No spend recorded in the last 7 days"
          }
          preserveAspectRatio="xMidYMid meet"
        >
          <line
            x1={PADDING_X}
            y1={CHART_HEIGHT - PADDING_BOTTOM}
            x2={CHART_WIDTH - PADDING_X}
            y2={CHART_HEIGHT - PADDING_BOTTOM}
            stroke="var(--foreground)"
            strokeWidth={2}
            strokeLinecap="round"
          />
          {days.map((d, i) => {
            const isMax = hasSpend && d.spend === maxSpend;
            const barHeight = hasSpend
              ? Math.max(MIN_BAR_HEIGHT, (d.spend / maxSpend) * (PLOT_HEIGHT - 24))
              : MIN_BAR_HEIGHT;
            const x = PADDING_X + i * (barWidth + BAR_GAP);
            const y = CHART_HEIGHT - PADDING_BOTTOM - barHeight;
            return (
              <g key={d.day}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={barHeight}
                  rx={6}
                  fill={
                    !hasSpend
                      ? "var(--muted)"
                      : isMax
                        ? "var(--primary)"
                        : "var(--secondary)"
                  }
                  stroke="var(--foreground)"
                  strokeWidth={2}
                  style={{ filter: `url(#${roughId})` }}
                />
                {hasSpend && (
                  <text
                    x={x + barWidth / 2}
                    y={y - 8}
                    textAnchor="middle"
                    className="font-mono text-[11px] font-bold md:text-xs"
                    fill="var(--foreground)"
                    style={{ fontVariantNumeric: "tabular-nums" }}
                  >
                    {formatCost(d.spend)}
                  </text>
                )}
                <text
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT - PADDING_BOTTOM + 22}
                  textAnchor="middle"
                  className="font-body text-[11px] md:text-sm"
                  fill="var(--muted-foreground)"
                >
                  {dayLabel(d.day)}
                </text>
              </g>
            );
          })}
        </svg>
        {!hasSpend && (
          <p className="pointer-events-none absolute inset-x-0 top-1/3 text-center font-display text-xl text-muted-foreground md:text-2xl">
            clear skies, no spend yet
          </p>
        )}
      </div>
    </div>
  );
}
