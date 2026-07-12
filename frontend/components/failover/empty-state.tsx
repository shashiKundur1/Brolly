import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  icon: React.ComponentType<{ className?: string }>
  line: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: IconComponent, line, action }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-center">
      <IconComponent className="size-10 text-muted-foreground" />
      <p className="font-display text-2xl">{line}</p>
      {action && (
        <Button onClick={action.onClick} className="bg-primary text-primary-foreground">
          {action.label}
        </Button>
      )}
    </div>
  )
}
