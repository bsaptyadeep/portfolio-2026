"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { AlertBanner, ConfirmDeleteButton } from "@/components/dashboard/alert-banner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { ProjectForm } from "@/components/dashboard/project-form";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { deleteProject, toggleProjectPublished } from "@/lib/actions/admin/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

interface ProjectsManagerProps {
  initialProjects: Project[];
}

type Action =
  | { type: "delete"; id: string }
  | { type: "toggle-published"; id: string; published: boolean };

function reducer(items: Project[], action: Action) {
  switch (action.type) {
    case "delete":
      return items.filter((i) => i.id !== action.id);
    case "toggle-published":
      return items.map((i) =>
        i.id === action.id ? { ...i, published: action.published } : i
      );
    default:
      return items;
  }
}

export function ProjectsManager({ initialProjects }: ProjectsManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimistic, update] = useOptimistic(initialProjects, reducer);

  return (
    <div className={isPending ? "opacity-80 transition-opacity" : ""}>
      <PageHeader title="Projects" description="Manage portfolio projects.">
        <Button onClick={() => setShowForm(!showForm)} disabled={isPending}>
          <Plus className="h-4 w-4" aria-hidden />
          Add Project
        </Button>
      </PageHeader>

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      {showForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">New Project</CardTitle>
          </CardHeader>
          <CardContent>
            <ProjectForm onCancel={() => setShowForm(false)} />
          </CardContent>
        </Card>
      )}

      <div className="mt-8 grid gap-4 sm:grid-cols-2">
        {optimistic.length === 0 ? (
          <div className="sm:col-span-2">
            <EmptyState title="No projects yet" description="Add your first project." />
          </div>
        ) : (
          optimistic.map((project) => (
            <Card key={project.id} className={project.id.startsWith("temp-") ? "opacity-70" : ""}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <CardTitle className="text-lg">{project.title}</CardTitle>
                <div className="flex shrink-0 items-center gap-2">
                  <Switch
                    checked={project.published}
                    label={`Toggle publish for ${project.title}`}
                    disabled={isPending || project.id.startsWith("temp-")}
                    onCheckedChange={(v) => {
                      startTransition(async () => {
                        update({ type: "toggle-published", id: project.id, published: v });
                        const r = await toggleProjectPublished(project.id, v);
                        if (!r.success) setError(r.error);
                      });
                    }}
                  />
                  <Badge variant={project.published ? "default" : "secondary"}>
                    {project.published ? "Live" : "Draft"}
                  </Badge>
                  <Link
                    href={`/dashboard/projects/${project.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                    aria-label={`Edit ${project.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <ConfirmDeleteButton
                    disabled={isPending || project.id.startsWith("temp-")}
                    onConfirm={() => {
                      startTransition(async () => {
                        update({ type: "delete", id: project.id });
                        const r = await deleteProject(project.id);
                        if (!r.success) setError(r.error);
                      });
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <p className="line-clamp-2 text-sm text-muted-foreground">
                  {project.description}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
