"use client";

import { cn } from "@/lib/utils";
import type { ModelRollup } from "@/components/usage/types";

const TILTS = ["-rotate-3", "rotate-2", "-rotate-1", "rotate-3", "-rotate-2", "rotate-1"];

function truncateModel(model: string): string {
  if (typeof model !== "string") return "unknown";
  const parts = model.split("/");
  return parts.length > 1 ? parts[parts.length - 1] : model;
}

type ModelPillsProps = {
  modelRows: ModelRollup[];
  selectedModel: string | null;
  onSelectModel: (model: string | null) => void;
};

export function ModelPills({ modelRows, selectedModel, onSelectModel }: ModelPillsProps) {
  const cheapestModel =
    modelRows.length > 0 ? modelRows[modelRows.length - 1].model : null;

  return (
    <div className="flex flex-wrap items-center gap-3 py-1">
      {modelRows.map((row, i) => {
        const selected = selectedModel === row.model;
        return (
          <button
            key={row.model}
            type="button"
            onClick={() => onSelectModel(selected ? null : row.model)}
            className={cn(
              "doodle-press-sm flex items-center gap-2 rounded-full bg-card px-3.5 py-1.5 font-body text-xs font-semibold transition-transform",
              TILTS[i % TILTS.length],
              selected ? "bg-primary text-primary-foreground" : "text-foreground hover:rotate-0"
            )}
          >
            <span className="font-mono">{truncateModel(row.model)}</span>
            <span className="font-mono text-xs tabular-nums opacity-70">
              ${row.cost.toFixed(2)}
            </span>
            {row.model === cheapestModel && (
              <span
                className={cn(
                  "size-1.5 shrink-0 rounded-full",
                  selected ? "bg-primary-foreground" : "bg-secondary"
                )}
                aria-hidden="true"
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
