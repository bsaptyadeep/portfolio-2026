"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { ArrowLeft } from "lucide-react";
import { AlertBanner } from "@/components/dashboard/alert-banner";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { createProject, updateProject } from "@/lib/actions/admin/projects";
import { cn } from "@/lib/utils";
import type { Project } from "@/types/database";

interface ProjectFormProps {
  project?: Project;
  onCancel?: () => void;
  showBackLink?: boolean;
}

export function ProjectForm({ project, onCancel, showBackLink = false }: ProjectFormProps) {
  const router = useRouter();
  const isEditing = Boolean(project);
  const [published, setPublished] = useState(project?.published ?? true);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("published", String(published));
    if (isEditing) {
      formData.set("featured", String(project!.featured));
      formData.set("sort_order", String(project!.sort_order));
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateProject(project!.id, formData)
        : await createProject(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
      if (onCancel) {
        onCancel();
      } else {
        router.push("/dashboard/projects");
      }
    });
  }

  return (
    <div>
      {showBackLink && (
        <Link
          href="/dashboard/projects"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6 -ml-2")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to projects
        </Link>
      )}

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      <form action={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" defaultValue={project?.title} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="slug">Slug (optional)</Label>
            <Input id="slug" name="slug" defaultValue={project?.slug} />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea
            id="description"
            name="description"
            defaultValue={project?.description}
            required
            rows={3}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="long_description">Long description (optional)</Label>
          <Textarea
            id="long_description"
            name="long_description"
            defaultValue={project?.long_description ?? ""}
            rows={5}
          />
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="live_url">Live URL</Label>
            <Input
              id="live_url"
              name="live_url"
              type="url"
              defaultValue={project?.live_url ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="repo_url">Repo URL</Label>
            <Input
              id="repo_url"
              name="repo_url"
              type="url"
              defaultValue={project?.repo_url ?? ""}
            />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="tech_stack">Tech Stack (comma-separated)</Label>
          <Input
            id="tech_stack"
            name="tech_stack"
            defaultValue={project?.tech_stack.join(", ") ?? ""}
          />
        </div>
        <div className="flex items-center gap-3">
          <Switch checked={published} label="Publish project" onCheckedChange={setPublished} />
          <span className="text-sm text-muted-foreground">
            {published ? "Visible on the projects page" : "Saved as draft"}
          </span>
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Project" : "Add Project"}
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          ) : (
            <Link href="/dashboard/projects" className={cn(buttonVariants({ variant: "ghost" }))}>
              Cancel
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
