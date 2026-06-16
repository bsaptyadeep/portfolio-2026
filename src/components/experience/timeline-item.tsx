"use client";

import { motion } from "framer-motion";
import { Calendar, MapPin } from "lucide-react";
import { CompanyLogo } from "@/components/experience/company-logo";
import { MetricsGrid } from "@/components/experience/metrics-grid";
import { Badge } from "@/components/ui/badge";
import { formatDuration, formatTenure } from "@/lib/experience/utils";
import { cn } from "@/lib/utils";
import type { ExperienceTimelineEntry } from "@/types/experience";

interface TimelineItemProps {
  entry: ExperienceTimelineEntry;
  index: number;
  isLast: boolean;
}

const cardVariants = {
  hidden: (side: "left" | "right") => ({
    opacity: 0,
    x: side === "left" ? -48 : 48,
    y: 16,
  }),
  visible: {
    opacity: 1,
    x: 0,
    y: 0,
    transition: { duration: 0.55, ease: [0.21, 0.47, 0.32, 0.98] as const },
  },
};

export function TimelineItem({ entry, index, isLast }: TimelineItemProps) {
  const isEven = index % 2 === 0;
  const side = isEven ? "left" : "right";
  const duration = formatDuration(entry);
  const tenure = formatTenure(entry);

  return (
    <div
      className={cn(
        "relative grid grid-cols-[2.5rem_1fr] gap-x-4 gap-y-0",
        "lg:grid-cols-[1fr_3rem_1fr] lg:gap-x-0"
      )}
    >
      {/* Mobile / tablet: left rail */}
      <div className="relative flex flex-col items-center lg:hidden">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.1 }}
          className="relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 border-primary bg-background shadow-md shadow-primary/20"
          aria-hidden
        >
          <span className="h-2.5 w-2.5 rounded-full bg-primary" />
        </motion.div>
        {!isLast && (
          <div
            className="w-px flex-1 bg-gradient-to-b from-primary/60 to-border/40"
            aria-hidden
          />
        )}
      </div>

      {/* Desktop: center node */}
      <div className="relative col-start-2 hidden lg:flex lg:flex-col lg:items-center">
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ type: "spring", stiffness: 300, damping: 20, delay: 0.15 }}
          className="relative z-10 flex h-12 w-12 items-center justify-center rounded-full border-2 border-primary bg-background shadow-lg shadow-primary/25"
          aria-hidden
        >
          <CompanyLogo name={entry.company_name} src={entry.company_logo} size="sm" />
        </motion.div>
        {!isLast && (
          <div
            className="w-px flex-1 bg-gradient-to-b from-primary/50 via-violet-500/30 to-transparent"
            aria-hidden
          />
        )}
      </div>

      {/* Card — alternates sides on desktop */}
      <motion.article
        custom={side}
        variants={cardVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-80px" }}
        className={cn(
          "col-start-2 pb-12 lg:col-start-auto lg:row-start-1 lg:pb-16",
          isEven ? "lg:col-start-1 lg:pr-10" : "lg:col-start-3 lg:pl-10"
        )}
      >
        <div className="group glass rounded-2xl border-border/50 p-5 transition-all duration-300 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/5 sm:p-6 lg:p-7">
          {/* Header */}
          <div className="flex gap-4">
            <CompanyLogo
              name={entry.company_name}
              src={entry.company_logo}
              className="lg:hidden"
            />
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="text-lg font-bold tracking-tight sm:text-xl">
                    {entry.role}
                  </h3>
                  <p className="mt-0.5 font-medium text-primary">{entry.company_name}</p>
                </div>
                {entry.current && (
                  <Badge className="shrink-0">Current</Badge>
                )}
              </div>

              <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                  <time dateTime={entry.start_date}>{duration}</time>
                  <span className="text-xs text-muted-foreground/70">({tenure})</span>
                </span>
                {entry.location && (
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-primary" aria-hidden />
                    {entry.location}
                  </span>
                )}
              </div>
            </div>
          </div>

          {entry.description && (
            <p className="mt-4 text-sm leading-relaxed text-muted-foreground sm:text-base">
              {entry.description}
            </p>
          )}

          <MetricsGrid metrics={entry.metrics} />

          {entry.achievements.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Key Achievements
              </h4>
              <ul className="mt-3 space-y-2">
                {entry.achievements.map((achievement, i) => (
                  <motion.li
                    key={achievement}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 + i * 0.06 }}
                    className="flex gap-2.5 text-sm text-muted-foreground"
                  >
                    <span
                      className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-gradient-to-r from-primary to-cyan-500"
                      aria-hidden
                    />
                    {achievement}
                  </motion.li>
                ))}
              </ul>
            </div>
          )}

          {entry.technologies.length > 0 && (
            <div className="mt-5">
              <h4 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Tech Stack
              </h4>
              <div className="mt-3 flex flex-wrap gap-2">
                {entry.technologies.map((tech) => (
                  <Badge key={tech} variant="outline" className="text-xs font-normal">
                    {tech}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.article>

      {/* Desktop: empty spacer column for alternating layout */}
      <div
        className={cn("hidden lg:block", isEven ? "lg:col-start-3" : "lg:col-start-1")}
        aria-hidden
      />
    </div>
  );
}
