import type { Icon } from "@phosphor-icons/react/lib"
import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  icon: Icon
  line: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: IconComponent, line, action }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 py-12 text-center">
      <IconComponent size={40} weight="duotone" className="text-muted-foreground" />
      <p className="font-display text-2xl">{line}</p>
      {action && (
        <Button onClick={action.onClick} className="bg-primary text-primary-foreground">
          {action.label}
        </Button>
      )}
    </div>
  )
}
