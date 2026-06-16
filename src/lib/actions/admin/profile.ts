"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { Profile } from "@/types/database";

export async function updateProfile(formData: FormData): Promise<ActionResult<Profile>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const parsed = profileSchema.safeParse({
    full_name: formData.get("full_name"),
    headline: formData.get("headline") || undefined,
    bio: formData.get("bio") || undefined,
    location: formData.get("location") || undefined,
    website: formData.get("website") || "",
    github: formData.get("github") || undefined,
    linkedin: formData.get("linkedin") || undefined,
    twitter: formData.get("twitter") || undefined,
  });

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("profiles")
    .update({
      full_name: parsed.data.full_name,
      headline: parsed.data.headline ?? null,
      bio: parsed.data.bio ?? null,
      location: parsed.data.location ?? null,
      website: parsed.data.website || null,
      github: parsed.data.github ?? null,
      linkedin: parsed.data.linkedin ?? null,
      twitter: parsed.data.twitter ?? null,
    })
    .eq("id", auth.data!.user.id)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/profile");
  revalidatePath("/");
  revalidatePath("/about");
  return { success: true, data };
}
