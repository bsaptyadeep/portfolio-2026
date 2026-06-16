"use client";

import Link from "next/link";
import { ArrowRight, Download, MapPin, Sparkles } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { ProfileAvatar } from "@/components/sections/home/profile-avatar";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface HeroSectionProps {
  name: string;
  title: string;
  tagline: string;
  location?: string | null;
  avatarUrl?: string | null;
}

export function HeroSection({
  name,
  title,
  tagline,
  location,
  avatarUrl,
}: HeroSectionProps) {
  const firstName = name.split(" ")[0];

  return (
    <section className="relative overflow-hidden pt-8 pb-20 sm:pt-12 sm:pb-28 lg:pb-32">
      <div
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,color-mix(in_srgb,var(--primary)_12%,transparent),transparent)]"
        aria-hidden
      />

      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="grid items-center gap-12 lg:grid-cols-[1fr_auto] lg:gap-16">
          {/* Copy — mobile-first: stacks above image */}
          <div className="order-2 lg:order-1">
            <FadeIn>
              <Badge variant="glass" className="mb-6 gap-1.5 px-3 py-1">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" />
                </span>
                <Sparkles className="h-3.5 w-3.5" aria-hidden />
                Open to opportunities
              </Badge>
            </FadeIn>

            <FadeIn delay={0.05}>
              <p className="text-sm font-medium text-muted-foreground sm:text-base">
                Hi, I&apos;m {firstName} —
              </p>
            </FadeIn>

            <FadeIn delay={0.1}>
              <h1 className="mt-2 text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl xl:text-7xl">
                <span className="block">{name}</span>
                <span className="mt-1 block bg-gradient-to-r from-primary via-violet-500 to-cyan-500 bg-clip-text text-transparent">
                  {title}
                </span>
              </h1>
            </FadeIn>

            <FadeIn delay={0.15}>
              <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground sm:text-xl">
                {tagline}
              </p>
            </FadeIn>

            {location && (
              <FadeIn delay={0.2}>
                <p className="mt-4 flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
                  {location}
                </p>
              </FadeIn>
            )}

            <FadeIn delay={0.25}>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
                <Link
                  href="/projects"
                  className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
                >
                  View My Work
                  <ArrowRight className="h-4 w-4" aria-hidden />
                </Link>
                <Link
                  href="/contact"
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full sm:w-auto"
                  )}
                >
                  Let&apos;s Talk
                </Link>
                <a
                  href="/resume.pdf"
                  className={cn(
                    buttonVariants({ variant: "ghost", size: "lg" }),
                    "w-full sm:w-auto"
                  )}
                  download
                >
                  <Download className="h-4 w-4" aria-hidden />
                  Resume
                </a>
              </div>
            </FadeIn>
          </div>

          {/* Profile image — centered on mobile, right on desktop */}
          <FadeIn
            delay={0.15}
            direction="left"
            className="order-1 flex justify-center lg:order-2 lg:justify-end"
          >
            <ProfileAvatar name={name} src={avatarUrl} size="xl" priority />
          </FadeIn>
        </div>
      </div>
    </section>
  );
}
