import { cn } from "@/lib/utils";

interface SectionShellProps {
  children: React.ReactNode;
  id?: string;
  className?: string;
  variant?: "default" | "muted" | "gradient";
  ariaLabelledBy?: string;
}

const variantStyles = {
  default: "",
  muted: "bg-muted/40 border-y border-border/40",
  gradient:
    "relative overflow-hidden bg-gradient-to-b from-primary/5 via-transparent to-transparent",
};

export function SectionShell({
  children,
  id,
  className,
  variant = "default",
  ariaLabelledBy,
}: SectionShellProps) {
  return (
    <section
      id={id}
      className={cn("py-20 sm:py-28", variantStyles[variant], className)}
      aria-labelledby={ariaLabelledBy}
    >
      <div className="mx-auto max-w-6xl px-4 sm:px-6">{children}</div>
    </section>
  );
}
