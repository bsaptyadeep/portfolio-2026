"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import { experienceSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { Experience } from "@/types/database";

export async function createExperience(
  formData: FormData
): Promise<ActionResult<Experience>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = experienceSchema.safeParse({
    company_name: formData.get("company_name"),
    company_logo: formData.get("company_logo") || "",
    role: formData.get("role"),
    location: formData.get("location") || undefined,
    start_date: formData.get("start_date"),
    end_date: formData.get("end_date") || null,
    current: formData.get("current") === "true",
    description: formData.get("description") || undefined,
    achievements: String(formData.get("achievements") ?? "")
      .split("\n")
      .map((l) => l.trim())
      .filter(Boolean),
    technologies: String(formData.get("technologies") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    published: formData.get("published") !== "false",
    sort_order: Number(formData.get("sort_order") ?? 0),
  });

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const metricsRaw = formData.get("metrics");
  let metrics: { label: string; value: string }[] = [];
  if (metricsRaw) {
    try {
      metrics = JSON.parse(String(metricsRaw));
    } catch {
      return actionError("Invalid metrics JSON");
    }
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("experiences")
    .insert({
      company_name: parsed.data.company_name,
      company_logo: parsed.data.company_logo || null,
      role: parsed.data.role,
      location: parsed.data.location ?? null,
      start_date: parsed.data.start_date,
      end_date: parsed.data.current ? null : parsed.data.end_date ?? null,
      current: parsed.data.current,
      description: parsed.data.description ?? null,
      achievements: parsed.data.achievements,
      technologies: parsed.data.technologies,
      metrics,
      published: parsed.data.published,
      sort_order: parsed.data.sort_order,
    })
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/experience");
  revalidatePath("/experience");
  revalidatePath("/");
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

  revalidatePath("/dashboard/experience");
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true, data: undefined };
}

export async function deleteExperience(id: string): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("experiences").delete().eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/experience");
  revalidatePath("/experience");
  revalidatePath("/");
  return { success: true, data: undefined };
}
