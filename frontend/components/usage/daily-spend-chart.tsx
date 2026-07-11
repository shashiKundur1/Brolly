"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type DailySpendChartProps = {
  days: { day: string; spend: number }[];
  dailyBudget: number;
};

const CHART_WIDTH = 640;
const CHART_HEIGHT = 240;
const PADDING_LEFT = 48;
const PADDING_BOTTOM = 32;
const PADDING_TOP = 16;
const GRID_LINES = 4;

function formatDayLabel(day: string): string {
  const date = new Date(`${day}T00:00:00`);
  return date.toLocaleDateString(undefined, { weekday: "short" });
}

export function DailySpendChart({ days, dailyBudget }: DailySpendChartProps) {
  const maxSpend = Math.max(...days.map((d) => d.spend), dailyBudget, 0.01);
  const plotWidth = CHART_WIDTH - PADDING_LEFT - 16;
  const plotHeight = CHART_HEIGHT - PADDING_TOP - PADDING_BOTTOM;
  const barSlot = days.length > 0 ? plotWidth / days.length : plotWidth;
  const barWidth = barSlot * 0.55;

  return (
    <Card className="doodle-border h-full">
      <CardHeader>
        <CardTitle>Daily spend</CardTitle>
        <CardDescription>Last 7 days, ink bars on paper.</CardDescription>
      </CardHeader>
      <CardContent>
        <svg
          viewBox={`0 0 ${CHART_WIDTH} ${CHART_HEIGHT}`}
          className="h-auto w-full"
          role="img"
          aria-label="Daily spend over the last 7 days"
        >
          {Array.from({ length: GRID_LINES + 1 }).map((_, index) => {
            const y = PADDING_TOP + (plotHeight / GRID_LINES) * index;
            const value = maxSpend * (1 - index / GRID_LINES);
            return (
              <g key={index}>
                <line
                  x1={PADDING_LEFT}
                  y1={y}
                  x2={CHART_WIDTH - 16}
                  y2={y}
                  stroke="var(--border)"
                  strokeWidth={1}
                  strokeDasharray="4 4"
                />
                <text
                  x={PADDING_LEFT - 8}
                  y={y + 4}
                  textAnchor="end"
                  fontFamily="var(--font-display)"
                  fontSize={14}
                  fill="var(--muted-foreground)"
                >
                  ${value.toFixed(0)}
                </text>
              </g>
            );
          })}
          {days.map((entry, index) => {
            const barHeight = (entry.spend / maxSpend) * plotHeight;
            const x = PADDING_LEFT + barSlot * index + (barSlot - barWidth) / 2;
            const y = PADDING_TOP + plotHeight - barHeight;
            const overBudget = entry.spend > dailyBudget;
            return (
              <g key={entry.day}>
                <rect
                  x={x}
                  y={y}
                  width={barWidth}
                  height={Math.max(barHeight, 1)}
                  rx={6}
                  fill={overBudget ? "var(--primary)" : "var(--foreground)"}
                />
                <text
                  x={x + barWidth / 2}
                  y={CHART_HEIGHT - PADDING_BOTTOM + 20}
                  textAnchor="middle"
                  fontFamily="var(--font-display)"
                  fontSize={16}
                  fill="var(--foreground)"
                >
                  {formatDayLabel(entry.day)}
                </text>
              </g>
            );
          })}
        </svg>
      </CardContent>
    </Card>
  );
}
