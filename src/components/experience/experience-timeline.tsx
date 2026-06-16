"use client";

import { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { TimelineItem } from "@/components/experience/timeline-item";
import { cn } from "@/lib/utils";
import type { ExperienceTimelineEntry } from "@/types/experience";

interface ExperienceTimelineProps {
  entries: ExperienceTimelineEntry[];
  className?: string;
}

export function ExperienceTimeline({ entries, className }: ExperienceTimelineProps) {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start 0.9", "end 0.3"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  const lineHeight = useTransform(smoothProgress, [0, 1], ["0%", "100%"]);

  if (entries.length === 0) {
    return (
      <p className="text-center text-muted-foreground">No experience entries yet.</p>
    );
  }

  return (
    <div ref={containerRef} className={cn("relative", className)}>
      {/* Desktop center rail with scroll-driven fill */}
      <div
        className="pointer-events-none absolute top-0 left-1/2 hidden h-full w-px -translate-x-1/2 bg-border/50 lg:block"
        aria-hidden
      >
        <motion.div
          style={{ height: lineHeight }}
          className="w-full bg-gradient-to-b from-primary via-violet-500 to-cyan-500"
        />
      </div>

      <div className="relative space-y-0">
        {entries.map((entry, index) => (
          <TimelineItem
            key={entry.id}
            entry={entry}
            index={index}
            isLast={index === entries.length - 1}
          />
        ))}
      </div>
    </div>
  );
}
