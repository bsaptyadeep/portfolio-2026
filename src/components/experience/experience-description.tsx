"use client";

import { Calendar, MapPin, X } from "lucide-react";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { ExperienceMarkdown } from "@/components/experience/experience-markdown";
import { MetricsGrid } from "@/components/experience/metrics-grid";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { truncateExperienceMarkdown } from "@/lib/experience/markdown";
import { formatDuration, formatTenure } from "@/lib/experience/utils";
import { cn } from "@/lib/utils";
import type { ExperienceTimelineEntry } from "@/types/experience";

const DEFAULT_MAX_POINTS = 3;

interface ExperienceDescriptionProps {
  content: string;
  className?: string;
  maxPoints?: number;
  /** When set, the dialog shows the full role details (timeline cards). */
  entry?: ExperienceTimelineEntry;
  /** Simple dialog header when `entry` is not provided. */
  dialogTitle?: string;
}

export function ExperienceDescription({
  content,
  className,
  maxPoints = DEFAULT_MAX_POINTS,
  entry,
  dialogTitle,
}: ExperienceDescriptionProps) {
  const [open, setOpen] = useState(false);
  const { preview, hasMore } = truncateExperienceMarkdown(content, maxPoints);

  useEffect(() => {
    if (!open) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false);
    };

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open]);

  const duration = entry ? formatDuration(entry) : null;
  const tenure = entry ? formatTenure(entry) : null;
  const title = entry ? `${entry.role} · ${entry.company_name}` : dialogTitle;

  const modal =
    open &&
    createPortal(
      <div className="fixed inset-0 z-[var(--z-modal)] flex items-center justify-center p-4">
        <button
          type="button"
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          aria-label="Close dialog"
          onClick={() => setOpen(false)}
        />
        <div
          role="dialog"
          aria-modal="true"
          aria-labelledby="experience-dialog-title"
          className="relative flex h-[min(85vh,40rem)] w-full max-w-2xl flex-col overflow-hidden rounded-2xl border border-border bg-background shadow-2xl"
        >
          <div className="flex shrink-0 items-start justify-between gap-4 border-b border-border/60 px-5 py-4 sm:px-6">
            <div className="min-w-0">
              {title && (
                <h2
                  id="experience-dialog-title"
                  className="text-lg font-bold tracking-tight sm:text-xl"
                >
                  {title}
                </h2>
              )}
              {entry && (
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                  <span className="inline-flex items-center gap-1.5">
                    <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    <time dateTime={entry.start_date}>{duration}</time>
                    {tenure && (
                      <span className="text-xs text-muted-foreground/70">({tenure})</span>
                    )}
                  </span>
                  {entry.location && (
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                      {entry.location}
                    </span>
                  )}
                  {entry.current && <Badge className="shrink-0">Present</Badge>}
                </div>
              )}
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="shrink-0"
              onClick={() => setOpen(false)}
              aria-label="Close"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6">
            <ExperienceMarkdown content={content} />

            {entry && (
              <>
                <MetricsGrid metrics={entry.metrics} />

                {entry.achievements.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Key Achievements
                    </h3>
                    <ul className="mt-3 space-y-2">
                      {entry.achievements.map((achievement) => (
                        <li
                          key={achievement}
                          className="flex gap-2.5 text-sm text-muted-foreground"
                        >
                          <span
                            className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-primary to-cyan-500"
                            aria-hidden
                          />
                          {achievement}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {entry.technologies.length > 0 && (
                  <div className="mt-5">
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                      Tech Stack
                    </h3>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {entry.technologies.map((tech) => (
                        <Badge key={tech} variant="outline" className="text-xs font-normal">
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>,
      document.body
    );

  return (
    <>
      <ExperienceMarkdown content={preview} className={className} />
      {hasMore && (
        <Button
          type="button"
          variant="link"
          size="sm"
          className="mt-1 h-auto px-0 text-primary"
          onClick={() => setOpen(true)}
        >
          Show more
        </Button>
      )}
      {modal}
    </>
  );
}
