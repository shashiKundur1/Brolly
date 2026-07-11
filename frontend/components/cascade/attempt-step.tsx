"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckIcon, CloudRainIcon } from "@phosphor-icons/react/dist/ssr";
import { cn } from "@/lib/utils";
import type { ChatAttempt } from "@/components/cascade/types";

type AttemptStepProps = {
  attempt: ChatAttempt;
  reveal: boolean;
};

export function AttemptStep({ attempt, reveal }: AttemptStepProps) {
  return (
    <Card
      data-reveal
      className={cn(
        "flex-row items-center gap-4 py-3 transition-transform",
        attempt.ok ? "doodle-shadow" : "doodle-border -rotate-3",
        !reveal && "opacity-0"
      )}
    >
      <CardContent className="flex w-full items-center justify-between gap-4 px-4">
        <div className="flex items-center gap-3">
          {attempt.ok ? (
            <CheckIcon
              size={20}
              weight="bold"
              className="text-secondary-foreground"
            />
          ) : (
            <CloudRainIcon size={20} weight="duotone" className="text-primary" />
          )}
          <span className="font-mono text-sm">{attempt.model}</span>
        </div>
        {attempt.ok ? (
          <Badge className="bg-secondary text-secondary-foreground">
            picked
          </Badge>
        ) : (
          <Badge variant="outline" className="text-muted-foreground">
            {attempt.reason || "failed"}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}
