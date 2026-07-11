"use client";

import type { Icon } from "@phosphor-icons/react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCountUp } from "@/components/usage/use-count-up";

type StatCardProps = {
  label: string;
  value: number;
  ready: boolean;
  icon: Icon;
  prefix?: string;
  suffix?: string;
  decimals?: number;
};

export function StatCard({
  label,
  value,
  ready,
  icon: IconComponent,
  prefix,
  suffix,
  decimals = 0,
}: StatCardProps) {
  const display = useCountUp(value, ready);

  return (
    <Card className="doodle-border h-full">
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm text-muted-foreground">
          {label}
          <IconComponent size={20} weight="duotone" />
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p className="font-mono text-3xl leading-relaxed">
          {prefix}
          {display.toFixed(decimals)}
          {suffix}
        </p>
      </CardContent>
    </Card>
  );
}
