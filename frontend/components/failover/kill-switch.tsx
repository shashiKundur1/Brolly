"use client"

import { Button } from "@/components/ui/button"
import { ArrowCounterClockwiseIcon, CircleNotchIcon } from "@phosphor-icons/react/dist/ssr"
import { SkullDoodle } from "@/components/brand/icons"

type KillSwitchProps = {
  currentModel: string
  killedModels: string[]
  onKill: () => void
  onRevive: () => void
  killing: boolean
  reviving: boolean
}

export function KillSwitch({
  currentModel,
  killedModels,
  onKill,
  onRevive,
  killing,
  reviving,
}: KillSwitchProps) {
  const currentIsKilled = killedModels.includes(currentModel)

  return (
    <div className="flex flex-wrap items-center gap-3 rounded-2xl border-2 border-foreground bg-card px-4 py-3">
      {killedModels.length > 0 ? (
        <div className="flex items-center gap-2 rounded-full border-2 border-foreground bg-foreground px-3 py-1.5">
          <SkullDoodle className="size-4 shrink-0 text-primary motion-safe:animate-pulse motion-reduce:animate-none" />
          <p className="font-mono text-xs font-bold tracking-wide tabular-nums text-card uppercase">
            {killedModels.join(", ")} down
          </p>
        </div>
      ) : (
        <p className="font-body text-sm font-semibold text-foreground">
          pick a model, then pull the plug
        </p>
      )}
      {currentModel && (
        <span className="rounded-full border-2 border-foreground bg-secondary px-2.5 py-1 font-mono text-sm tabular-nums text-foreground">
          {currentModel}
        </span>
      )}
      {killedModels.length > 0 && (
        <Button
          variant="outline"
          size="sm"
          onClick={onRevive}
          disabled={reviving}
          className="gap-1.5"
        >
          {reviving ? (
            <CircleNotchIcon size={14} className="animate-spin" />
          ) : (
            <ArrowCounterClockwiseIcon size={14} />
          )}
          revive all
        </Button>
      )}
      <Button
        onClick={onKill}
        disabled={killing || !currentModel || currentIsKilled}
        variant="destructive"
        className="ml-auto gap-2 border-2 border-foreground bg-foreground text-card hover:bg-foreground"
      >
        {killing ? (
          <CircleNotchIcon size={18} className="animate-spin" />
        ) : (
          <SkullDoodle className="size-4" />
        )}
        kill it
      </Button>
    </div>
  )
}
