"use client";

import { useEffect, useMemo, useRef } from "react";
import gsap from "gsap";
import { StatCardsRow } from "@/components/usage/stat-cards-row";
import { BudgetProjectionCard } from "@/components/usage/budget-projection-card";
import { DailySpendChart } from "@/components/usage/daily-spend-chart";
import { ModelTable } from "@/components/usage/model-table";
import { RecentActivity } from "@/components/usage/recent-activity";
import { DashboardSkeleton } from "@/components/usage/dashboard-skeleton";
import { DashboardErrorState } from "@/components/usage/dashboard-error-state";
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
  const [budget] = useWeeklyBudget();
  const sectionRef = useRef<HTMLElement>(null);
  const hasAnimated = useRef(false);

  const totals = useMemo(() => summary?.totals ?? [], [summary]);
  const modelRows = useMemo(() => rollupByModel(totals), [totals]);
  const dailySpend = useMemo(() => lastNDays(totals, 7), [totals]);
  const spend7d = useMemo(() => totalSpend(totals), [totals]);
  const tokens7d = useMemo(() => totalTokens(totals), [totals]);
  const costPerToken = useMemo(() => averageCostPerToken(totals), [totals]);
  const burnRate = summary?.burnRate ?? 0;
  const projectedTokensPerHour = summary?.projectedTokensPerHour ?? 0;
  const projectedDailyCost = projectedTokensPerHour * 24 * costPerToken;
  const projectedWeeklySpend = projectedDailyCost * 7;
  const ready = summary !== null;

  useEffect(() => {
    if (!ready || hasAnimated.current || !sectionRef.current) return;
    hasAnimated.current = true;

    const reduceMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;
    if (reduceMotion) return;

    const cards = sectionRef.current.querySelectorAll("[data-reveal]");
    gsap.fromTo(
      cards,
      { opacity: 0, y: 12 },
      { opacity: 1, y: 0, duration: 0.3, ease: "none", stagger: 0.08 }
    );
  }, [ready]);

  if (error && !summary) {
    return (
      <section className="w-full py-8">
        <h1 className="text-5xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Live spend, burn rate, and budget projections across every model.
        </p>
        <DashboardErrorState onRetry={refresh} />
      </section>
    );
  }

  if (loading && !summary) {
    return (
      <section className="w-full py-8">
        <h1 className="text-5xl mb-2">Dashboard</h1>
        <p className="text-muted-foreground leading-relaxed mb-6">
          Live spend, burn rate, and budget projections across every model.
        </p>
        <DashboardSkeleton />
      </section>
    );
  }

  return (
    <section ref={sectionRef} className="w-full py-8">
      <h1 className="text-5xl mb-2">Dashboard</h1>
      <p className="text-muted-foreground leading-relaxed mb-6">
        Live spend, burn rate, and budget projections across every model.
      </p>
      <div className="flex flex-col gap-8">
        <div data-reveal>
          <StatCardsRow
            spend7d={spend7d}
            tokens7d={tokens7d}
            burnRate={burnRate}
            projectedDailyCost={projectedDailyCost}
            ready={ready}
          />
        </div>
        <div data-reveal>
          <BudgetProjectionCard
            projectedWeeklySpend={projectedWeeklySpend}
            ready={ready}
          />
        </div>
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div data-reveal>
            <DailySpendChart days={dailySpend} dailyBudget={budget / 7} />
          </div>
          <div data-reveal>
            <RecentActivity events={events ?? []} />
          </div>
        </div>
        <div data-reveal>
          <ModelTable rows={modelRows} />
        </div>
      </div>
    </section>
  );
}
