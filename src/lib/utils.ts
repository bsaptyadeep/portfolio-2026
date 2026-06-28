import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(date: string | Date, options?: Intl.DateTimeFormatOptions) {
  return new Intl.DateTimeFormat("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    ...options,
  }).format(new Date(date));
}

export function slugify(text: string) {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function getProjectSlug(project: { slug: string; title: string }) {
  return slugify(project.slug) || slugify(project.title);
}

export function getFirstName(fullName: string | null | undefined): string {
  if (!fullName?.trim()) return "";
  return fullName.trim().split(/\s+/)[0] ?? "";
}

export function getDisplayName(
  fullName: string | null | undefined,
  fallback = "Portfolio"
): string {
  return fullName?.trim() || fallback;
}

export function toGitHubUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const username = trimmed.replace(/^@/, "").replace(/^github\.com\//i, "");
  return `https://github.com/${username}`;
}

export function toLinkedInUrl(value: string | null | undefined): string | null {
  if (!value?.trim()) return null;
  const trimmed = value.trim();
  if (/^https?:\/\//i.test(trimmed)) return trimmed;
  const slug = trimmed
    .replace(/^@/, "")
    .replace(/^(www\.)?linkedin\.com\/(in\/)?/i, "");
  return `https://www.linkedin.com/in/${slug}`;
}
