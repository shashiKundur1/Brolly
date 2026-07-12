import { Button } from "@/components/ui/button"

type EmptyStateProps = {
  icon: React.ComponentType<{ className?: string }>
  line: string
  action?: { label: string; onClick: () => void }
}

export function EmptyState({ icon: IconComponent, line, action }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-5 text-center">
      <div className="relative grid size-24 place-items-center">
        <svg
          aria-hidden="true"
          viewBox="0 0 100 100"
          className="absolute inset-0 size-full text-accent"
        >
          <path
            d="M50 4C68 4 88 16 94 36C99 53 92 70 78 84C64 97 40 98 24 88C9 79 2 60 4 42C6 24 21 9 38 5C42 4 46 4 50 4Z"
            fill="currentColor"
          />
        </svg>
        <IconComponent className="relative size-10 text-primary" />
      </div>
      <p className="font-display text-3xl leading-none">{line}</p>
      {action && (
        <Button onClick={action.onClick} className="bg-primary text-primary-foreground">
          {action.label}
        </Button>
      )}
    </div>
  )
}
