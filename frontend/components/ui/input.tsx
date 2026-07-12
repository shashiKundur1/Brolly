import * as React from "react"
import { Input as InputPrimitive } from "@base-ui/react/input"

import { cn } from "@/lib/utils"

const WOBBLE_RADIUS = "14px 235px 12px 240px / 235px 12px 240px 14px"

function Input({
  className,
  type,
  onFocus,
  onBlur,
  style,
  ...props
}: React.ComponentProps<"input">) {
  const [focused, setFocused] = React.useState(false)

  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      onFocus={(event) => {
        setFocused(true)
        onFocus?.(event)
      }}
      onBlur={(event) => {
        setFocused(false)
        onBlur?.(event)
      }}
      style={{
        borderRadius: focused ? WOBBLE_RADIUS : undefined,
        ...style,
      }}
      className={cn(
        "h-10 w-full min-w-0 rounded-xl border-2 border-foreground bg-card px-3 text-sm text-foreground transition-[border-radius,border-color,box-shadow] duration-150 ease-linear outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-foreground/55 focus-visible:border-primary focus-visible:ring-3 focus-visible:ring-primary/35 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-muted disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40",
        className
      )}
      {...props}
    />
  )
}

export { Input }
