"use client";

import { Button } from "@/components/ui/button";
import { CircleNotchIcon, FlaskIcon } from "@phosphor-icons/react/dist/ssr";
import type {
  BenchmarkCase,
  BenchmarkModelResult,
} from "@/components/cascade/types";

type BenchmarkPanelProps = {
  cases: BenchmarkCase[];
  results: BenchmarkModelResult[] | null;
  running: boolean;
  onRun: () => void;
  onSelectResult: (result: BenchmarkModelResult) => void;
};

export function BenchmarkPanel({
  cases,
  results,
  running,
  onRun,
  onSelectResult,
}: BenchmarkPanelProps) {
  return (
    <div className="doodle-card flex flex-col gap-4 rounded-2xl px-6 py-6">
      <div className="flex items-center justify-between gap-2">
        <h2 className="flex items-center gap-2 font-display text-2xl leading-none">
          <FlaskIcon size={20} weight="duotone" className="text-primary" />
          your benchmark
        </h2>
        <Button size="sm" onClick={onRun} disabled={running}>
          {running && (
            <CircleNotchIcon data-icon="inline-start" className="animate-spin" />
          )}
          run
        </Button>
      </div>
      <ul className="flex flex-col gap-2">
        {cases.map((testCase, index) => (
          <li
            key={index}
            className="flex items-baseline justify-between gap-2 rounded-lg bg-muted px-3 py-2 text-xs"
          >
            <span className="truncate">{testCase.prompt}</span>
            <span className="shrink-0 font-mono tabular-nums text-muted-foreground">
              {testCase.expect}
            </span>
          </li>
        ))}
      </ul>
      {results && results.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          {results.map((result, index) => (
            <button
              type="button"
              key={result.model}
              onClick={() => onSelectResult(result)}
              className={
                "rounded-full border-2 border-foreground px-2.5 py-1 font-mono text-xs font-bold tabular-nums " +
                (index % 2 === 0 ? "-rotate-2" : "rotate-2") +
                " " +
                (result.passed
                  ? "bg-secondary text-secondary-foreground"
                  : "bg-primary text-primary-foreground")
              }
            >
              {result.model.split("/")[1] ?? result.model} {result.score}/{result.total}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
