"use client";

import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { FadeIn } from "@/components/motion/fade-in";
import { SectionShell } from "@/components/sections/section-shell";
import { buttonVariants } from "@/components/ui/button";
import { cn, getFirstName } from "@/lib/utils";

interface ContactCTASectionProps {
  name: string;
  email?: string;
}

export function ContactCTASection({ name, email }: ContactCTASectionProps) {
  const firstName = getFirstName(name) || name;

  return (
    <SectionShell id="contact" variant="muted" ariaLabelledBy="contact-heading">
      <FadeIn>
        <div className="relative overflow-hidden rounded-3xl border border-border/50 bg-gradient-to-br from-primary/10 via-violet-500/5 to-cyan-500/10 p-8 sm:p-12 lg:p-16">
          <div
            className="pointer-events-none absolute -top-24 -right-24 h-64 w-64 rounded-full bg-primary/20 blur-3xl"
            aria-hidden
          />
          <div
            className="pointer-events-none absolute -bottom-24 -left-24 h-64 w-64 rounded-full bg-cyan-500/10 blur-3xl"
            aria-hidden
          />

          <div className="relative mx-auto max-w-2xl text-center">
            <div className="mx-auto mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
              <Mail className="h-6 w-6" aria-hidden />
            </div>

            <h2
              id="contact-heading"
              className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl"
            >
              Let&apos;s build something{" "}
              <span className="bg-gradient-to-r from-primary to-cyan-500 bg-clip-text text-transparent">
                remarkable
              </span>
            </h2>

            <p className="mt-4 text-base leading-relaxed text-muted-foreground sm:text-lg">
              Whether you have a project in mind, an open role, or just want to connect — I&apos;d
              love to hear from you.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link
                href="/contact"
                className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto")}
              >
                Get in Touch
                <ArrowRight className="h-4 w-4" aria-hidden />
              </Link>
              {email && (
                <a
                  href={`mailto:${email}`}
                  className={cn(
                    buttonVariants({ variant: "outline", size: "lg" }),
                    "w-full sm:w-auto"
                  )}
                >
                  Email {firstName}
                </a>
              )}
            </div>
          </div>
        </div>
      </FadeIn>
    </SectionShell>
  );
}
