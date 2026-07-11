"use client"

import { Button } from "@/components/ui/button"
import {
  SkullIcon,
  ArrowCounterClockwiseIcon,
  CircleNotchIcon,
} from "@phosphor-icons/react/dist/ssr"

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
    <div className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center gap-4">
        <Button
          onClick={onKill}
          disabled={killing || !currentModel || currentIsKilled}
          className="h-11 gap-2 bg-primary px-5 text-base text-primary-foreground"
        >
          {killing ? (
            <CircleNotchIcon size={18} className="animate-spin" />
          ) : (
            <SkullIcon size={18} weight="fill" />
          )}
          kill {currentModel || "model"}
        </Button>
        {killedModels.length > 0 && (
          <Button
            variant="ghost"
            onClick={onRevive}
            disabled={reviving}
            className="h-11 gap-2 px-4"
          >
            {reviving ? (
              <CircleNotchIcon size={18} className="animate-spin" />
            ) : (
              <ArrowCounterClockwiseIcon size={18} />
            )}
            revive all
          </Button>
        )}
      </div>
      {killedModels.length > 0 && (
        <div className="doodle-border flex items-center gap-3 rounded-xl border-dashed bg-accent px-4 py-3">
          <SkullIcon size={20} weight="duotone" className="shrink-0 text-primary" />
          <p className="font-mono text-sm">
            {killedModels.join(", ")} {killedModels.length === 1 ? "is" : "are"} DOWN
            — next message will hot-swap
          </p>
        </div>
      )}
    </div>
  )
}
