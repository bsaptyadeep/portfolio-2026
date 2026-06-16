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
  createExperience,
  deleteExperience,
  toggleExperiencePublished,
} from "@/lib/actions/admin/experience";
import type { Experience } from "@/types/database";

interface ExperienceManagerProps {
  initialExperiences: Experience[];
}

type Action =
  | { type: "add"; item: Experience }
  | { type: "delete"; id: string }
  | { type: "toggle"; id: string; published: boolean };

function reducer(items: Experience[], action: Action) {
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

export function ExperienceManager({ initialExperiences }: ExperienceManagerProps) {
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [optimistic, update] = useOptimistic(initialExperiences, reducer);

  function handleCreate(formData: FormData) {
    setError(null);
    startTransition(async () => {
      const temp: Experience = {
        id: `temp-${Date.now()}`,
        company_name: String(formData.get("company_name")),
        company_logo: null,
        role: String(formData.get("role")),
        location: String(formData.get("location") || null),
        start_date: String(formData.get("start_date")),
        end_date: null,
        current: formData.get("current") === "true",
        description: String(formData.get("description") || null),
        achievements: [],
        technologies: [],
        metrics: [],
        sort_order: 0,
        published: true,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      update({ type: "add", item: temp });

      const result = await createExperience(formData);
      if (!result.success) {
        setError(result.error);
        return;
      }
      setShowForm(false);
    });
  }

  return (
    <div className={isPending ? "opacity-80 transition-opacity" : ""}>
      <PageHeader title="Experience" description="Manage your work history.">
        <Button onClick={() => setShowForm(!showForm)} disabled={isPending}>
          <Plus className="h-4 w-4" aria-hidden />
          Add Entry
        </Button>
      </PageHeader>

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      {showForm && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-lg">New Experience</CardTitle>
          </CardHeader>
          <CardContent>
            <form action={handleCreate} className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="company_name">Company</Label>
                  <Input id="company_name" name="company_name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role</Label>
                  <Input id="role" name="role" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="location">Location</Label>
                  <Input id="location" name="location" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_logo">Logo URL</Label>
                  <Input id="company_logo" name="company_logo" type="url" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="start_date">Start Date</Label>
                  <Input id="start_date" name="start_date" type="date" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end_date">End Date</Label>
                  <Input id="end_date" name="end_date" type="date" />
                </div>
              </div>
              <input type="hidden" name="current" value="false" />
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" name="description" rows={3} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="achievements">Achievements (one per line)</Label>
                <Textarea id="achievements" name="achievements" rows={4} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="technologies">Technologies (comma-separated)</Label>
                <Input id="technologies" name="technologies" placeholder="React, Node.js" />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Saving..." : "Add Experience"}
                </Button>
                <Button type="button" variant="ghost" onClick={() => setShowForm(false)}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 space-y-4">
        {optimistic.length === 0 ? (
          <EmptyState title="No experience entries" description="Add your first role." />
        ) : (
          optimistic.map((exp) => (
            <Card key={exp.id} className={exp.id.startsWith("temp-") ? "opacity-70" : ""}>
              <CardHeader className="flex flex-row items-start justify-between gap-4">
                <div>
                  <CardTitle className="text-lg">
                    {exp.role} at {exp.company_name}
                  </CardTitle>
                  <p className="mt-1 text-sm text-muted-foreground">{exp.location}</p>
                </div>
                <div className="flex items-center gap-3">
                  <Switch
                    checked={exp.published}
                    label={`Toggle ${exp.company_name}`}
                    disabled={isPending || exp.id.startsWith("temp-")}
                    onCheckedChange={(v) => {
                      startTransition(async () => {
                        update({ type: "toggle", id: exp.id, published: v });
                        const r = await toggleExperiencePublished(exp.id, v);
                        if (!r.success) setError(r.error);
                      });
                    }}
                  />
                  <Badge variant={exp.published ? "default" : "secondary"}>
                    {exp.published ? "Live" : "Hidden"}
                  </Badge>
                  <ConfirmDeleteButton
                    disabled={isPending || exp.id.startsWith("temp-")}
                    onConfirm={() => {
                      startTransition(async () => {
                        update({ type: "delete", id: exp.id });
                        const r = await deleteExperience(exp.id);
                        if (!r.success) setError(r.error);
                      });
                    }}
                  />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {exp.technologies.map((tech) => (
                    <Badge key={tech} variant="outline">
                      {tech}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
