"use client";

import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionShell } from "@/components/sections/section-shell";
import { Badge } from "@/components/ui/badge";

interface TechCategory {
  category: string;
  items: string[];
}

interface TechStackSectionProps {
  categories: TechCategory[];
}

export function TechStackSection({ categories }: TechStackSectionProps) {
  return (
    <SectionShell id="tech-stack" variant="gradient" ariaLabelledBy="tech-stack-heading">
      <SectionHeader
        eyebrow="Toolkit"
        title="Tech Stack"
        titleId="tech-stack-heading"
        description="Technologies I reach for daily — chosen for reliability, DX, and scale."
        align="center"
      />

      <StaggerContainer className="grid gap-6 sm:grid-cols-2">
        {categories.map((group) => (
          <StaggerItem key={group.category}>
            <FadeIn>
              <div className="glass h-full rounded-2xl p-6 sm:p-8">
                <h3 className="text-sm font-semibold uppercase tracking-wider text-primary">
                  {group.category}
                </h3>
                <div className="mt-5 flex flex-wrap gap-2">
                  {group.items.map((item) => (
                    <Badge
                      key={item}
                      variant="glass"
                      className="px-3 py-1.5 text-sm font-normal"
                    >
                      {item}
                    </Badge>
                  ))}
                </div>
              </div>
            </FadeIn>
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
