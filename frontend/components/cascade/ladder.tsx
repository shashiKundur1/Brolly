"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { RungCard } from "@/components/cascade/rung-card";
import { useStaggerReveal } from "@/components/cascade/use-stagger-reveal";
import type { LadderModel } from "@/components/cascade/types";

type LadderProps = {
  ladder: LadderModel[];
  maxSteps: number;
  loading: boolean;
  onSelectRung: (rung: LadderModel) => void;
};

export function Ladder({ ladder, maxSteps, loading, onSelectRung }: LadderProps) {
  const containerRef = useStaggerReveal<HTMLDivElement>(!loading, [ladder]);

  const sorted = [...ladder].sort(
    (a, b) => a.prompt_usd_per_1m - b.prompt_usd_per_1m
  );

  let stepsUsed = 0;
  const activeModels = new Set<string>();
  for (const rung of sorted) {
    if (stepsUsed >= maxSteps) break;
    stepsUsed += 1;
    if (rung.benchmark === null || rung.benchmark.passed) {
      activeModels.add(rung.model);
      if (rung.benchmark?.passed) break;
    }
  }

  const rungsTopFirst = [...sorted].reverse();

  return (
    <Card className="doodle-border">
      <CardHeader>
        <CardTitle>The ladder</CardTitle>
        <CardDescription>
          Cheapest at the bottom, priciest at the top. Every request climbs
          only as far as it has to.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex flex-col gap-3">
            {[0, 1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-16 w-full" />
            ))}
          </div>
        ) : rungsTopFirst.length === 0 ? (
          <p className="text-muted-foreground">No models configured yet.</p>
        ) : (
          <div ref={containerRef} className="flex flex-col gap-3">
            {rungsTopFirst.map((rung) => (
              <RungCard
                key={rung.model}
                rung={rung}
                active={activeModels.has(rung.model)}
                onClick={() => onSelectRung(rung)}
              />
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
