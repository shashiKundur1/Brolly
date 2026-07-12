import type { ModelRollup, UsageEvent } from "@/components/usage/types";

export type ForecastLevel = "calm" | "drizzle" | "storm";

export type Forecast = {
  level: ForecastLevel;
  label: string;
  trail: string;
  percent: number;
  dailySpend: number;
};

export function computeForecast(
  dailySpend: number,
  projectedWeeklySpend: number,
  budget: number
): Forecast {
  const percent = budget > 0 ? (projectedWeeklySpend / budget) * 100 : 0;

  if (percent > 80) {
    return {
      level: "storm",
      label: "storm warning",
      trail: "by friday",
      percent,
      dailySpend,
    };
  }

  if (percent >= 40) {
    return {
      level: "drizzle",
      label: "light drizzle",
      trail: "of budget",
      percent,
      dailySpend,
    };
  }

  return {
    level: "calm",
    label: "clear skies",
    trail: "of budget",
    percent,
    dailySpend,
  };
}

export type CloudLayout = {
  model: string;
  x: number;
  y: number;
  scale: number;
  variant: number;
  cost: number;
  share: number;
};

const CLOUD_MIN_SCALE = 0.32;
const CLOUD_MAX_SCALE = 1.05;
const CLOUD_VARIANTS = 3;
const CLOUD_ASPECT = 80 / 140;

function hashModel(model: string): number {
  let hash = 0;
  for (let i = 0; i < model.length; i++) {
    hash = (hash * 31 + model.charCodeAt(i)) >>> 0;
  }
  return hash;
}

const CLOUD_BASE_WIDTH = 100;
const ROW_GAP = 30;
const LABEL_HEIGHT = 32;
const RAIN_ZONE_HEIGHT = 20;
const CLOUDS_PER_ROW = 5;

function scaleFor(cost: number, minCost: number, costSpread: number): number {
  const ratio = costSpread > 0 ? (cost - minCost) / costSpread : 1;
  return CLOUD_MIN_SCALE + (CLOUD_MAX_SCALE - CLOUD_MIN_SCALE) * ratio;
}

function buildRows<T extends { cost: number }>(
  spending: T[]
): T[][] {
  const rows: T[][] = [];
  for (let i = 0; i < spending.length; i += CLOUDS_PER_ROW) {
    rows.push(spending.slice(i, i + CLOUDS_PER_ROW));
  }
  return rows;
}

export function cloudFieldHeight(
  rows: ModelRollup[],
  fieldWidth: number
): number {
  const spending = [...rows].filter((r) => r.cost > 0).sort((a, b) => b.cost - a.cost);
  if (spending.length === 0) return CLOUD_BASE_WIDTH;

  const maxCost = spending[0].cost;
  const minCost = spending[spending.length - 1].cost;
  const costSpread = maxCost - minCost;
  const cellW = fieldWidth / CLOUDS_PER_ROW;
  const rowGroups = buildRows(spending);

  return rowGroups.reduce((total, group) => {
    const rowMaxScale = Math.max(
      ...group.map((r) => scaleFor(r.cost, minCost, costSpread))
    );
    return (
      total +
      cellW * rowMaxScale * CLOUD_ASPECT +
      RAIN_ZONE_HEIGHT +
      LABEL_HEIGHT +
      ROW_GAP
    );
  }, 0);
}

export function layoutClouds(
  rows: ModelRollup[],
  fieldWidth: number
): CloudLayout[] {
  const spending = [...rows].filter((r) => r.cost > 0).sort((a, b) => b.cost - a.cost);
  if (spending.length === 0) return [];

  const maxCost = spending[0].cost;
  const minCost = spending[spending.length - 1].cost;
  const totalCost = spending.reduce((sum, r) => sum + r.cost, 0);
  const costSpread = maxCost - minCost;
  const cellW = fieldWidth / CLOUDS_PER_ROW;
  const rowGroups = buildRows(spending);

  const layouts: CloudLayout[] = [];
  let yCursor = 0;

  for (const group of rowGroups) {
    const rowMaxScale = Math.max(
      ...group.map((r) => scaleFor(r.cost, minCost, costSpread))
    );
    const rowH =
      cellW * rowMaxScale * CLOUD_ASPECT + RAIN_ZONE_HEIGHT + LABEL_HEIGHT + ROW_GAP;

    group.forEach((r, col) => {
      const scale = scaleFor(r.cost, minCost, costSpread);
      const jitterSeed = hashModel(r.model);
      const jitterX = ((jitterSeed % 11) - 5) * 0.4;

      layouts.push({
        model: r.model,
        x: cellW * col + cellW / 2 + jitterX,
        y: yCursor + (rowH - RAIN_ZONE_HEIGHT - LABEL_HEIGHT) / 2,
        scale,
        variant: jitterSeed % CLOUD_VARIANTS,
        cost: r.cost,
        share: totalCost > 0 ? r.cost / totalCost : 0,
      });
    });

    yCursor += rowH;
  }

  return layouts;
}

const HERO_CLOUD_COUNT = 5;
const HERO_MIN_SCALE = 0.5;
const HERO_MAX_SCALE = 1.15;

export function layoutHeroClouds(
  rows: ModelRollup[],
  fieldWidth: number,
  floorY: number
): CloudLayout[] {
  const spending = [...rows]
    .filter((r) => r.cost > 0)
    .sort((a, b) => b.cost - a.cost)
    .slice(0, HERO_CLOUD_COUNT);
  if (spending.length === 0) return [];

  const maxCost = spending[0].cost;
  const minCost = spending[spending.length - 1].cost;
  const totalCost = spending.reduce((sum, r) => sum + r.cost, 0);
  const costSpread = maxCost - minCost;
  const count = spending.length;
  const laneW = fieldWidth / count;
  const topY = floorY * 0.22;
  const bottomY = floorY * 0.5;

  return spending.map((r, i) => {
    const ratio = costSpread > 0 ? (r.cost - minCost) / costSpread : 1;
    const scale = HERO_MIN_SCALE + (HERO_MAX_SCALE - HERO_MIN_SCALE) * ratio;
    const jitterSeed = hashModel(r.model);
    const jitterX = ((jitterSeed % 11) - 5) * 0.6;
    const jitterY = ((jitterSeed >> 3) % 7) * 3;

    return {
      model: r.model,
      x: laneW * i + laneW / 2 + jitterX,
      y: topY + (bottomY - topY) * (1 - ratio) + jitterY,
      scale,
      variant: jitterSeed % CLOUD_VARIANTS,
      cost: r.cost,
      share: totalCost > 0 ? r.cost / totalCost : 0,
    };
  });
}

export type RainIntensity = {
  model: string;
  streaks: number;
  speed: number;
};

const RECENT_WINDOW_MS = 10 * 60 * 1000;

export function recentBurnByModel(events: UsageEvent[]): Map<string, number> {
  const cutoff = Date.now() - RECENT_WINDOW_MS;
  const burn = new Map<string, number>();
  for (const e of events) {
    if (typeof e.model !== "string" || e.model.length === 0) continue;
    const t = new Date(e.ts).getTime();
    if (Number.isNaN(t) || t < cutoff) continue;
    const tokens = (e.prompt_tokens || 0) + (e.completion_tokens || 0);
    burn.set(e.model, (burn.get(e.model) ?? 0) + tokens);
  }
  return burn;
}

export function rainIntensityFor(
  model: string,
  burnByModel: Map<string, number>
): RainIntensity {
  const maxBurn = Math.max(1, ...burnByModel.values());
  const burn = burnByModel.get(model) ?? 0;
  const ratio = burn / maxBurn;
  const streaks = burn > 0 ? Math.max(1, Math.round(ratio * 5)) : 0;
  const speed = 0.8 + ratio * 1.2;
  return { model, streaks, speed };
}

export function totalRecentBurn(burnByModel: Map<string, number>): number {
  let total = 0;
  for (const v of burnByModel.values()) total += v;
  return total;
}

export type CollapsedEvent = UsageEvent & { count: number };

export function collapseConsecutiveEvents(events: UsageEvent[]): CollapsedEvent[] {
  const collapsed: CollapsedEvent[] = [];
  for (const e of events) {
    const last = collapsed[collapsed.length - 1];
    if (
      last &&
      last.model === e.model &&
      last.prompt_tokens === e.prompt_tokens &&
      last.completion_tokens === e.completion_tokens &&
      last.ok === e.ok &&
      (last.cascade_step ?? 0) === (e.cascade_step ?? 0) &&
      last.reason === e.reason
    ) {
      last.count += 1;
    } else {
      collapsed.push({ ...e, count: 1 });
    }
  }
  return collapsed;
}
