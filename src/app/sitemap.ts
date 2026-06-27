import type { MetadataRoute } from "next";
import { getBlogPosts, getProjects } from "@/lib/cms/queries";
import { siteConfig } from "@/lib/seo";
import { getProjectSlug } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, projects] = await Promise.all([getBlogPosts(), getProjects()]);
  const baseUrl = siteConfig.url;

  const staticRoutes = ["", "/about", "/experience", "/projects", "/blog", "/contact"].map(
    (path) => ({
      url: `${baseUrl}${path}`,
      lastModified: new Date(),
      changeFrequency: "weekly" as const,
      priority: path === "" ? 1 : 0.8,
    })
  );

  const blogRoutes = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: new Date(post.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));

  const projectRoutes = projects.map((project) => ({
    url: `${baseUrl}/projects/${getProjectSlug(project)}`,
    lastModified: new Date(project.updated_at),
    changeFrequency: "monthly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...blogRoutes, ...projectRoutes];
}
