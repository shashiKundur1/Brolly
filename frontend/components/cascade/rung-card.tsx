"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { formatUsd, type LadderModel } from "@/components/cascade/types";

type RungCardProps = {
  rung: LadderModel;
  active: boolean;
  onClick: () => void;
};

export function RungCard({ rung, active, onClick }: RungCardProps) {
  const benchmark = rung.benchmark;

  return (
    <Card
      data-reveal
      onClick={onClick}
      className={cn(
        "cursor-pointer flex-row items-center gap-6 py-4 transition-opacity",
        active ? "doodle-shadow opacity-100" : "doodle-border opacity-50"
      )}
    >
      <CardContent className="flex w-full items-center justify-between gap-6 px-4">
        <div className="flex items-center gap-4">
          <span className="font-mono text-sm">{rung.model}</span>
          <Badge variant="outline" className="capitalize">
            {rung.tier}
          </Badge>
        </div>
        <div className="flex items-center gap-6">
          <span className="font-mono text-sm text-muted-foreground">
            {formatUsd(rung.prompt_usd_per_1m)} / {formatUsd(rung.completion_usd_per_1m)} per 1M
          </span>
          {benchmark === null ? (
            <Badge variant="outline" className="text-muted-foreground">
              not tested
            </Badge>
          ) : benchmark.passed ? (
            <Badge className="bg-secondary text-secondary-foreground">
              passes {benchmark.score}/{benchmark.total}
            </Badge>
          ) : (
            <Badge className="bg-primary text-primary-foreground">
              fails {benchmark.total - benchmark.score}/{benchmark.total}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
