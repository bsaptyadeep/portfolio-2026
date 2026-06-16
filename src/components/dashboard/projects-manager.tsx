"use client";

import { useOptimistic, useState, useTransition } from "react";
import { Plus } from "lucide-react";
import { AlertBanner, ConfirmDeleteButton } from "@/components/dashboard/alert-banner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  createProject,
  deleteProject,
  toggleProjectPublished,
} from "@/lib/actions/admin/projects";
import type { Project } from "@/types/database";

interface ProjectsManagerProps {
  initialProjects: Project[];
}

type Action =
  | { type: "add"; item: Project }
  | { type: "delete"; id: string }
  | { type: "toggle"; id: string; published: boolean };

function reducer(items: Project[], action: Action) {
  switch (action.type) {
    case "add":
      return [action.item, ...items];
    case "delete":
      return items.filter((i) => i.id !== action.id);
    case "toggle":
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

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const temp: Project = {
        id: `temp-${Date.now()}`,
        title: String(formData.get("title")),
        slug: String(formData.get("title")).toLowerCase().replace(/\s+/g, "-"),
        description: String(formData.get("description")),
        long_description: null,
        tech_stack: [],
        live_url: null,
        repo_url: null,
        cover_image: null,
        featured: false,
        sort_order: 0,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      update({ type: "add", item: temp });

      const result = await createProject(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setShowForm(false);
    });
  }

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
            <form action={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input id="title" name="title" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">Slug (optional)</Label>
                  <Input id="slug" name="slug" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" required rows={3} />
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="live_url">Live URL</Label>
                  <Input id="live_url" name="live_url" type="url" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="repo_url">Repo URL</Label>
                  <Input id="repo_url" name="repo_url" type="url" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
                <Input id="tech_stack" name="tech_stack" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Add Project"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
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
                <div className="flex items-center gap-2">
                  {project.featured && <Badge>Featured</Badge>}
                  <Switch
                    checked={project.published}
                    label={`Toggle ${project.title}`}
                    disabled={isPending || project.id.startsWith("temp-")}
                    onCheckedChange={(v) => {
                      startTransition(async () => {
                        update({ type: "toggle", id: project.id, published: v });
                        const r = await toggleProjectPublished(project.id, v);
                        if (!r.success) setError(r.error);
                      });
                    }}
                  />
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
