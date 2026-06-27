import { notFound } from "next/navigation";
import { ProjectForm } from "@/components/dashboard/project-form";
import { PageHeader } from "@/components/dashboard/page-header";
import { requireAdmin } from "@/lib/auth/session";
import { getProjectById } from "@/lib/cms/projects";
import { createMetadata } from "@/lib/seo";

interface EditProjectPageProps {
  params: Promise<{ id: string }>;
}

export async function generateMetadata({ params }: EditProjectPageProps) {
  const { id } = await params;
  const project = await getProjectById(id);
  return createMetadata({
    title: project ? `Edit: ${project.title}` : "Edit Project",
    noIndex: true,
  });
}

export default async function EditProjectPage({ params }: EditProjectPageProps) {
  await requireAdmin();
  const { id } = await params;
  const project = await getProjectById(id);

  if (!project) notFound();

  return (
    <div>
      <PageHeader title="Edit Project" description={project.title} />
      <div className="mt-6">
        <ProjectForm project={project} showBackLink />
      </div>
    </div>
  );
}
