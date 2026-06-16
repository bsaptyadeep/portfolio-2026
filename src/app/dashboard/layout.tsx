import { DashboardSidebar } from "@/components/layout/dashboard-sidebar";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";

export const metadata = createMetadata({
  title: "Dashboard",
  noIndex: true,
});

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await requireAdmin();

  return (
    <div className="gradient-mesh flex min-h-dvh">
      <DashboardSidebar
        userEmail={session.user.email}
        userName={session.profile.full_name}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
      </div>
    </div>
  );
}
