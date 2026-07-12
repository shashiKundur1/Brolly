"use client";

import { useEffect, useRef } from "react";
import { CloudLightningIcon } from "@phosphor-icons/react/dist/ssr";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { collapseConsecutiveEvents } from "@/components/usage/weather";
import type { ModelRollup, UsageEvent } from "@/components/usage/types";

const scrollAreaStyle: React.CSSProperties = {
  scrollbarWidth: "thin",
  scrollbarColor: "var(--border) transparent",
};

function formatRelativeTime(ts: string): string {
  const date = new Date(ts);
  if (Number.isNaN(date.getTime())) return ts;
  const diffMs = Date.now() - date.getTime();
  const diffSec = Math.max(0, Math.round(diffMs / 1000));
  if (diffSec < 5) return "just now";
  if (diffSec < 60) return `${diffSec}s ago`;
  const diffMin = Math.round(diffSec / 60);
  if (diffMin < 60) return `${diffMin}m ago`;
  const diffHr = Math.round(diffMin / 60);
  return `${diffHr}h ago`;
}

function truncateModel(model: string): string {
  if (typeof model !== "string") return "unknown";
  const parts = model.split("/");
  return parts.length > 1 ? parts[parts.length - 1] : model;
}

type LedgerListProps = {
  modelRows: ModelRollup[];
  selectedModel: string | null;
  onSelectModel: (model: string | null) => void;
};

export function LedgerList({ modelRows, selectedModel, onSelectModel }: LedgerListProps) {
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  useEffect(() => {
    if (!selectedModel) return;
    const row = rowRefs.current.get(selectedModel);
    row?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  }, [selectedModel]);

  const cheapestModel =
    modelRows.length > 0 ? modelRows[modelRows.length - 1].model : null;
  const priciestModel = modelRows.length > 0 ? modelRows[0].model : null;

  return (
    <ul
      className="flex max-h-56 flex-col gap-1 overflow-y-auto"
      style={scrollAreaStyle}
    >
      {modelRows.map((row) => (
        <li
          key={row.model}
          ref={(el) => {
            if (el) rowRefs.current.set(row.model, el);
            else rowRefs.current.delete(row.model);
          }}
        >
          <button
            type="button"
            onClick={() => onSelectModel(selectedModel === row.model ? null : row.model)}
            className={cn(
              "flex w-full items-center gap-1.5 rounded-lg px-2 py-1.5 text-left transition-colors",
              selectedModel === row.model ? "bg-primary/10" : "hover:bg-muted/60"
            )}
          >
            <span className="min-w-0 flex-1 truncate font-mono text-xs">
              {truncateModel(row.model)}
            </span>
            {row.model === cheapestModel && (
              <Badge className="h-5 bg-secondary px-2 text-xs text-secondary-foreground">
                cheapest
              </Badge>
            )}
            {row.model === priciestModel && modelRows.length > 1 && (
              <Badge className="h-5 bg-primary px-2 text-xs text-primary-foreground">
                priciest
              </Badge>
            )}
            <span className="shrink-0 font-mono text-xs font-semibold tabular-nums">
              ${row.cost.toFixed(2)}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}

type JustHappenedListProps = {
  events: UsageEvent[];
};

export function JustHappenedList({ events }: JustHappenedListProps) {
  const collapsedEvents = collapseConsecutiveEvents(events);

  return (
    <ul className="flex max-h-56 flex-col gap-1 overflow-y-auto" style={scrollAreaStyle}>
      {collapsedEvents.map((event, index) => (
        <li
          key={`${event.ts}-${index}`}
          className="flex items-center gap-1.5 border-b border-border/50 px-2 py-1.5 last:border-0"
        >
          {!event.ok && (
            <CloudLightningIcon
              size={14}
              weight="fill"
              className="shrink-0 text-primary"
            />
          )}
          <span className="min-w-0 flex-1 truncate font-mono text-xs">
            {truncateModel(event.model)}
          </span>
          {event.count > 1 && (
            <Badge className="h-5 bg-muted px-2 text-xs text-foreground">
              ×{event.count}
            </Badge>
          )}
          {(event.cascade_step ?? 0) > 0 && (
            <Badge className="h-5 bg-secondary px-2 text-xs text-secondary-foreground">
              cascade
            </Badge>
          )}
          {event.reason === "failover" && (
            <Badge className="h-5 bg-accent px-2 text-xs text-accent-foreground">
              failover
            </Badge>
          )}
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(event.ts)}
          </span>
        </li>
      ))}
    </ul>
  );
}
