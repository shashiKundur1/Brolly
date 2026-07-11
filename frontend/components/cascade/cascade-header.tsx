"use client";

import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const MAX_STEPS_OPTIONS = [1, 2, 3, 4, 5];

type CascadeHeaderProps = {
  enabled: boolean;
  maxSteps: number;
  onEnabledChange: (enabled: boolean) => void;
  onMaxStepsChange: (maxSteps: number) => void;
  disabled: boolean;
};

export function CascadeHeader({
  enabled,
  maxSteps,
  onEnabledChange,
  onMaxStepsChange,
  disabled,
}: CascadeHeaderProps) {
  return (
    <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-5xl">the cascade</h1>
        <p className="text-muted-foreground">
          your benchmark, not their leaderboard
        </p>
      </div>
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2.5">
          <Switch
            id="cascade-enabled"
            checked={enabled}
            onCheckedChange={onEnabledChange}
            disabled={disabled}
          />
          <Label htmlFor="cascade-enabled">Cascade enabled</Label>
        </div>
        <div className="flex items-center gap-2.5">
          <Label htmlFor="max-steps">Max steps</Label>
          <Select
            value={String(maxSteps)}
            onValueChange={(value) => onMaxStepsChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger id="max-steps" className="w-20">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MAX_STEPS_OPTIONS.map((step) => (
                <SelectItem key={step} value={String(step)}>
                  {step}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
}
