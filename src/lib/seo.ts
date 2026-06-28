import type { Metadata } from "next";
import { fallbackProfile } from "@/lib/data/seed";
import { getDisplayName } from "@/lib/utils";
import type { Profile } from "@/types/database";

const defaultDescription =
  "Full Stack Engineer crafting scalable, accessible web experiences with modern technologies.";

const baseSiteConfig = {
  description: defaultDescription,
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  ogImage: "/og-image.png",
};

export function buildSiteConfig(profile: Profile = fallbackProfile) {
  const name = getDisplayName(profile.full_name);
  const headline = profile.headline ?? "Full Stack Engineer";

  return {
    ...baseSiteConfig,
    name,
    title: `${name} — ${headline}`,
    description: profile.bio?.trim() || defaultDescription,
    twitter: profile.twitter
      ? profile.twitter.startsWith("@")
        ? profile.twitter
        : `@${profile.twitter}`
      : undefined,
  };
}

export const siteConfig = buildSiteConfig(fallbackProfile);

export function createMetadata({
  title,
  description,
  path = "",
  image,
  noIndex = false,
  profile,
}: {
  title?: string;
  description?: string;
  path?: string;
  image?: string;
  noIndex?: boolean;
  profile?: Profile;
} = {}): Metadata {
  const config = profile ? buildSiteConfig(profile) : siteConfig;
  const pageTitle = title ? `${title} | ${config.name}` : config.title;
  const pageDescription = description ?? config.description;
  const url = `${config.url}${path}`;
  const ogImage = image ?? config.ogImage;

  return {
    title: pageTitle,
    description: pageDescription,
    metadataBase: new URL(config.url),
    alternates: { canonical: url },
    openGraph: {
      title: pageTitle,
      description: pageDescription,
      url,
      siteName: config.name,
      images: [{ url: ogImage, width: 1200, height: 630, alt: pageTitle }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: pageTitle,
      description: pageDescription,
      images: [ogImage],
      ...(config.twitter ? { creator: config.twitter } : {}),
    },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
  };
}
