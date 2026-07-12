import { FileTextIcon } from "@phosphor-icons/react/dist/ssr"
import { ArrowRightDoodle } from "@/components/brand/icons"
import type { SessionProfile } from "@/components/failover/types"

type BehaviorCardProps = {
  profile: SessionProfile
  modelsUsed: string[]
}

export function BehaviorCard({ profile, modelsUsed }: BehaviorCardProps) {
  return (
    <div className="doodle-card cell-butter relative flex min-h-0 flex-1 flex-col -rotate-1 p-4">
      <span
        aria-hidden="true"
        className="absolute -top-3 left-8 h-6 w-14 -rotate-3 border-2 border-foreground bg-secondary/70"
      />
      <div className="mb-3 flex shrink-0 items-center gap-2 border-b-2 border-foreground pb-2">
        <FileTextIcon size={18} weight="duotone" className="text-primary" />
        <h3 className="font-display text-2xl leading-none">behavior card</h3>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {modelsUsed.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 font-mono text-xs tabular-nums">
            {modelsUsed.map((model, index) => (
              <span key={`${model}-${index}`} className="flex items-center gap-1.5">
                <span className="rounded-md border-2 border-foreground bg-card px-1.5 py-1">
                  {model}
                </span>
                {index < modelsUsed.length - 1 && (
                  <ArrowRightDoodle className="size-3 text-foreground" />
                )}
              </span>
            ))}
          </div>
        )}
        <p
          className="min-h-24 flex-1 overflow-y-auto rounded-lg border-2 border-foreground bg-card p-3 font-body text-sm leading-relaxed whitespace-pre-wrap"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
        >
          {profile || "No behavior profile carried over yet."}
        </p>
      </div>
    </div>
  )
}
