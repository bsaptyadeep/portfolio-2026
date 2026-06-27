import { z } from "zod";

export const contactSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email"),
  subject: z.string().optional(),
  message: z.string().min(10, "Message must be at least 10 characters"),
});

export const blogPostSchema = z.object({
  title: z.string().min(3, "Title is required"),
  slug: z.string().min(3, "Slug is required"),
  excerpt: z.string().optional(),
  content: z.string().min(10, "Content is required"),
  cover_image: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  meta_title: z.string().optional(),
  meta_description: z.string().max(160).optional(),
  og_image: z.string().url().optional().or(z.literal("")),
  published: z.boolean().default(false),
});

export function parseBlogFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    excerpt: formData.get("excerpt") || undefined,
    content: formData.get("content"),
    cover_image: formData.get("cover_image") || "",
    tags: String(formData.get("tags") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    meta_title: formData.get("meta_title") || undefined,
    meta_description: formData.get("meta_description") || undefined,
    og_image: formData.get("og_image") || "",
    published: formData.get("published") === "true",
  };
}

export const projectSchema = z.object({
  title: z.string().min(2),
  slug: z.string().min(2),
  description: z.string().min(10),
  long_description: z.string().optional(),
  tech_stack: z.array(z.string()).default([]),
  live_url: z.string().url().optional().or(z.literal("")),
  repo_url: z.string().url().optional().or(z.literal("")),
  cover_image: z.string().url().optional().or(z.literal("")),
  featured: z.boolean().default(false),
  published: z.boolean().default(true),
  sort_order: z.number().default(0),
});

export function parseProjectFormData(formData: FormData) {
  return {
    title: formData.get("title"),
    slug: formData.get("slug") || undefined,
    description: formData.get("description"),
    long_description: formData.get("long_description") || undefined,
    tech_stack: String(formData.get("tech_stack") ?? "")
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean),
    live_url: formData.get("live_url") || "",
    repo_url: formData.get("repo_url") || "",
    cover_image: formData.get("cover_image") || "",
    featured: formData.get("featured") === "true",
    published: formData.get("published") !== "false",
    sort_order: Number(formData.get("sort_order") ?? 0),
  };
}

export const experienceSchema = z.object({
  company_name: z.string().min(2),
  company_logo: z.string().url().optional().or(z.literal("")),
  role: z.string().min(2),
  location: z.string().optional(),
  start_date: z.string(),
  end_date: z.string().optional().nullable(),
  current: z.boolean().default(false),
  description: z.string().optional(),
  achievements: z.array(z.string()).default([]),
  technologies: z.array(z.string()).default([]),
  metrics: z
    .array(z.object({ label: z.string(), value: z.string() }))
    .default([]),
  published: z.boolean().default(true),
  sort_order: z.number().default(0),
});

export function parseExperienceFormData(formData: FormData) {
  return {
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
  };
}

export const profileSchema = z.object({
  full_name: z.string().min(2),
  headline: z.string().optional(),
  bio: z.string().optional(),
  location: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  github: z.string().optional(),
  linkedin: z.string().optional(),
  twitter: z.string().optional(),
});

export type ContactFormData = z.infer<typeof contactSchema>;
export type BlogPostFormData = z.infer<typeof blogPostSchema>;
export type ProjectFormData = z.infer<typeof projectSchema>;
export type ExperienceFormData = z.infer<typeof experienceSchema>;
export type ProfileFormData = z.infer<typeof profileSchema>;
