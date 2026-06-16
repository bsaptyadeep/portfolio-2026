"use server";

import { revalidatePath } from "next/cache";
import { assertAdmin } from "@/lib/actions/admin/guard";
import { actionError } from "@/lib/auth/types";
import { createClient } from "@/lib/supabase/server";
import type { ActionResult } from "@/lib/auth/types";
import type { ContactMessage } from "@/types/database";

export async function getContactMessages(): Promise<ActionResult<ContactMessage[]>> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("contact_messages")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) return actionError(error.message);
  return { success: true, data: data ?? [] };
}

export async function markMessageRead(id: string, read: boolean): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").update({ read }).eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}

export async function deleteContactMessage(id: string): Promise<ActionResult> {
  const auth = await assertAdmin();
  if (!auth.success) return auth;

  const supabase = await createClient();
  const { error } = await supabase.from("contact_messages").delete().eq("id", id);

  if (error) return actionError(error.message);

  revalidatePath("/dashboard/settings");
  revalidatePath("/dashboard");
  return { success: true, data: undefined };
}
