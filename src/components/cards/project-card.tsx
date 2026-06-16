import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { GitHubIcon } from "@/components/icons/social";
import type { Project } from "@/types/database";
import { ExternalLink } from "lucide-react";
import Link from "next/link";

interface ProjectCardProps {
  project: Project;
  featured?: boolean;
}

export function ProjectCard({ project, featured }: ProjectCardProps) {
  return (
    <Card className="group h-full transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
      <CardHeader>
        <div className="flex items-start justify-between gap-4">
          <div>
            {featured && <Badge className="mb-2">Featured</Badge>}
            <CardTitle className="group-hover:text-primary transition-colors">
              {project.title}
            </CardTitle>
          </div>
          <div className="flex gap-2">
            {project.repo_url && (
              <a
                href={project.repo_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View ${project.title} on GitHub`}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <GitHubIcon className="h-4 w-4" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`View live ${project.title}`}
                className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
        <CardDescription className="line-clamp-2">{project.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-wrap gap-2">
          {project.tech_stack.map((tech) => (
            <Badge key={tech} variant="outline">
              {tech}
            </Badge>
          ))}
        </div>
        <Link
          href={`/projects#${project.slug}`}
          className="mt-4 inline-block text-sm font-medium text-primary hover:underline"
        >
          Learn more →
        </Link>
      </CardContent>
    </Card>
  );
}
