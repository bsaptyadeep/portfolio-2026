"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import { experienceSchema, parseExperienceFormData } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { Experience } from "@/types/database";

function revalidateExperiencePaths() {
  revalidatePath("/dashboard/experience");
  revalidatePath("/experience");
  revalidatePath("/");
}

function parseMetrics(formData: FormData): ActionResult<{ label: string; value: string }[]> | { success: true; data: { label: string; value: string }[] } {
  const metricsRaw = formData.get("metrics");
  if (!metricsRaw) return { success: true, data: [] };
  try {
    return { success: true, data: JSON.parse(String(metricsRaw)) };
  } catch {
    return actionError("Invalid metrics JSON");
  }
}

function buildExperienceRow(
  parsed: ReturnType<typeof experienceSchema.parse>,
  metrics: { label: string; value: string }[]
) {
  return {
    company_name: parsed.company_name,
    company_logo: parsed.company_logo || null,
    role: parsed.role,
    location: parsed.location ?? null,
    start_date: parsed.start_date,
    end_date: parsed.current ? null : parsed.end_date ?? null,
    current: parsed.current,
    description: parsed.description ?? null,
    achievements: parsed.achievements,
    technologies: parsed.technologies,
    metrics,
    published: parsed.published,
    sort_order: parsed.sort_order,
  };
}

export async function createExperience(
  formData: FormData
): Promise<ActionResult<Experience>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = experienceSchema.safeParse(parseExperienceFormData(formData));
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const metricsResult = parseMetrics(formData);
  if (!metricsResult.success) return metricsResult;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .insert(buildExperienceRow(parsed.data, metricsResult.data))
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateExperiencePaths();
  return { success: true, data };
}

export async function updateExperience(
  id: string,
  formData: FormData
): Promise<ActionResult<Experience>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = experienceSchema.safeParse(parseExperienceFormData(formData));
  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const metricsResult = parseMetrics(formData);
  if (!metricsResult.success) return metricsResult;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .update(buildExperienceRow(parsed.data, metricsResult.data))
    .eq("id", id)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateExperiencePaths();
  return { success: true, data };
}

export async function toggleExperiencePublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("experiences").update({ published }).eq("id", id);

  if (error) return actionError(error.message);

  revalidateExperiencePaths();
  return { success: true, data: undefined };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) return actionError(error.message);

  revalidateExperiencePaths();
  return { success: true, data: undefined };
}
