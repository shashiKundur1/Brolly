"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckIcon, XIcon } from "@phosphor-icons/react/dist/ssr";
import type { BenchmarkModelResult } from "@/components/cascade/types";

type BenchmarkDetailDialogProps = {
  result: BenchmarkModelResult | null;
  onOpenChange: (open: boolean) => void;
};

export function BenchmarkDetailDialog({
  result,
  onOpenChange,
}: BenchmarkDetailDialogProps) {
  return (
    <Dialog open={result !== null} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-mono">{result?.model}</DialogTitle>
          <DialogDescription>
            {result ? `Scored ${result.score}/${result.total} on your benchmark.` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {result?.cases.map((testCase, index) => (
            <div key={index} className="flex flex-col gap-2">
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{testCase.prompt}</p>
                {testCase.pass ? (
                  <Badge className="bg-secondary text-secondary-foreground">
                    <CheckIcon data-icon="inline-start" />
                    pass
                  </Badge>
                ) : (
                  <Badge className="bg-primary text-primary-foreground">
                    <XIcon data-icon="inline-start" />
                    fail
                  </Badge>
                )}
              </div>
              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <p>expected: {testCase.expect}</p>
                <p>got: {testCase.got}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
