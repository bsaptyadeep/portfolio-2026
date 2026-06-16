import { cn } from "@/lib/utils";
import { AlertCircle, CheckCircle2, Info } from "lucide-react";

const variants = {
  default: "border-border bg-muted/50 text-foreground",
  destructive: "border-destructive/30 bg-destructive/10 text-destructive",
  success: "border-success/30 bg-success/10 text-success",
  warning: "border-warning/30 bg-warning/10 text-warning",
  info: "border-info/30 bg-info/10 text-info",
};

const icons = {
  default: Info,
  destructive: AlertCircle,
  success: CheckCircle2,
  warning: AlertCircle,
  info: Info,
};

interface AlertProps extends React.ComponentProps<"div"> {
  variant?: keyof typeof variants;
}

export function Alert({ className, variant = "default", children, ...props }: AlertProps) {
  const Icon = icons[variant];
  return (
    <div
      role="alert"
      className={cn(
        "flex gap-3 rounded-[var(--alert-radius)] border px-[var(--alert-padding-x)] py-[var(--alert-padding-y)] text-[length:var(--font-size-sm)]",
        variants[variant],
        className
      )}
      {...props}
    >
      <Icon className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}
