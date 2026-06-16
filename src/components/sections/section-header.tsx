import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  eyebrow?: string;
  title: string;
  titleId?: string;
  description?: string;
  href?: string;
  linkLabel?: string;
  align?: "left" | "center";
  className?: string;
}

export function SectionHeader({
  eyebrow,
  title,
  titleId,
  description,
  href,
  linkLabel = "View all",
  align = "left",
  className,
}: SectionHeaderProps) {
  const isCenter = align === "center";

  return (
    <FadeIn className={cn("mb-12 sm:mb-16", isCenter && "text-center", className)}>
      {eyebrow && (
        <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
          {eyebrow}
        </p>
      )}
      <div
        className={cn(
          "flex flex-col gap-4",
          !isCenter && "sm:flex-row sm:items-end sm:justify-between"
        )}
      >
        <div className={cn(isCenter && "mx-auto max-w-2xl")}>
          <h2
            id={titleId}
            className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl"
          >
            {title}
          </h2>
          {description && (
            <p className="mt-3 text-base leading-relaxed text-muted-foreground sm:text-lg">
              {description}
            </p>
          )}
        </div>
        {href && !isCenter && (
          <Link
            href={href}
            className="group inline-flex shrink-0 items-center gap-1.5 text-sm font-medium text-primary transition-colors hover:text-primary/80"
          >
            {linkLabel}
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden
            />
          </Link>
        )}
      </div>
      {href && isCenter && (
        <Link
          href={href}
          className="group mt-6 inline-flex items-center gap-1.5 text-sm font-medium text-primary"
        >
          {linkLabel}
          <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" aria-hidden />
        </Link>
      )}
    </FadeIn>
  );
}
