import { Button as ButtonPrimitive } from "@base-ui/react/button"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "group/button inline-flex shrink-0 items-center justify-center rounded-md border border-transparent bg-clip-padding text-sm font-semibold whitespace-nowrap transition-colors outline-none select-none focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 active:not-aria-[haspopup]:translate-y-px disabled:pointer-events-none disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 [&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/80",
        primary: "bg-primary text-primary-foreground h-10 px-5 active:bg-primary-active transition-colors duration-150",
        secondary: "bg-canvas text-ink border border-hairline h-10 px-5 hover:bg-surface-soft active:bg-surface-strong transition-colors duration-150",
        outline: "border-hairline bg-canvas text-ink h-10 px-5 hover:bg-surface-soft active:bg-surface-strong transition-colors duration-150",
        ghost: "bg-transparent text-ink h-10 px-5 hover:bg-surface-soft active:bg-surface-strong transition-colors duration-150",
        destructive: "bg-destructive text-destructive-foreground h-10 px-5 hover:bg-destructive/90 active:bg-destructive transition-colors duration-150",
        link: "text-ink underline-offset-4 hover:underline text-sm font-semibold",
      },
      size: {
        default: "h-10 gap-1.5 px-5 has-data-[icon=inline-end]:pr-2 has-data-[icon=inline-start]:pl-2",
        sm: "h-9 gap-1 px-4 text-sm",
        lg: "h-11 gap-1.5 px-6 text-base",
        xl: "h-12 gap-2 px-7 text-lg",
        icon: "size-10",
        "icon-sm": "size-9",
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
  ...props
}: ButtonPrimitive.Props & VariantProps<typeof buttonVariants>) {
  return (
    <ButtonPrimitive
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }