import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center border font-medium transition-[var(--transition-colors)] focus:outline-none focus:ring-[length:var(--focus-ring-width)] focus:ring-ring focus:ring-offset-[length:var(--focus-ring-offset)] rounded-[var(--badge-radius)] px-[var(--badge-padding-x)] py-[var(--badge-padding-y)] text-[length:var(--badge-font-size)]",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary-muted text-primary",
        secondary: "border-transparent bg-secondary text-secondary-foreground",
        outline: "text-foreground border-border/60",
        glass: "glass border-white/20 text-foreground",
        success: "border-transparent bg-success/15 text-success",
        warning: "border-transparent bg-warning/15 text-warning",
        info: "border-transparent bg-info/15 text-info",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
