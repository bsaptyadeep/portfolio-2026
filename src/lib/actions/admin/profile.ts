"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import { profileSchema } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { Profile } from "@/types/database";

const PROFILE_ASSETS_BUCKET = "profile-assets";

function revalidateProfilePaths() {
  revalidatePath("/dashboard/profile");
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/contact");
}

async function uploadProfileAsset(
  file: File,
  folder: "avatar" | "resume",
  options: { validate: (file: File) => string | null; maxSize: number }
): Promise<ActionResult<{ url: string }>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  if (file.size === 0) {
    return actionError("No file provided");
  }

  const validationError = options.validate(file);
  if (validationError) {
    return actionError(validationError);
  }

  if (file.size > options.maxSize) {
    return actionError(`File must be under ${Math.round(options.maxSize / (1024 * 1024))}MB`);
  }

  const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
  const path = `${auth.data!.user.id}/${folder}.${ext}`;

  const supabase = await createClient();
  const { error } = await supabase.storage.from(PROFILE_ASSETS_BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  });

  if (error) return actionError(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from(PROFILE_ASSETS_BUCKET).getPublicUrl(path);

  return { success: true, data: { url: publicUrl } };
}

export async function uploadProfileAvatar(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError("No file provided");
  }

  return uploadProfileAsset(file, "avatar", {
    validate: (upload) =>
      upload.type.startsWith("image/") ? null : "File must be an image",
    maxSize: 5 * 1024 * 1024,
  });
}

export async function uploadProfileResume(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const file = formData.get("file");
  if (!(file instanceof File)) {
    return actionError("No file provided");
  }

  return uploadProfileAsset(file, "resume", {
    validate: (upload) => {
      const isPdf =
        upload.type === "application/pdf" ||
        upload.name.toLowerCase().endsWith(".pdf");
      return isPdf ? null : "Resume must be a PDF file";
    },
    maxSize: 10 * 1024 * 1024,
  });
}

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
    avatar_url: formData.get("avatar_url") || "",
    resume_url: formData.get("resume_url") || "",
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
      avatar_url: parsed.data.avatar_url || null,
      resume_url: parsed.data.resume_url || null,
    })
    .eq("id", auth.data!.user.id)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateProfilePaths();
  return { success: true, data };
}
