import { ProjectsManager } from "@/components/dashboard/projects-manager";
import { getProjects } from "@/lib/cms/queries";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Project Management",
  noIndex: true,
});

export default async function ProjectManagementPage() {
  await requireAdmin();
  const projects = await getProjects(false);

  return <ProjectsManager initialProjects={projects} />;
}
