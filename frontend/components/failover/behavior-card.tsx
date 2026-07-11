import { FileTextIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import type { SessionProfile } from "@/components/failover/types"

type BehaviorCardProps = {
  profile: SessionProfile
  modelsUsed: string[]
}

export function BehaviorCard({ profile, modelsUsed }: BehaviorCardProps) {
  return (
    <div className="doodle-border doodle-shadow -rotate-1 rounded-xl border-dashed bg-card p-4">
      <div className="mb-3 flex items-center gap-2 border-b border-dashed border-border pb-2">
        <FileTextIcon size={18} weight="duotone" className="text-primary" />
        <h3 className="font-display text-xl">behavior card</h3>
      </div>
      <div className="flex flex-col gap-3">
        {modelsUsed.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 font-mono text-xs tabular-nums">
            {modelsUsed.map((model, index) => (
              <span key={`${model}-${index}`} className="flex items-center gap-1.5">
                <span className="rounded-md bg-muted px-1.5 py-1">{model}</span>
                {index < modelsUsed.length - 1 && (
                  <ArrowRightIcon size={12} className="text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
        )}
        <pre className="max-h-32 overflow-y-auto rounded-lg bg-muted p-3 font-mono text-xs whitespace-pre-wrap">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </div>
    </div>
  )
}
