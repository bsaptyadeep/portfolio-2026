"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Briefcase,
  FileText,
  FolderKanban,
  LayoutDashboard,
  LogOut,
  Menu,
  Settings,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { signOut } from "@/lib/actions/auth";
import { dashboardLinks } from "@/lib/data/seed";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

const iconMap = {
  LayoutDashboard,
  FileText,
  Briefcase,
  FolderKanban,
  User,
  Settings,
} as const;

export function DashboardSidebar({
  userEmail,
  userName,
}: {
  userEmail?: string;
  userName?: string | null;
}) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      <div className="flex h-16 items-center justify-between border-b border-border/50 px-4 lg:hidden">
        <span className="font-semibold">{siteConfig.name}</span>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label={mobileOpen ? "Close sidebar" : "Open sidebar"}
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>

      <aside
        className={cn(
          "glass fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-border/50 transition-transform lg:static lg:flex lg:translate-x-0",
          mobileOpen ? "flex translate-x-0" : "hidden -translate-x-full lg:flex"
        )}
        aria-label="Dashboard navigation"
      >
        <div className="hidden h-16 items-center justify-between border-b border-border/50 px-6 lg:flex">
          <Link href="/dashboard" className="font-semibold">
            CMS
          </Link>
          <Badge variant="outline" className="text-xs">
            Admin
          </Badge>
        </div>

        <nav className="flex-1 space-y-1 p-4">
          {dashboardLinks.map((link) => {
            const Icon = iconMap[link.icon as keyof typeof iconMap];
            const isActive =
              pathname === link.href ||
              (link.href !== "/dashboard" && pathname.startsWith(link.href));

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-primary/15 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                )}
              >
                <Icon className="h-4 w-4" aria-hidden />
                {link.label}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-border/50 p-4">
          {(userName || userEmail) && (
            <div className="mb-3 hidden rounded-xl bg-muted/50 px-3 py-2 lg:block">
              <p className="truncate text-sm font-medium">{userName ?? "Admin"}</p>
              <p className="truncate text-xs text-muted-foreground">{userEmail}</p>
            </div>
          )}
          <div className="mb-3 hidden lg:block">
            <ThemeToggle />
          </div>
          <form action={signOut}>
            <Button variant="ghost" className="w-full justify-start gap-3" type="submit">
              <LogOut className="h-4 w-4" aria-hidden />
              Sign Out
            </Button>
          </form>
          <Link
            href="/"
            className="mt-2 block px-3 py-2 text-sm text-muted-foreground hover:text-foreground"
          >
            ← Back to site
          </Link>
        </div>
      </aside>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/50 lg:hidden"
          onClick={() => setMobileOpen(false)}
          aria-hidden
        />
      )}
    </>
  );
}
