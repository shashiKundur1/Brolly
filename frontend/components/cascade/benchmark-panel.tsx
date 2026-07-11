"use client";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
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
    <Card className="doodle-border">
      <CardHeader className="flex flex-row items-center justify-between gap-4">
        <div className="flex flex-col gap-1">
          <CardTitle className="flex items-center gap-2">
            <FlaskIcon size={20} weight="duotone" />
            Your benchmark
          </CardTitle>
          <CardDescription>
            Five cases, your call on what a pass means.
          </CardDescription>
        </div>
        <Button
          className="bg-primary text-primary-foreground"
          onClick={onRun}
          disabled={running}
        >
          {running && (
            <CircleNotchIcon
              data-icon="inline-start"
              className="animate-spin"
            />
          )}
          Run benchmark
        </Button>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="flex flex-col gap-3">
          {cases.map((testCase, index) => (
            <div key={index} className="flex flex-col gap-1">
              {index > 0 && <Separator />}
              <p className="text-sm">{testCase.prompt}</p>
              <p className="text-sm text-muted-foreground">
                expect: {testCase.expect}
              </p>
            </div>
          ))}
        </div>
        {results && results.length > 0 && (
          <div className="flex flex-wrap items-center gap-2.5">
            {results.map((result) => (
              <Badge
                key={result.model}
                onClick={() => onSelectResult(result)}
                className={
                  result.passed
                    ? "cursor-pointer bg-secondary text-secondary-foreground"
                    : "cursor-pointer bg-primary text-primary-foreground"
                }
              >
                <span className="font-mono">{result.model}</span>
                {result.score}/{result.total}
              </Badge>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
