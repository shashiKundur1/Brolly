import { cn } from "@/lib/utils"

export function BrollyLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      <path
        d="M20.2 4.4c-.4-.1-.8.3-.8.7v1.3c-5.7.5-10.7 4.1-13.1 9.4-.3.6.2 1.2.8.9 1.8-.8 3.6-.8 5.2.2.4.2.8.2 1.1-.1 1.5-1.4 3.6-1.4 5 .1.4.3.8.3 1.1 0 1.5-1.5 3.6-1.5 5-.1.3.3.7.3 1.1.1 1.6-1 3.5-1 5.2-.2.6.3 1.1-.3.8-.9C29.8 10.9 25.1 7.3 19.5 6.7v-1.3c0-.4-.3-.7-.7-.8Z"
        fill="currentColor"
      />
      <path
        d="M19.6 18.6c-.4.1-.6.4-.6.8l.2 13.8c0 1.2-.9 2.2-2.1 2.3-1.1.1-2-.6-2.3-1.7-.1-.4-.5-.7-.9-.6-.4.1-.7.5-.6.9.4 1.8 2.1 3.1 3.9 3 1.9-.1 3.4-1.7 3.4-3.7l-.2-13.8c0-.3-.2-.6-.4-.7-.1-.1-.2-.2-.4-.3Z"
        fill="currentColor"
      />
      <path
        d="M12.3 16.2c-.3.1-.5.4-.4.8l.4 1.6c.1.3.4.5.7.4.3-.1.5-.4.4-.8l-.4-1.6c-.1-.3-.4-.5-.7-.4Z"
        fill="currentColor"
      />
      <path
        d="M26.6 16.8c-.3-.1-.6.1-.7.4l-.5 1.6c-.1.3.1.6.4.7.3.1.6-.1.7-.4l.5-1.6c.1-.3-.1-.6-.4-.7Z"
        fill="currentColor"
      />
    </svg>
  )
}

export function BrollyWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-end gap-1.5", className)}>
      <BrollyLogo className="mb-1 size-9 shrink-0 text-primary motion-safe:transition-transform motion-safe:duration-200 motion-safe:ease-linear motion-safe:group-hover:-rotate-12" />
      <span className="inline-flex items-baseline font-display text-3xl leading-none font-semibold">
        <span className="inline-block -rotate-2 text-primary">B</span>
        <span className="inline-block rotate-1 text-foreground">r</span>
        <span className="inline-block -rotate-1 text-foreground">o</span>
        <span className="inline-block rotate-2 text-foreground">l</span>
        <span className="inline-block -rotate-1 text-foreground">l</span>
        <span className="inline-block rotate-1 text-foreground">y</span>
      </span>
    </span>
  )
}
