import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ExternalLink } from "lucide-react";
import { MarkdownContent } from "@/components/blog/markdown-content";
import { GitHubIcon } from "@/components/icons/social";
import { FadeIn } from "@/components/motion/fade-in";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getProjectBySlug } from "@/lib/cms/queries";
import { createMetadata } from "@/lib/seo";
import { cn, getProjectSlug } from "@/lib/utils";

export const dynamic = "force-dynamic";

interface ProjectPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) return createMetadata({ title: "Project Not Found", noIndex: true });

  return createMetadata({
    title: project.title,
    description: project.description,
    path: `/projects/${getProjectSlug(project)}`,
    image: project.cover_image ?? undefined,
  });
}

export default async function ProjectPage({ params }: ProjectPageProps) {
  const { slug } = await params;
  const project = await getProjectBySlug(slug);
  if (!project) notFound();

  return (
    <article className="mx-auto max-w-6xl px-4 py-16 sm:py-24">
      <FadeIn>
        <Link
          href="/projects"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-8 -ml-2")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to Projects
        </Link>

        {project.cover_image && (
          <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl border border-border/50">
            <Image
              src={project.cover_image}
              alt=""
              fill
              priority
              className="object-cover"
              unoptimized={project.cover_image.startsWith("http")}
            />
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>

        <h1 className="mt-4 max-w-3xl text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          {project.title}
        </h1>

        <p className="mt-4 max-w-3xl text-lg text-muted-foreground">{project.description}</p>

        {(project.live_url || project.repo_url) && (
          <div className="mt-6 flex flex-wrap gap-3">
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants())}
              >
                <ExternalLink className="h-4 w-4" aria-hidden />
                View live
              </a>
            )}
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                <GitHubIcon className="h-4 w-4" />
                Source code
              </a>
            )}
          </div>
        )}
      </FadeIn>

      {project.long_description ? (
        <FadeIn delay={0.2}>
          <div className="prose-blog mt-12 max-w-3xl">
            <MarkdownContent content={project.long_description} />
          </div>
        </FadeIn>
      ) : (
        <FadeIn delay={0.2}>
          <div className="prose-blog mt-12 max-w-3xl text-muted-foreground">
            <p>{project.description}</p>
          </div>
        </FadeIn>
      )}
    </article>
  );
}
