import { ProfileForm } from "@/components/dashboard/profile-form";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Profile Management",
  noIndex: true,
});

export default async function ProfileManagementPage() {
  const session = await requireAdmin();
  return <ProfileForm profile={session.profile} />;
}
