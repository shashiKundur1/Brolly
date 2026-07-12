import { FileTextIcon } from "@phosphor-icons/react/dist/ssr"
import { ArrowRightDoodle } from "@/components/brand/icons"
import type { SessionProfile } from "@/components/failover/types"

type BehaviorCardProps = {
  profile: SessionProfile
  modelsUsed: string[]
}

export function BehaviorCard({ profile, modelsUsed }: BehaviorCardProps) {
  return (
    <div className="doodle-card flex min-h-0 flex-1 flex-col -rotate-1 bg-accent p-4">
      <div className="mb-3 flex shrink-0 items-center gap-2 border-b-2 border-foreground pb-2">
        <FileTextIcon size={18} weight="duotone" className="text-primary" />
        <h3 className="font-display text-xl">behavior card</h3>
      </div>
      <div className="flex min-h-0 flex-1 flex-col gap-3">
        {modelsUsed.length > 0 && (
          <div className="flex shrink-0 flex-wrap items-center gap-1.5 font-mono text-xs tabular-nums">
            {modelsUsed.map((model, index) => (
              <span key={`${model}-${index}`} className="flex items-center gap-1.5">
                <span className="rounded-md bg-card px-1.5 py-1">{model}</span>
                {index < modelsUsed.length - 1 && (
                  <ArrowRightDoodle className="size-3 text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
        )}
        <pre
          className="min-h-24 flex-1 overflow-y-auto rounded-lg bg-card p-3 font-mono text-xs whitespace-pre-wrap"
          style={{ scrollbarWidth: "thin", scrollbarColor: "var(--border) transparent" }}
        >
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </div>
  )
}
