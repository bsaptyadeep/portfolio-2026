import { createClient } from "@/lib/supabase/server";
import { fallbackBlogPosts } from "@/lib/data/seed";
import { getRelatedPosts as scoreRelated } from "@/lib/blog/utils";
import type { BlogPost } from "@/types/database";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getBlogPostById(id: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return fallbackBlogPosts.find((p) => p.id === id) ?? null;
  }

  const supabase = await createClient();
  const { data } = await supabase.from("blog_posts").select("*").eq("id", id).single();
  return data;
}

export async function searchBlogPosts(
  query: string,
  tag?: string | null
): Promise<BlogPost[]> {
  const { getBlogPosts } = await import("@/lib/cms/queries");
  const all = await getBlogPosts();
  const { filterPostsClient } = await import("@/lib/blog/utils");
  return filterPostsClient(all, query, tag ?? null);
}

export async function getRelatedBlogPosts(
  post: BlogPost,
  limit = 3
): Promise<BlogPost[]> {
  const { getBlogPosts } = await import("@/lib/cms/queries");
  const all = await getBlogPosts();
  return scoreRelated(post, all, limit);
}

export async function getAllBlogTags(): Promise<string[]> {
  const { getBlogPosts } = await import("@/lib/cms/queries");
  const posts = await getBlogPosts();
  const { collectAllTags } = await import("@/lib/blog/utils");
  return collectAllTags(posts);
}
