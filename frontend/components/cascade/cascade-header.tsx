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
    <div className="doodle-card relative flex flex-col gap-4 overflow-hidden rounded-2xl !bg-accent/35 px-6 py-6 md:flex-row md:items-center md:justify-between">
      <img
        src="/brand/color/sticker-stars.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -right-3 size-16 md:size-20"
        width={80}
        height={80}
      />
      <div className="flex items-center gap-5">
        <img
          src="/brand/color/how-ladder-color.svg"
          alt=""
          className="size-24 shrink-0 md:size-28"
          width={112}
          height={112}
        />
        <div className="flex flex-col gap-0.5">
          <h1 className="font-display text-3xl leading-none md:text-4xl">the cascade</h1>
          <p className="text-sm text-muted-foreground">your benchmark, not their leaderboard</p>
        </div>
      </div>
      <div className="relative flex items-center gap-5">
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
            <SelectTrigger id="max-steps" className="w-16 bg-card">
              <SelectValue />
            </SelectTrigger>
            <SelectContent side="bottom" align="end" alignItemWithTrigger={false}>
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
