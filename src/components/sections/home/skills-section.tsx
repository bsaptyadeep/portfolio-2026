"use client";

import {
  Accessibility,
  Cloud,
  Code2,
  Layers,
  Workflow,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionShell } from "@/components/sections/section-shell";
import { Card, CardContent } from "@/components/ui/card";

const iconMap: Record<string, LucideIcon> = {
  Layers,
  Code2,
  Zap,
  Workflow,
  Cloud,
  Accessibility,
};

interface Skill {
  title: string;
  description: string;
  icon: string;
}

interface SkillsSectionProps {
  skills: Skill[];
}

export function SkillsSection({ skills }: SkillsSectionProps) {
  return (
    <SectionShell id="skills" variant="muted" ariaLabelledBy="skills-heading">
      <SectionHeader
        eyebrow="Expertise"
        title="Skills & Capabilities"
        titleId="skills-heading"
        description="A blend of technical depth and product thinking — from architecture to shipped UI."
      />

      <StaggerContainer className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill) => {
          const Icon = iconMap[skill.icon] ?? Code2;
          return (
            <StaggerItem key={skill.title}>
              <Card className="group h-full border-border/50 bg-card/80 transition-all duration-300 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
                <CardContent className="p-6">
                  <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                    <Icon className="h-5 w-5" aria-hidden />
                  </div>
                  <h3 className="text-base font-semibold tracking-tight sm:text-lg">
                    {skill.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {skill.description}
                  </p>
                </CardContent>
              </Card>
            </StaggerItem>
          );
        })}
      </StaggerContainer>
    </SectionShell>
  );
}
