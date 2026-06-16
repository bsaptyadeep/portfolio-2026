"use client";

import Link from "next/link";
import { ExperienceTimeline } from "@/components/experience";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionShell } from "@/components/sections/section-shell";
import type { ExperienceTimelineEntry } from "@/types/experience";

interface ExperienceTimelineSectionProps {
  experiences: ExperienceTimelineEntry[];
  limit?: number;
  showHeader?: boolean;
  showViewAll?: boolean;
}

export function ExperienceTimelineSection({
  experiences,
  limit,
  showHeader = true,
  showViewAll = true,
}: ExperienceTimelineSectionProps) {
  const entries = limit ? experiences.slice(0, limit) : experiences;

  return (
    <SectionShell id="experience" ariaLabelledBy="experience-heading">
      {showHeader && (
        <SectionHeader
          eyebrow="Career"
          title="Experience Timeline"
          titleId="experience-heading"
          description="Roles where I've driven measurable impact — from platform engineering to product delivery."
          href={showViewAll ? "/experience" : undefined}
          linkLabel="Full timeline"
        />
      )}

      <ExperienceTimeline entries={entries} />

      {showViewAll && (
        <FadeIn className="mt-6 text-center lg:hidden">
          <Link href="/experience" className="text-sm font-medium text-primary hover:underline">
            View full experience →
          </Link>
        </FadeIn>
      )}
    </SectionShell>
  );
}
