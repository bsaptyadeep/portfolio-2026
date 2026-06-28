import Link from "next/link";
import { GitHubIcon, LinkedInIcon } from "@/components/icons/social";
import { Separator } from "@/components/ui/separator";
import { navLinks } from "@/lib/data/seed";

interface FooterProps {
  siteName: string;
  description: string;
  githubUrl?: string | null;
  linkedinUrl?: string | null;
}

export function Footer({ siteName, description, githubUrl, linkedinUrl }: FooterProps) {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-auto border-t border-border/50">
      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <p className="text-lg font-semibold">{siteName}</p>
            <p className="mt-2 text-sm text-muted-foreground">{description}</p>
          </div>

          <nav aria-label="Footer navigation">
            <p className="mb-3 text-sm font-medium">Navigation</p>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="mb-3 text-sm font-medium">Connect</p>
            <div className="flex gap-3">
              {githubUrl && (
                <a
                  href={githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub profile"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <GitHubIcon />
                </a>
              )}
              {linkedinUrl && (
                <a
                  href={linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn profile"
                  className="rounded-lg p-2 text-muted-foreground transition-colors hover:bg-accent hover:text-foreground"
                >
                  <LinkedInIcon />
                </a>
              )}
            </div>
          </div>
        </div>

        <Separator className="my-8" />

        <p className="text-center text-sm text-muted-foreground">
          © {year} {siteName}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
