import { createClient } from "@/lib/supabase/server";
import { createStaticClient } from "@/lib/supabase/static";
import {
  fallbackBlogPosts,
  fallbackExperiences,
  fallbackProfile,
  fallbackProjects,
} from "@/lib/data/seed";
import type { BlogPost, Experience, Profile, Project } from "@/types/database";

export { getExperienceTimeline } from "@/lib/cms/experience";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getProfile(): Promise<Profile> {
  if (!isSupabaseConfigured()) return fallbackProfile;

  const supabase = createStaticClient();
  const { data } = await supabase.from("profiles").select("*").limit(1).single();
  return data ?? fallbackProfile;
}

export async function getExperiences(publishedOnly = true): Promise<Experience[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly
      ? fallbackExperiences.filter((e) => e.published)
      : fallbackExperiences;
  }

  const supabase = createStaticClient();
  let query = supabase.from("experiences").select("*").order("sort_order");
  if (publishedOnly) query = query.eq("published", true);
  const { data } = await query;
  return data?.length ? data : publishedOnly
    ? fallbackExperiences.filter((e) => e.published)
    : fallbackExperiences;
}

export async function getProjects(publishedOnly = true): Promise<Project[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly
      ? fallbackProjects.filter((p) => p.published)
      : fallbackProjects;
  }

  const supabase = createStaticClient();
  let query = supabase.from("projects").select("*").order("sort_order");
  if (publishedOnly) query = query.eq("published", true);
  const { data } = await query;
  return data?.length ? data : fallbackProjects;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) {
    return fallbackProjects.find((p) => p.slug === slug) ?? null;
  }

  const supabase = createStaticClient();
  const { data } = await supabase
    .from("projects")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data;
}

export async function getBlogPosts(publishedOnly = true): Promise<BlogPost[]> {
  if (!isSupabaseConfigured()) {
    return publishedOnly
      ? fallbackBlogPosts.filter((p) => p.published)
      : fallbackBlogPosts;
  }

  const supabase = createStaticClient();
  let query = supabase
    .from("blog_posts")
    .select("*")
    .order("published_at", { ascending: false });
  if (publishedOnly) query = query.eq("published", true);
  const { data } = await query;
  return data?.length ? data : fallbackBlogPosts;
}

export async function getBlogPostBySlug(slug: string): Promise<BlogPost | null> {
  if (!isSupabaseConfigured()) {
    return fallbackBlogPosts.find((p) => p.slug === slug) ?? null;
  }

  const supabase = createStaticClient();
  const { data } = await supabase
    .from("blog_posts")
    .select("*")
    .eq("slug", slug)
    .eq("published", true)
    .single();
  return data;
}

export async function getDashboardStats() {
  if (!isSupabaseConfigured()) {
    return {
      posts: fallbackBlogPosts.length,
      projects: fallbackProjects.length,
      experiences: fallbackExperiences.length,
      messages: 0,
    };
  }

  const supabase = createStaticClient();
  const [posts, projects, experiences, messages] = await Promise.all([
    supabase.from("blog_posts").select("id", { count: "exact", head: true }),
    supabase.from("projects").select("id", { count: "exact", head: true }),
    supabase.from("experiences").select("id", { count: "exact", head: true }),
    supabase
      .from("contact_messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
  ]);

  return {
    posts: posts.count ?? 0,
    projects: projects.count ?? 0,
    experiences: experiences.count ?? 0,
    messages: messages.count ?? 0,
  };
}
