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
import {
  createExperience,
  updateExperience,
} from "@/lib/actions/admin/experience";
import { cn } from "@/lib/utils";
import type { Experience } from "@/types/database";

interface ExperienceFormProps {
  experience?: Experience;
  onCancel?: () => void;
  showBackLink?: boolean;
}

function toDateInputValue(value: string | null) {
  return value ? value.slice(0, 10) : "";
}

export function ExperienceForm({
  experience,
  onCancel,
  showBackLink = false,
}: ExperienceFormProps) {
  const router = useRouter();
  const isEditing = Boolean(experience);
  const [isCurrent, setIsCurrent] = useState(experience?.current ?? false);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleSubmit(formData: FormData) {
    setError(null);
    formData.set("current", String(isCurrent));
    if (isEditing) {
      formData.set("published", String(experience!.published));
      formData.set("sort_order", String(experience!.sort_order));
    }

    startTransition(async () => {
      const result = isEditing
        ? await updateExperience(experience!.id, formData)
        : await createExperience(formData);

      if (!result.success) {
        setError(result.error);
        return;
      }

      router.refresh();
      if (onCancel) {
        onCancel();
      } else {
        router.push("/dashboard/experience");
      }
    });
  }

  return (
    <div>
      {showBackLink && (
        <Link
          href="/dashboard/experience"
          className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "mb-6 -ml-2")}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden />
          Back to experience
        </Link>
      )}

      {error && <AlertBanner message={error} onDismiss={() => setError(null)} />}

      <form action={handleSubmit} className="space-y-4">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <Label htmlFor="company_name">Company</Label>
            <Input
              id="company_name"
              name="company_name"
              defaultValue={experience?.company_name}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="role">Role</Label>
            <Input id="role" name="role" defaultValue={experience?.role} required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input id="location" name="location" defaultValue={experience?.location ?? ""} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="company_logo">Logo URL</Label>
            <Input
              id="company_logo"
              name="company_logo"
              type="url"
              defaultValue={experience?.company_logo ?? ""}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="start_date">Start Date</Label>
            <Input
              id="start_date"
              name="start_date"
              type="date"
              defaultValue={toDateInputValue(experience?.start_date ?? null)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="end_date">End Date</Label>
            <Input
              id="end_date"
              name="end_date"
              type="date"
              defaultValue={toDateInputValue(experience?.end_date ?? null)}
              disabled={isCurrent}
              className={isCurrent ? "opacity-50" : undefined}
            />
            {isCurrent && (
              <p className="text-xs text-muted-foreground">
                Disabled while present workplace is on.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-3 rounded-xl border border-border/50 bg-muted/30 px-4 py-3">
          <Switch
            id="current"
            checked={isCurrent}
            label="Present workplace"
            onCheckedChange={setIsCurrent}
          />
          <div>
            <Label htmlFor="current" className="cursor-pointer">
              Present workplace
            </Label>
            <p className="text-xs text-muted-foreground">
              I currently work here (shows as Present on your timeline)
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description (Markdown)</Label>
          <Textarea
            id="description"
            name="description"
            rows={6}
            className="font-mono text-sm"
            placeholder={`Led **platform engineering** across multiple product teams.

- Built a design system adopted by 12 teams
- Reduced **CI build times** by 40%
- Mentored engineers on React Server Components`}
            defaultValue={experience?.description ?? ""}
          />
          <p className="text-xs text-muted-foreground">
            Use <code className="rounded bg-muted px-1">**text**</code> for bold. Bullet lists: start
            lines with <code className="rounded bg-muted px-1">-</code> or{" "}
            <code className="rounded bg-muted px-1">*</code>.
          </p>
        </div>
        <div className="space-y-2">
          <Label htmlFor="achievements">Achievements (one per line)</Label>
          <Textarea
            id="achievements"
            name="achievements"
            rows={4}
            defaultValue={experience?.achievements.join("\n") ?? ""}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="technologies">Technologies (comma-separated)</Label>
          <Input
            id="technologies"
            name="technologies"
            placeholder="React, Node.js"
            defaultValue={experience?.technologies.join(", ") ?? ""}
          />
        </div>
        <div className="flex gap-2">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Saving..." : isEditing ? "Update Experience" : "Add Experience"}
          </Button>
          {onCancel ? (
            <Button type="button" variant="ghost" onClick={onCancel} disabled={isPending}>
              Cancel
            </Button>
          ) : (
            <Link
              href="/dashboard/experience"
              className={cn(buttonVariants({ variant: "ghost" }))}
            >
              Cancel
            </Link>
          )}
        </div>
      </form>
    </div>
  );
}
