"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import { parseProjectFormData, projectSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { Project } from "@/types/database";
import { slugify } from "@/lib/utils";

function revalidateProjectPaths() {
  revalidatePath("/dashboard/projects");
  revalidatePath("/projects");
  revalidatePath("/");
}

function buildProjectRow(parsed: ReturnType<typeof projectSchema.parse>) {
  return {
    title: parsed.title,
    slug: parsed.slug,
    description: parsed.description,
    long_description: parsed.long_description ?? null,
    tech_stack: parsed.tech_stack,
    live_url: parsed.live_url || null,
    repo_url: parsed.repo_url || null,
    cover_image: parsed.cover_image || null,
    featured: parsed.featured,
    published: parsed.published,
    sort_order: parsed.sort_order,
  };
}

function parseProjectInput(formData: FormData) {
  const raw = parseProjectFormData(formData);
  return projectSchema.safeParse({
    ...raw,
    slug: raw.slug || slugify(String(raw.title ?? "")),
  });
}

export async function createProject(
  formData: FormData
): Promise<ActionResult<Project>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = parseProjectInput(formData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .insert(buildProjectRow(parsed.data))
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateProjectPaths();
  return { success: true, data };
}

export async function updateProject(
  id: string,
  formData: FormData
): Promise<ActionResult<Project>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = parseProjectInput(formData);
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("projects")
    .update(buildProjectRow(parsed.data))
    .eq("id", id)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateProjectPaths();
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

  revalidateProjectPaths();
  return { success: true, data: undefined };
}

export async function deleteProject(id: string): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("projects").delete().eq("id", id);

  if (error) return actionError(error.message);

  revalidateProjectPaths();
  return { success: true, data: undefined };
}
