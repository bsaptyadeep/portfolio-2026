import type { Profile } from "@/types/database";

export const fallbackProfile: Profile = {
  id: "demo",
  email: "hello@example.com",
  full_name: null,
  headline: "Senior Full Stack Engineer",
  bio: "I build scalable, accessible web applications with a focus on developer experience and performance. Passionate about clean architecture, design systems, and shipping products that users love.",
  avatar_url: null,
  resume_url: null,
  location: "San Francisco, CA",
  website: null,
  github: null,
  linkedin: null,
  twitter: null,
  role: "viewer",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const skills = [
  "TypeScript",
  "React",
  "Next.js",
  "Node.js",
  "PostgreSQL",
  "Supabase",
  "TailwindCSS",
  "GraphQL",
  "Docker",
  "AWS",
];

export const capabilities = [
  {
    title: "System Design",
    description: "Architecting scalable, maintainable systems from MVP to enterprise scale.",
    icon: "Layers" as const,
  },
  {
    title: "Full Stack Development",
    description: "End-to-end product delivery — APIs, databases, and polished interfaces.",
    icon: "Code2" as const,
  },
  {
    title: "Performance",
    description: "Core Web Vitals optimization, caching strategies, and bundle analysis.",
    icon: "Zap" as const,
  },
  {
    title: "Developer Experience",
    description: "Design systems, CI/CD pipelines, and tooling that accelerates teams.",
    icon: "Workflow" as const,
  },
  {
    title: "Cloud & DevOps",
    description: "AWS infrastructure, containerization, and zero-downtime deployments.",
    icon: "Cloud" as const,
  },
  {
    title: "Accessibility",
    description: "WCAG-compliant interfaces built for every user, on every device.",
    icon: "Accessibility" as const,
  },
];

export const techStackCategories = [
  {
    category: "Frontend",
    items: ["React", "Next.js", "TypeScript", "TailwindCSS", "Framer Motion"],
  },
  {
    category: "Backend",
    items: ["Node.js", "PostgreSQL", "Supabase", "GraphQL", "REST APIs"],
  },
  {
    category: "Infrastructure",
    items: ["AWS", "Docker", "Vercel", "GitHub Actions", "Redis"],
  },
  {
    category: "Tools",
    items: ["Figma", "Linear", "Datadog", "Storybook", "Prisma"],
  },
];

export const homeTagline =
  "Crafting high-performance web products with precision engineering and thoughtful design.";

export const navLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/experience", label: "Experience" },
  { href: "/projects", label: "Projects" },
  { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
] as const;

export const dashboardLinks = [
  { href: "/dashboard", label: "Overview", icon: "LayoutDashboard" },
  { href: "/dashboard/blog", label: "Blog", icon: "FileText" },
  { href: "/dashboard/experience", label: "Experience", icon: "Briefcase" },
  { href: "/dashboard/projects", label: "Projects", icon: "FolderKanban" },
  { href: "/dashboard/profile", label: "Profile", icon: "User" },
  { href: "/dashboard/settings", label: "Settings", icon: "Settings" },
] as const;
