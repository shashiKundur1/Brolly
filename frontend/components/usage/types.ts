export type UsageTotal = {
  model: string;
  day: string;
  requests: number;
  prompt_tokens: number;
  completion_tokens: number;
  est_cost_usd: number;
};

export type UsageSummary = {
  totals: UsageTotal[];
  burnRate: number;
  projectedTokensPerHour: number;
};

export type UsageEvent = {
  ts: string;
  model: string;
  prompt_tokens: number;
  completion_tokens: number;
  latency_ms: number;
  stream: boolean;
  ok: boolean;
  cascade_step?: number;
  session_id?: string;
  reason?: string;
};

export type ModelRollup = {
  model: string;
  requests: number;
  tokens: number;
  cost: number;
};

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export async function fetchUsageSummary(signal?: AbortSignal): Promise<UsageSummary> {
  const res = await fetch(`${API_BASE}/api/usage/summary`, { signal });
  if (!res.ok) {
    throw new Error(`summary request failed: ${res.status}`);
  }
  return res.json();
}

export async function fetchUsageEvents(
  limit = 50,
  signal?: AbortSignal
): Promise<UsageEvent[]> {
  const res = await fetch(`${API_BASE}/api/usage/events?limit=${limit}`, {
    signal,
  });
  if (!res.ok) {
    throw new Error(`events request failed: ${res.status}`);
  }
  return res.json();
}

export function rollupByModel(totals: UsageTotal[]): ModelRollup[] {
  const byModel = new Map<string, ModelRollup>();
  for (const t of totals) {
    if (typeof t.model !== "string" || t.model.length === 0) continue;
    const existing = byModel.get(t.model);
    const tokens = (t.prompt_tokens || 0) + (t.completion_tokens || 0);
    if (existing) {
      existing.requests += t.requests || 0;
      existing.tokens += tokens;
      existing.cost += t.est_cost_usd || 0;
    } else {
      byModel.set(t.model, {
        model: t.model,
        requests: t.requests || 0,
        tokens,
        cost: t.est_cost_usd || 0,
      });
    }
  }
  return [...byModel.values()].sort((a, b) => b.cost - a.cost);
}

export function totalSpend(totals: UsageTotal[]): number {
  return totals.reduce((sum, t) => sum + t.est_cost_usd, 0);
}

export function totalTokens(totals: UsageTotal[]): number {
  return totals.reduce((sum, t) => sum + t.prompt_tokens + t.completion_tokens, 0);
}

export function averageCostPerToken(totals: UsageTotal[]): number {
  const tokens = totalTokens(totals);
  if (tokens === 0) return 0;
  return totalSpend(totals) / tokens;
}

export function lastNDays(totals: UsageTotal[], n: number): { day: string; spend: number }[] {
  const byDay = new Map<string, number>();
  for (const t of totals) {
    byDay.set(t.day, (byDay.get(t.day) ?? 0) + t.est_cost_usd);
  }
  const days = [...byDay.keys()].sort();
  const lastDays = days.slice(-n);
  return lastDays.map((day) => ({ day, spend: byDay.get(day) ?? 0 }));
}
