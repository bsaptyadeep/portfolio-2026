"use client";

import { ProjectCard } from "@/components/cards/project-card";
import { StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { SectionHeader } from "@/components/sections/section-header";
import { SectionShell } from "@/components/sections/section-shell";
import type { Project } from "@/types/database";

interface FeaturedProjectsSectionProps {
  projects: Project[];
}

export function FeaturedProjectsSection({ projects }: FeaturedProjectsSectionProps) {
  return (
    <SectionShell id="projects" variant="muted" ariaLabelledBy="projects-heading">
      <SectionHeader
        eyebrow="Portfolio"
        title="Featured Projects"
        titleId="projects-heading"
        description="Selected work that showcases full-stack ownership — from architecture to deployment."
        href="/projects"
        linkLabel="All projects"
      />

      <StaggerContainer className="grid gap-6 lg:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </SectionShell>
  );
}
