import { Footer } from "@/components/layout/footer";
import { Header } from "@/components/layout/header";
import { getProfile } from "@/lib/cms/queries";
import { buildSiteConfig } from "@/lib/seo";
import { getDisplayName, getFirstName, toGitHubUrl, toLinkedInUrl } from "@/lib/utils";

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profile = await getProfile();
  const siteName = getDisplayName(profile.full_name);
  const firstName = getFirstName(profile.full_name) || siteName;
  const { description } = buildSiteConfig(profile);

  return (
    <div className="gradient-mesh flex min-h-dvh flex-col">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-primary-foreground"
      >
        Skip to main content
      </a>
      <Header siteName={siteName} firstName={firstName} />
      <main id="main-content" className="flex-1">
        {children}
      </main>
      <Footer
        siteName={siteName}
        description={description}
        githubUrl={toGitHubUrl(profile.github)}
        linkedinUrl={toLinkedInUrl(profile.linkedin)}
      />
    </div>
  );
}
