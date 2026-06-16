import type { BlogPost, Experience, Profile, Project } from "@/types/database";

export const fallbackProfile: Profile = {
  id: "demo",
  email: "alex@example.com",
  full_name: "Alex Morgan",
  headline: "Senior Full Stack Engineer",
  bio: "I build scalable, accessible web applications with a focus on developer experience and performance. Passionate about clean architecture, design systems, and shipping products that users love.",
  avatar_url: null,
  location: "San Francisco, CA",
  website: "https://alexmorgan.dev",
  github: "alexmorgan",
  linkedin: "alexmorgan",
  twitter: "alexmorgan",
  role: "viewer",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const fallbackExperiences: Experience[] = [
  {
    id: "1",
    company_name: "Vercel",
    company_logo: "https://logo.clearbit.com/vercel.com",
    role: "Senior Full Stack Engineer",
    location: "Remote",
    start_date: "2022-03-01",
    end_date: null,
    current: true,
    description:
      "Leading frontend platform initiatives and building developer tools that power millions of deployments.",
    achievements: [
      "Architected a design system adopted across 12 product teams",
      "Reduced CI build times by 40% through incremental compilation",
      "Mentored 5 engineers on React Server Components and performance",
      "Shipped edge middleware toolkit used by 2,000+ enterprise customers",
    ],
    technologies: ["Next.js", "TypeScript", "React", "PostgreSQL", "TailwindCSS"],
    metrics: [
      { label: "Teams enabled", value: "12+" },
      { label: "Build time cut", value: "40%" },
      { label: "Engineers mentored", value: "5" },
    ],
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    company_name: "Stripe",
    company_logo: "https://logo.clearbit.com/stripe.com",
    role: "Full Stack Engineer",
    location: "San Francisco, CA",
    start_date: "2019-06-01",
    end_date: "2022-02-28",
    current: false,
    description:
      "Built payment infrastructure dashboards and internal tooling for merchant analytics.",
    achievements: [
      "Shipped real-time analytics dashboard serving 50k+ merchants",
      "Achieved WCAG 2.1 AA compliance across dashboard surfaces",
      "Led REST to GraphQL migration reducing API payload by 60%",
      "Designed caching layer handling 10M+ daily requests",
    ],
    technologies: ["React", "Ruby", "GraphQL", "Kubernetes", "Redis"],
    metrics: [
      { label: "Merchants served", value: "50k+" },
      { label: "API payload reduction", value: "60%" },
      { label: "Daily requests", value: "10M+" },
    ],
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    company_name: "Shopify",
    company_logo: "https://logo.clearbit.com/shopify.com",
    role: "Software Engineer",
    location: "Ottawa, Canada",
    start_date: "2017-01-01",
    end_date: "2019-05-31",
    current: false,
    description:
      "Developed merchant-facing admin features and checkout optimization experiments.",
    achievements: [
      "Improved checkout conversion by 8% through A/B tested UX changes",
      "Built inventory sync service processing 1M events/day",
      "Contributed to open-source Polaris design system components",
    ],
    technologies: ["React", "Ruby on Rails", "GraphQL", "MySQL"],
    metrics: [
      { label: "Conversion lift", value: "8%" },
      { label: "Events processed", value: "1M/day" },
    ],
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const fallbackProjects: Project[] = [
  {
    id: "1",
    title: "DevFlow",
    slug: "devflow",
    description: "A developer workflow automation platform with CI/CD integrations.",
    long_description:
      "DevFlow streamlines the development lifecycle with automated pipelines, code review assignments, and deployment tracking.",
    tech_stack: ["Next.js", "TypeScript", "Supabase", "TailwindCSS"],
    live_url: "https://devflow.example.com",
    repo_url: "https://github.com/alexmorgan/devflow",
    cover_image: null,
    featured: true,
    sort_order: 0,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Pulse Analytics",
    slug: "pulse-analytics",
    description: "Real-time analytics dashboard with customizable widgets.",
    long_description:
      "Pulse provides teams with live metrics, alerting, and collaborative dashboards for product analytics.",
    tech_stack: ["React", "D3.js", "Node.js", "Redis"],
    live_url: "https://pulse.example.com",
    repo_url: "https://github.com/alexmorgan/pulse",
    cover_image: null,
    featured: true,
    sort_order: 1,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "OpenCMS",
    slug: "opencms",
    description: "Headless CMS with markdown support and role-based access.",
    long_description: null,
    tech_stack: ["Next.js", "PostgreSQL", "Prisma"],
    live_url: null,
    repo_url: "https://github.com/alexmorgan/opencms",
    cover_image: null,
    featured: false,
    sort_order: 2,
    published: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const fallbackBlogPosts: BlogPost[] = [
  {
    id: "1",
    author_id: "demo",
    title: "Building Scalable Next.js Applications",
    slug: "building-scalable-nextjs-applications",
    excerpt:
      "Patterns and practices for building production-ready Next.js apps that scale with your team.",
    content: `## Introduction

Modern web applications demand both performance and maintainability. Next.js provides a solid foundation, but architectural decisions early on determine long-term success.

## Server Components First

Start with React Server Components as your default. Push interactivity to leaf nodes only where client state is required.

## Data Fetching Strategy

- Use server-side fetching for initial page loads
- Implement stale-while-revalidate patterns for dynamic content
- Cache aggressively at the edge when possible

## Conclusion

Scalability is about making the right tradeoffs early and documenting them clearly for your team.`,
    cover_image: null,
    tags: ["next.js", "architecture", "performance"],
    meta_title: null,
    meta_description: null,
    og_image: null,
    published: true,
    published_at: "2025-11-15T00:00:00Z",
    reading_time: 5,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    author_id: "demo",
    title: "The Art of Glassmorphism in UI Design",
    slug: "glassmorphism-ui-design",
    excerpt:
      "How to implement modern glass effects that enhance readability and create premium aesthetics.",
    content: `## What is Glassmorphism?

Glassmorphism combines transparency, blur, and subtle borders to create depth without heavy shadows.

## Implementation Tips

Use \`backdrop-blur\` with semi-transparent backgrounds. Always ensure sufficient contrast for accessibility.

## Performance

Limit the number of blurred elements on screen. Use CSS containment where possible.`,
    cover_image: null,
    tags: ["design", "css", "ui"],
    meta_title: null,
    meta_description: null,
    og_image: null,
    published: true,
    published_at: "2025-10-01T00:00:00Z",
    reading_time: 3,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

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
