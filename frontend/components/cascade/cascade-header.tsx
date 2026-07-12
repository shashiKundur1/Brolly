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
import {
  GaugeDoodle,
  CoinsDoodle,
  CheckDoodle,
  ArrowRightDoodle,
} from "@/components/brand/icons";

const MAX_STEPS_OPTIONS = [1, 2, 3, 4, 5];

const STEPS = [
  {
    icon: GaugeDoodle,
    title: "Test every model",
    body: "Brolly runs your 5 checks on each model and keeps only the ones that pass.",
  },
  {
    icon: CoinsDoodle,
    title: "Sort by price",
    body: "The models that passed get lined up cheapest-first on the ladder.",
  },
  {
    icon: CheckDoodle,
    title: "Send to the cheapest",
    body: "Each request starts at the cheapest passing model and climbs only if it fails.",
  },
];

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
    <div className="doodle-card relative flex flex-col gap-5 overflow-hidden rounded-2xl cell-butter px-6 py-6">
      <img
        src="/brand/color/sticker-stars.svg"
        alt=""
        aria-hidden="true"
        className="pointer-events-none absolute -top-3 -right-3 size-16 md:size-20"
        width={80}
        height={80}
      />
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-center gap-5">
          <img
            src="/brand/color/how-ladder-color.svg"
            alt=""
            className="size-20 shrink-0 md:size-24"
            width={96}
            height={96}
          />
          <div className="flex flex-col gap-1">
            <h1 className="font-display text-3xl leading-none md:text-4xl">
              the cascade
            </h1>
            <p className="max-w-md text-sm leading-snug text-foreground">
              Don&apos;t pay top-model prices for easy work. Cascade sends each
              request to the <span className="font-semibold">cheapest model
              that passes your own tests</span>, and only climbs to a pricier
              one if that one fails.
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-4 rounded-2xl border-2 border-foreground bg-card px-4 py-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Switch
                id="cascade-enabled"
                checked={enabled}
                onCheckedChange={onEnabledChange}
                disabled={disabled}
              />
              <Label htmlFor="cascade-enabled" className="text-sm font-semibold">
                {enabled ? "routing on" : "routing off"}
              </Label>
            </div>
            <p className="text-xs text-muted-foreground">
              {enabled
                ? "requests use the ladder"
                : "requests go straight to the model you pick"}
            </p>
          </div>
          <div className="h-10 w-px shrink-0 bg-foreground/20" />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2">
              <Label htmlFor="max-steps" className="text-sm font-semibold">
                max hops
              </Label>
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
            <p className="text-xs text-muted-foreground">
              tries up to {maxSteps} model{maxSteps === 1 ? "" : "s"} per request
            </p>
          </div>
        </div>
      </div>
      <ol className="grid gap-3 sm:grid-cols-3">
        {STEPS.map((step, index) => (
          <li
            key={step.title}
            className="relative flex items-start gap-3 rounded-2xl border-2 border-foreground bg-card px-3.5 py-3"
          >
            <span className="grid size-9 shrink-0 place-items-center rounded-full border-2 border-foreground bg-secondary">
              <step.icon className="size-5 text-foreground" />
            </span>
            <div className="flex flex-col gap-0.5">
              <span className="flex items-center gap-1.5 font-body text-sm font-semibold">
                <span className="font-mono text-xs tabular-nums text-primary">
                  {index + 1}
                </span>
                {step.title}
              </span>
              <span className="font-body text-xs leading-snug text-muted-foreground">
                {step.body}
              </span>
            </div>
            {index < STEPS.length - 1 && (
              <ArrowRightDoodle className="absolute top-1/2 -right-2.5 hidden size-4 -translate-y-1/2 text-primary sm:block" />
            )}
          </li>
        ))}
      </ol>
    </div>
  );
}
