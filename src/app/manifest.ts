import type { MetadataRoute } from "next";
import { getProfile } from "@/lib/cms/queries";
import { buildSiteConfig } from "@/lib/seo";
import { getFirstName } from "@/lib/utils";

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const profile = await getProfile();
  const config = buildSiteConfig(profile);
  const shortName = getFirstName(profile.full_name) || config.name;

  return {
    name: config.name,
    short_name: shortName,
    description: config.description,
    start_url: "/",
    display: "standalone",
    background_color: "#030712",
    theme_color: "#6366f1",
    icons: [
      {
        src: "/favicon.ico",
        sizes: "any",
        type: "image/x-icon",
      },
    ],
  };
}
