"use client";

import { CoinsIcon, GaugeIcon, StackIcon, TrendUpIcon } from "@phosphor-icons/react/dist/ssr";
import { StatCard } from "@/components/usage/stat-card";

type StatCardsRowProps = {
  spend7d: number;
  tokens7d: number;
  burnRate: number;
  projectedDailyCost: number;
  ready: boolean;
};

export function StatCardsRow({
  spend7d,
  tokens7d,
  burnRate,
  projectedDailyCost,
  ready,
}: StatCardsRowProps) {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="7-day spend"
        value={spend7d}
        ready={ready}
        icon={CoinsIcon}
        prefix="$"
        decimals={2}
      />
      <StatCard
        label="Total tokens"
        value={tokens7d}
        ready={ready}
        icon={StackIcon}
        decimals={0}
      />
      <StatCard
        label="Burn rate"
        value={burnRate}
        ready={ready}
        icon={GaugeIcon}
        suffix=" tok/min"
        decimals={1}
      />
      <StatCard
        label="Projected $/day"
        value={projectedDailyCost}
        ready={ready}
        icon={TrendUpIcon}
        prefix="$"
        decimals={2}
      />
    </div>
  );
}
