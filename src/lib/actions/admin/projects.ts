"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import { projectSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { Project } from "@/types/database";
import { slugify } from "@/lib/utils";

export async function createProject(
  formData: FormData
): Promise<ActionResult<Project>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = projectSchema.safeParse({
    title: formData.get("title"),
    slug: formData.get("slug") || slugify(String(formData.get("title") ?? "")),
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    tech_stack: String(formData.get("tech_stack") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    live_url: formData.get("live_url") || "",
    repo_url: formData.get("repo_url") || "",
    cover_image: formData.get("cover_image") || "",
    featured: formData.get("featured") === "true",
    published: formData.get("published") !== "false",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert({
      title: parsed.data.title,
      slug: parsed.data.slug,
      description: parsed.data.description,
      long_description: parsed.data.long_description ?? null,
      tech_stack: parsed.data.tech_stack,
      live_url: parsed.data.live_url || null,
      repo_url: parsed.data.repo_url || null,
      cover_image: parsed.data.cover_image || null,
      featured: parsed.data.featured,
      published: parsed.data.published,
      sort_order: parsed.data.sort_order,
    })
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true, data };
}

export async function toggleProjectPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("projects").update({ published }).eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true, data: undefined };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
  return { success: true, data: undefined };
}
