import { ProjectCard } from "@/components/cards/project-card";
import { FadeIn, StaggerContainer, StaggerItem } from "@/components/motion/fade-in";
import { getProjects } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Projects",
  description: "Portfolio of full-stack projects, open source contributions, and side builds.",
  path: "/projects",
});

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <FadeIn>
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Projects</h1>
        <p className="mt-4 max-w-2xl text-lg text-muted-foreground">
          A collection of products and tools I&apos;ve built — from concept to production.
        </p>
      </FadeIn>

      <StaggerContainer className="mt-12 grid gap-6 sm:grid-cols-2">
        {projects.map((project) => (
          <StaggerItem key={project.id}>
            <ProjectCard project={project} featured={project.featured} />
          </StaggerItem>
        ))}
      </StaggerContainer>
    </div>
  );
}
