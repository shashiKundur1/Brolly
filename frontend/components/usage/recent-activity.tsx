"use client";

import {
  CheckCircleIcon,
  CloudLightningIcon,
} from "@phosphor-icons/react/dist/ssr";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { UsageEvent } from "@/components/usage/types";

type RecentActivityProps = {
  events: UsageEvent[];
};

function formatTime(ts: string): string {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts;
  return date.toLocaleTimeString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function RecentActivity({ events }: RecentActivityProps) {
  return (
    <Card className="doodle-border h-full">
      <CardHeader>
        <CardTitle>Recent activity</CardTitle>
        <CardDescription>Newest requests as they land.</CardDescription>
      </CardHeader>
      <CardContent>
        <ul className="flex flex-col gap-3">
          {events.map((event, index) => (
            <li
              key={`${event.ts}-${index}`}
              className="flex items-center gap-3 border-b border-border/60 pb-3 last:border-0 last:pb-0"
            >
              {event.ok ? (
                <CheckCircleIcon
                  size={20}
                  weight="duotone"
                  className="shrink-0 text-secondary-foreground"
                />
              ) : (
                <CloudLightningIcon
                  size={20}
                  weight="fill"
                  className="shrink-0 text-primary"
                />
              )}
              <div className="flex flex-1 items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-sm">{event.model}</span>
                  {(event.cascade_step ?? 0) > 0 && (
                    <Badge className="bg-secondary text-secondary-foreground">
                      cascade
                    </Badge>
                  )}
                  {event.reason === "failover" && (
                    <Badge className="bg-accent text-accent-foreground">
                      failover
                    </Badge>
                  )}
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="font-mono">
                    {(event.prompt_tokens + event.completion_tokens).toLocaleString()} tok
                  </span>
                  <span className="font-mono">{event.latency_ms}ms</span>
                  <span>{formatTime(event.ts)}</span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
