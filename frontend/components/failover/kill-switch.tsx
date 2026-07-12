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
    <div className="flex flex-wrap items-center gap-3">
      {killedModels.length > 0 && (
        <div className="doodle-rough-soft flex items-center gap-2 bg-accent px-3 py-1.5">
          <SkullDoodle className="size-4 shrink-0 text-primary" />
          <p className="font-mono text-xs tabular-nums">
            {killedModels.join(", ")} down
          </p>
        </div>
      )}
      {currentModel && (
        <span className="font-mono text-sm tabular-nums text-muted-foreground">
          {currentModel}
        </span>
      )}
      {killedModels.length > 0 && (
        <Button
          variant="ghost"
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
        className="gap-2 bg-primary text-primary-foreground"
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
