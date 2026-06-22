import { notFound } from "next/navigation";
import { ExperienceForm } from "@/components/dashboard/experience-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getExperienceById } from "@/lib/cms/experience";
import { createMetadata } from "@/lib/seo";

interface EditExperiencePageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditExperiencePageProps) {
  const { id } = await params;
  const experience = await getExperienceById(id);
  return createMetadata({
    title: experience ? `Edit: ${experience.role}` : "Edit Experience",
    noIndex: true,
  });
}

export default async function EditExperiencePage({ params }: EditExperiencePageProps) {
  await requireAdmin();
  const { id } = await params;
  const experience = await getExperienceById(id);

  if (!experience) notFound();

  return (
    <div>
      <PageHeader
        title="Edit Experience"
        description={`${experience.role} at ${experience.company_name}`}
      />
      <div className="mt-6">
        <ExperienceForm experience={experience} showBackLink />
      </div>
    </div>
  );
}
