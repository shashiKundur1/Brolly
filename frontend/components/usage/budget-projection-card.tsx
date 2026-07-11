"use client";

import { useId, useState } from "react";
import { PiggyBankIcon } from "@phosphor-icons/react/dist/ssr";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Field, FieldContent, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { useWeeklyBudget } from "@/components/usage/use-weekly-budget";

type BudgetProjectionCardProps = {
  projectedWeeklySpend: number;
  ready: boolean;
};

export function BudgetProjectionCard({
  projectedWeeklySpend,
  ready,
}: BudgetProjectionCardProps) {
  const [budget, setBudget] = useWeeklyBudget();
  const [draft, setDraft] = useState("");
  const [editing, setEditing] = useState(false);
  const inputId = useId();

  const percent = budget > 0 ? (projectedWeeklySpend / budget) * 100 : 0;
  const clampedPercent = Math.min(percent, 100);
  const overBudget = percent >= 80;

  const commitDraft = () => {
    const value = Number(draft);
    if (!Number.isNaN(value) && value > 0) {
      setBudget(value);
    }
    setEditing(false);
    setDraft("");
  };

  return (
    <Card className="doodle-border doodle-shadow h-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-xl">
          <PiggyBankIcon size={24} weight="duotone" />
          Weekly limit
        </CardTitle>
        <CardDescription>
          Your budget, your call. We just watch the burn rate.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <p className="text-lg leading-relaxed">
          At this burn rate you&apos;ll use{" "}
          <span className="font-mono font-semibold">
            {ready ? clampedPercent.toFixed(0) : "0"}%
          </span>{" "}
          of your weekly budget.
        </p>
        <div className="flex flex-col gap-2">
          <div
            role="progressbar"
            aria-valuenow={Math.round(clampedPercent)}
            aria-valuemin={0}
            aria-valuemax={100}
            className="h-4 w-full overflow-hidden rounded-full bg-muted"
          >
            <div
              className={cn(
                "h-full rounded-full transition-all",
                overBudget ? "bg-primary" : "bg-secondary"
              )}
              style={{ width: `${ready ? clampedPercent : 0}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span>
              Projected weekly spend: $
              {ready ? projectedWeeklySpend.toFixed(2) : "0.00"}
            </span>
            <span>Budget: ${budget.toFixed(2)}</span>
          </div>
        </div>
        <Field orientation="horizontal" className="items-center gap-3">
          <FieldLabel htmlFor={inputId}>Weekly budget</FieldLabel>
          <FieldContent>
            {editing ? (
              <Input
                id={inputId}
                type="number"
                min="1"
                step="1"
                autoFocus
                value={draft}
                onChange={(event) => setDraft(event.target.value)}
                onBlur={commitDraft}
                onKeyDown={(event) => {
                  if (event.key === "Enter") commitDraft();
                }}
              />
            ) : (
              <Input
                id={inputId}
                type="text"
                readOnly
                value={`$${budget.toFixed(2)}`}
                onFocus={() => {
                  setEditing(true);
                  setDraft(String(budget));
                }}
              />
            )}
          </FieldContent>
        </Field>
      </CardContent>
    </Card>
  );
}
