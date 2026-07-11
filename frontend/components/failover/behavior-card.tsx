import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { FileTextIcon, ArrowRightIcon } from "@phosphor-icons/react/dist/ssr"
import type { SessionProfile } from "@/components/failover/types"

type BehaviorCardProps = {
  profile: SessionProfile
  modelsUsed: string[]
}

export function BehaviorCard({ profile, modelsUsed }: BehaviorCardProps) {
  return (
    <Card className="doodle-border doodle-shadow">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-2xl">
          <FileTextIcon size={22} weight="duotone" />
          behavior card carried over
        </CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {modelsUsed.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 font-mono text-sm">
            {modelsUsed.map((model, index) => (
              <span key={`${model}-${index}`} className="flex items-center gap-2">
                <span className="rounded-md bg-muted px-2 py-1">{model}</span>
                {index < modelsUsed.length - 1 && (
                  <ArrowRightIcon size={14} className="text-muted-foreground" />
                )}
              </span>
            ))}
          </div>
        )}
        <pre className="doodle-border overflow-x-auto rounded-lg bg-card p-4 font-mono text-xs whitespace-pre-wrap">
          {JSON.stringify(profile, null, 2)}
        </pre>
      </CardContent>
    </Card>
  )
}
