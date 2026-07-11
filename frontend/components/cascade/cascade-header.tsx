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
    <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
      <div className="flex flex-col gap-0.5">
        <h1 className="font-display text-2xl leading-none">the cascade</h1>
        <p className="text-sm text-muted-foreground">your benchmark, not their leaderboard</p>
      </div>
      <div className="flex items-center gap-5">
        <div className="flex items-center gap-2">
          <Switch
            id="cascade-enabled"
            checked={enabled}
            onCheckedChange={onEnabledChange}
            disabled={disabled}
          />
          <Label htmlFor="cascade-enabled" className="text-sm">enabled</Label>
        </div>
        <div className="flex items-center gap-2">
          <Label htmlFor="max-steps" className="text-sm">max steps</Label>
          <Select
            value={String(maxSteps)}
            onValueChange={(value) => onMaxStepsChange(Number(value))}
            disabled={disabled}
          >
            <SelectTrigger id="max-steps" className="w-16">
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
