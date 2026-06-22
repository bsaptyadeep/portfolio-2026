"use client";

import Link from "next/link";
import { useOptimistic, useState, useTransition } from "react";
import { Pencil, Plus } from "lucide-react";
import { AlertBanner, ConfirmDeleteButton } from "@/components/dashboard/alert-banner";
import { EmptyState } from "@/components/dashboard/empty-state";
import { ExperienceForm } from "@/components/dashboard/experience-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import {
  deleteExperience,
  toggleExperiencePublished,
} from "@/lib/actions/admin/experience";
import { formatDuration } from "@/lib/experience/utils";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/database";

interface ExperienceManagerProps {
  initialExperiences: Experience[];
}

type Action =
  | { type: "delete"; id: string }
  | { type: "toggle"; id: string; published: boolean };

function reducer(items: Experience[], action: Action) {
  switch (action.type) {
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
            <ExperienceForm onCancel={() => setShowForm(false)} />
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
                  <div className="flex flex-wrap items-center gap-2">
                    <CardTitle className="text-lg">
                      {exp.role} at {exp.company_name}
                    </CardTitle>
                    {exp.current && <Badge variant="default">Present</Badge>}
                  </div>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {formatDuration(exp)}
                    {exp.location ? ` · ${exp.location}` : ""}
                  </p>
                </div>
                <div className="flex shrink-0 items-center gap-2">
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
                  <Link
                    href={`/dashboard/experience/${exp.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "icon" }))}
                    aria-label={`Edit ${exp.role} at ${exp.company_name}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
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
