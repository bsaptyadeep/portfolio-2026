import { ExperienceManager } from "@/components/dashboard/experience-manager";
import { getExperiences } from "@/lib/cms/queries";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Experience Management",
  noIndex: true,
});

export default async function ExperienceManagementPage() {
  await requireAdmin();
  const experiences = await getExperiences(false);

  return <ExperienceManager initialExperiences={experiences} />;
}
