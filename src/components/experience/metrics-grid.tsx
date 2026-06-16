"use client";

import { motion } from "framer-motion";
import type { ExperienceMetric } from "@/types/experience";

interface MetricsGridProps {
  metrics: ExperienceMetric[];
}

export function MetricsGrid({ metrics }: MetricsGridProps) {
  if (metrics.length === 0) return null;

  return (
    <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3">
      {metrics.map((metric, index) => (
        <motion.div
          key={`${metric.label}-${metric.value}`}
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.35, delay: index * 0.08 }}
          className="rounded-xl border border-primary/15 bg-primary/5 px-3 py-2.5 text-center sm:px-4"
        >
          <p className="text-lg font-bold tracking-tight text-primary sm:text-xl">
            {metric.value}
          </p>
          <p className="mt-0.5 text-xs leading-snug text-muted-foreground">{metric.label}</p>
        </motion.div>
      ))}
    </div>
  );
}
