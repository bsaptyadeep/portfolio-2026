import GithubSlugger from "github-slugger";
import { slugify } from "@/lib/utils";

const WORDS_PER_MINUTE = 200;

export function calculateReadingTime(content: string): number {
  const words = content.trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / WORDS_PER_MINUTE));
}

export function generateSlug(title: string): string {
  return slugify(title);
}

export function parseTagsInput(input: string): string[] {
  return input
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean)
    .map((t) => t.toLowerCase());
}

export interface TocHeading {
  id: string;
  text: string;
  level: 2 | 3;
}

export function slugifyHeading(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .trim();
}

export function extractTableOfContents(markdown: string): TocHeading[] {
  const headings: TocHeading[] = [];
  const slugger = new GithubSlugger();

  for (const line of markdown.split("\n")) {
    const match = /^(#{2,3})\s+(.+)$/.exec(line.trim());
    if (!match) continue;

    const level = match[1].length as 2 | 3;
    const text = match[2].replace(/#+$/, "").trim();
    const id = slugger.slug(text);

    headings.push({ id, text, level });
  }

  return headings;
}

export function getRelatedPosts<T extends { id: string; tags: string[] }>(
  current: T,
  all: T[],
  limit = 3
): T[] {
  return all
    .filter((p) => p.id !== current.id)
    .map((post) => ({
      post,
      score: post.tags.filter((t) => current.tags.includes(t)).length,
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ post }) => post);
}

export function collectAllTags(posts: { tags: string[] }[]): string[] {
  const tags = new Set<string>();
  posts.forEach((p) => p.tags.forEach((t) => tags.add(t)));
  return Array.from(tags).sort();
}

export function filterPostsClient<T extends { title: string; excerpt: string | null; content: string; tags: string[] }>(
  posts: T[],
  query: string,
  tag: string | null
): T[] {
  const q = query.trim().toLowerCase();
  return posts.filter((post) => {
    const matchesTag = !tag || post.tags.includes(tag);
    if (!q) return matchesTag;
    const haystack = `${post.title} ${post.excerpt ?? ""} ${post.content}`.toLowerCase();
    return matchesTag && haystack.includes(q);
  });
}
