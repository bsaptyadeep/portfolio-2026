import Link from "next/link";
import { Briefcase, FileText, FolderKanban, Mail } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { getDashboardStats } from "@/lib/cms/queries";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Dashboard Overview",
  noIndex: true,
});

export default async function DashboardPage() {
  const session = await requireAdmin();
  const stats = await getDashboardStats();

  const cards = [
    {
      title: "Blog Posts",
      value: stats.posts,
      description: "Published and draft articles",
      href: "/dashboard/blog",
      icon: FileText,
    },
    {
      title: "Projects",
      value: stats.projects,
      description: "Portfolio projects",
      href: "/dashboard/projects",
      icon: FolderKanban,
    },
    {
      title: "Experience",
      value: stats.experiences,
      description: "Work history entries",
      href: "/dashboard/experience",
      icon: Briefcase,
    },
    {
      title: "Unread Messages",
      value: stats.messages,
      description: "Contact form submissions",
      href: "/dashboard/settings",
      icon: Mail,
    },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
        Welcome back{session.profile.full_name ? `, ${session.profile.full_name.split(" ")[0]}` : ""}
      </h1>
      <p className="mt-2 text-muted-foreground">
        Manage your portfolio content from one secure admin panel.
      </p>

      <div className="mt-8 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link key={card.title} href={card.href}>
            <Card className="h-full transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </CardTitle>
                <card.icon className="h-4 w-4 text-muted-foreground" aria-hidden />
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{card.value}</p>
                <CardDescription className="mt-1">{card.description}</CardDescription>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card className="mt-8">
        <CardHeader>
          <CardTitle>Admin Setup</CardTitle>
          <CardDescription>
            First-time setup checklist for your portfolio CMS.
          </CardDescription>
        </CardHeader>
        <CardContent className="text-sm text-muted-foreground">
          <ol className="list-decimal space-y-2 pl-5">
            <li>
              Run <code className="rounded bg-muted px-1">supabase/schema.sql</code> in the
              Supabase SQL Editor
            </li>
            <li>Create a user in Supabase Auth (email/password)</li>
            <li>
              Promote to admin:{" "}
              <code className="rounded bg-muted px-1 text-xs">
                UPDATE profiles SET role = &apos;admin&apos; WHERE email = &apos;you@example.com&apos;;
              </code>
            </li>
            <li>Sign in at <code className="rounded bg-muted px-1">/login</code></li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}
