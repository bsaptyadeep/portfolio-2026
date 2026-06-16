"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { calculateReadingTime, generateSlug } from "@/lib/blog/utils";
import { createClient } from "@/lib/supabase/server";
import { blogPostSchema, parseBlogFormData } from "@/lib/validations";
import type { ActionResult } from "@/lib/auth/types";
import type { BlogPost } from "@/types/database";

function revalidateBlogPaths(slug?: string) {
  revalidatePath("/dashboard/blog");
  revalidatePath("/blog");
  revalidatePath("/");
  if (slug) revalidatePath(`/blog/${slug}`);
}

function buildBlogPayload(parsed: ReturnType<typeof blogPostSchema.parse>, authorId: string) {
  const published = parsed.published;
  return {
    author_id: authorId,
    title: parsed.title,
    slug: parsed.slug,
    excerpt: parsed.excerpt ?? null,
    content: parsed.content,
    cover_image: parsed.cover_image || null,
    tags: parsed.tags,
    meta_title: parsed.meta_title ?? null,
    meta_description: parsed.meta_description ?? null,
    og_image: parsed.og_image || null,
    published,
    published_at: published ? new Date().toISOString() : null,
    reading_time: calculateReadingTime(parsed.content),
  };
}

export async function createBlogPost(
  formData: FormData
): Promise<ActionResult<BlogPost>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const raw = parseBlogFormData(formData);
  const parsed = blogPostSchema.safeParse({
    ...raw,
    slug: raw.slug || generateSlug(String(raw.title ?? "")),
  });

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .insert(buildBlogPayload(parsed.data, auth.data!.user.id))
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateBlogPaths(data.slug);
  return { success: true, data };
}

export async function updateBlogPost(
  id: string,
  formData: FormData
): Promise<ActionResult<BlogPost>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const raw = parseBlogFormData(formData);
  const parsed = blogPostSchema.safeParse({
    ...raw,
    slug: raw.slug || generateSlug(String(raw.title ?? "")),
  });

  if (!parsed.success) {
    return actionError(parsed.error.issues[0]?.message ?? "Invalid input");
  }

  const supabase = await createClient();
  const { data: existing } = await supabase
    .from("blog_posts")
    .select("published_at")
    .eq("id", id)
    .single();

  const published = parsed.data.published;
  const { author_id: _a, ...payload } = buildBlogPayload(parsed.data, auth.data!.user.id);
  payload.published_at = published
    ? existing?.published_at ?? new Date().toISOString()
    : null;

  const { data, error } = await supabase
    .from("blog_posts")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) return actionError(error.message);

  revalidateBlogPaths(data.slug);
  return { success: true, data };
}

export async function toggleBlogPublished(
  id: string,
  published: boolean
): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("blog_posts")
    .update({
      published,
      published_at: published ? new Date().toISOString() : null,
    })
    .eq("id", id)
    .select("slug")
    .single();

  if (error) return actionError(error.message);

  revalidateBlogPaths(data?.slug);
  return { success: true, data: undefined };
}

export async function deleteBlogPost(id: string): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { data: post } = await supabase
    .from("blog_posts")
    .select("slug")
    .eq("id", id)
    .single();

  const { error } = await supabase.from("blog_posts").delete().eq("id", id);

  if (error) return actionError(error.message);

  revalidateBlogPaths(post?.slug);
  return { success: true, data: undefined };
}

export async function uploadBlogCover(
  formData: FormData
): Promise<ActionResult<{ url: string }>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const file = formData.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return actionError("No file provided");
  }

  if (!file.type.startsWith("image/")) {
    return actionError("File must be an image");
  }

  if (file.size > 5 * 1024 * 1024) {
    return actionError("Image must be under 5MB");
  }

  const ext = file.name.split(".").pop() ?? "jpg";
  const path = `${auth.data!.user.id}/${Date.now()}.${ext}`;

  const supabase = await createClient();
  const { error } = await supabase.storage.from("blog-covers").upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });

  if (error) return actionError(error.message);

  const {
    data: { publicUrl },
  } = supabase.storage.from("blog-covers").getPublicUrl(path);

  return { success: true, data: { url: publicUrl } };
}
