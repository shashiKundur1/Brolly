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

function WarningTag() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 40 36"
      className="size-8 shrink-0 -rotate-6 text-foreground"
    >
      <path
        d="M19 2 3 32h32L19 2Z"
        fill="var(--accent)"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinejoin="round"
      />
      <path
        d="M19 13v9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <circle cx="19" cy="26" r="1.4" fill="currentColor" />
    </svg>
  )
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
    <div className="flex flex-col gap-3">
      <div className="flex flex-wrap items-center gap-3">
        <WarningTag />
        <Button
          onClick={onKill}
          disabled={killing || !currentModel || currentIsKilled}
          size="lg"
          className="gap-2 bg-primary text-base text-primary-foreground"
        >
          {killing ? (
            <CircleNotchIcon size={20} className="animate-spin" />
          ) : (
            <SkullIcon size={20} weight="fill" />
          )}
          kill it
        </Button>
        {currentModel && (
          <span className="font-mono text-sm tabular-nums text-muted-foreground">
            {currentModel}
          </span>
        )}
        {killedModels.length > 0 && (
          <Button
            variant="ghost"
            onClick={onRevive}
            disabled={reviving}
            className="gap-2"
          >
            {reviving ? (
              <CircleNotchIcon size={16} className="animate-spin" />
            ) : (
              <ArrowCounterClockwiseIcon size={16} />
            )}
            revive all
          </Button>
        )}
      </div>
      {killedModels.length > 0 && (
        <div className="doodle-border flex items-center gap-2 rounded-xl border-dashed bg-accent px-3 py-2">
          <SkullIcon size={16} weight="duotone" className="shrink-0 text-primary" />
          <p className="font-mono text-xs tabular-nums">
            {killedModels.join(", ")} DOWN — next message swaps
          </p>
        </div>
      )}
    </div>
  )
}
