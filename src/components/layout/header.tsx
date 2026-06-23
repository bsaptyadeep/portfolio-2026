"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Button } from "@/components/ui/button";
import { navLinks } from "@/lib/data/seed";
import { siteConfig } from "@/lib/seo";
import { cn } from "@/lib/utils";

const SCROLL_RANGE = 80;

export function Header() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const glassRef = useRef<HTMLDivElement>(null);
  const solidRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const blend = Math.min(1, window.scrollY / SCROLL_RANGE);
        if (glassRef.current) glassRef.current.style.opacity = String(1 - blend);
        if (solidRef.current) solidRef.current.style.opacity = String(blend);
      });
    };

    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full px-4 pt-4">
      <div className="relative mx-auto h-[var(--nav-height)] max-w-6xl">
        <div
          ref={glassRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl border border-white/40 bg-[var(--glass-bg)] opacity-100 backdrop-blur-xl dark:border-white/10"
        />
        <div
          ref={solidRef}
          aria-hidden
          className="pointer-events-none absolute inset-0 rounded-2xl border border-border bg-background opacity-0 shadow-md backdrop-blur-xl"
        />

        <div className="relative z-10 flex h-full items-center justify-between px-4">
          <Link
            href="/"
            className="text-lg font-semibold tracking-tight"
            aria-label={`${siteConfig.name} home`}
          >
            <span className="bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
              {siteConfig.name.split(" ")[0]}
            </span>
          </Link>

          <nav className="hidden items-center gap-1 md:flex" aria-label="Main navigation">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-accent/80 hover:text-accent-foreground",
                  pathname === link.href && "bg-accent text-accent-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
            >
              {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {mobileOpen && (
          <motion.nav
            id="mobile-nav"
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
            className="site-nav-top mx-auto mt-2 max-w-6xl overflow-hidden rounded-2xl md:hidden"
            aria-label="Mobile navigation"
          >
            <div className="flex flex-col p-4">
              {navLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "rounded-lg px-4 py-3 text-sm font-medium transition-colors hover:bg-accent",
                    pathname === link.href && "bg-accent text-accent-foreground"
                  )}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}
