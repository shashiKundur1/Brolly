"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
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
          <DialogTitle className="font-mono text-base tabular-nums">{result?.model}</DialogTitle>
          <DialogDescription>
            {result ? `${result.score}/${result.total} on your benchmark` : ""}
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          {result?.cases.map((testCase, index) => (
            <div key={index} className="flex flex-col gap-1.5">
              {index > 0 && <Separator />}
              <div className="flex items-center justify-between gap-2">
                <p className="text-sm">{testCase.prompt}</p>
                {testCase.pass ? (
                  <span className="flex items-center gap-1 rounded-full border-2 border-foreground bg-secondary px-2 py-0.5 text-xs font-bold text-secondary-foreground">
                    <CheckIcon size={12} weight="bold" />
                    pass
                  </span>
                ) : (
                  <span className="flex items-center gap-1 rounded-full border-2 border-foreground bg-primary px-2 py-0.5 text-xs font-bold text-primary-foreground">
                    <XIcon size={12} weight="bold" />
                    fail
                  </span>
                )}
              </div>
              <div className="flex flex-col gap-0.5 font-mono text-xs tabular-nums text-muted-foreground">
                <p>expect: {testCase.expect}</p>
                <p>got: {testCase.got}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
