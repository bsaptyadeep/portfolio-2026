import { SettingsManager } from "@/components/dashboard/settings-manager";
import { createClient } from "@/lib/supabase/server";
import { requireAdmin } from "@/lib/auth/session";
import { createMetadata } from "@/lib/seo";
import type { ContactMessage } from "@/types/database";

export const metadata = createMetadata({
  title: "Settings",
  noIndex: true,
});

async function getMessages(): Promise<ContactMessage[]> {
  const supabase = await createClient();
  const { data } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });
  return data ?? [];
}

export default async function SettingsPage() {
  await requireAdmin();
  const messages = await getMessages();

  return <SettingsManager messages={messages} />;
}
