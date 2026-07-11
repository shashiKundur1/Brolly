import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const wobblePath =
  "M14 -0.58C19.27 -2.63 26.51 -1.66 32.77 -1.34C39.03 -1.02 45.28 1.23 51.54 1.31C57.8 1.39 64.04 -0.76 70.3 -0.85C76.56 -0.94 82.81 0.38 89.07 0.75C95.33 1.12 101.58 1.63 107.84 1.36C114.1 1.09 120.35 -0.89 126.61 -0.87C132.87 -0.85 139.12 1.41 145.38 1.45C151.64 1.49 157.88 -0.2 164.14 -0.6C170.4 -1 177.27 -2.45 182.91 -0.98C188.55 0.49 194.83 3.63 197.99 8.2C201.15 12.77 201.66 20.31 201.88 26.46C202.1 32.61 201.93 40.24 199.28 45.11C196.63 49.98 191.34 53.73 186 55.68C180.66 57.63 173.49 57.1 167.23 56.83C160.97 56.56 154.72 54.15 148.46 54.06C142.2 53.97 135.96 56.03 129.7 56.29C123.44 56.55 117.19 55.89 110.93 55.65C104.67 55.41 98.42 54.53 92.16 54.86C85.9 55.19 79.65 57.52 73.39 57.61C67.13 57.7 60.88 55.57 54.62 55.43C48.36 55.29 42.12 56.44 35.86 56.76C29.6 57.08 22.67 58.86 17.09 57.34C11.51 55.82 5.43 52.25 2.4 47.62C-0.63 42.99 -0.91 35.65 -1.12 29.54C-1.33 23.43 -1.39 16 1.13 10.98C3.65 5.96 8.73 1.47 14 -0.58Z"

function WobbleOutline() {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 56"
      preserveAspectRatio="none"
      fill="none"
      className="pointer-events-none absolute inset-0 size-full overflow-visible text-foreground"
    >
      <path
        d={wobblePath}
        stroke="currentColor"
        strokeWidth="2.5"
        vectorEffect="non-scaling-stroke"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

const buttonVariants = cva(
  "group/button relative inline-flex shrink-0 items-center justify-center overflow-visible rounded-xl border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:pointer-events-none disabled:opacity-60 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "doodle-press border-0! bg-primary text-primary-foreground",
        outline: "doodle-press border-0! bg-card text-foreground",
        secondary: "doodle-press border-0! bg-secondary text-secondary-foreground",
        ghost:
          "rounded-xl hover:bg-muted hover:text-foreground aria-expanded:bg-muted aria-expanded:text-foreground dark:hover:bg-muted/50",
        destructive: "doodle-press border-0! bg-accent text-foreground",
        link: "text-primary underline decoration-wavy underline-offset-4",
      },
      size: {
        default:
          "h-10 gap-2 px-4 text-sm has-data-[icon=inline-end]:pr-3 has-data-[icon=inline-start]:pl-3",
        xs: "h-7 gap-1 px-2.5 text-xs in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2 [&_svg:not([class*='size-'])]:size-3.5",
        sm: "h-8 gap-1.5 px-3 text-sm in-data-[slot=button-group]:rounded-lg has-data-[icon=inline-end]:pr-2.5 has-data-[icon=inline-start]:pl-2.5",
        lg: "h-11 gap-2 px-5 text-base has-data-[icon=inline-end]:pr-4 has-data-[icon=inline-start]:pl-4 [&_svg:not([class*='size-'])]:size-5",
        icon: "size-10",
        "icon-xs":
          "size-7 in-data-[slot=button-group]:rounded-lg [&_svg:not([class*='size-'])]:size-3.5",
        "icon-sm":
          "size-8 in-data-[slot=button-group]:rounded-lg",
        "icon-lg": "size-11",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant = "default",
  size = "default",
  children,
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  const pressable =
    variant !== "ghost" && variant !== "link"
  const renderOverride =
    props.render != null && props.nativeButton === undefined
      ? { nativeButton: false }
      : undefined
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
      {...renderOverride}
    >
      {pressable ? (
        <>
          <WobbleOutline />
          {children}
        </>
      ) : (
        children
      )}
    </ButtonPrimitive>
  )
}

export { Button, buttonVariants }
