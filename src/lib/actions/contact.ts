"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { contactSchema } from "@/lib/validations";
import type { Database } from "@/types/database";

export async function submitContactForm(formData: FormData) {
  const parsed = contactSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    subject: formData.get("subject") || undefined,
    message: formData.get("message"),
  });

  if (!parsed.success) {
    return { success: false as const, demo: false, error: parsed.error.flatten().fieldErrors };
  }

  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return { success: true as const, demo: true, error: undefined };
  }

  const supabase = await createClient();
  const payload: Database["public"]["Tables"]["contact_messages"]["Insert"] = {
    name: parsed.data.name,
    email: parsed.data.email,
    subject: parsed.data.subject ?? null,
    message: parsed.data.message,
  };
  const { error } = await supabase.from("contact_messages").insert(payload);

  if (error) {
    return { success: false as const, demo: false, error: { _form: [error.message] } };
  }

  revalidatePath("/dashboard");
  return { success: true as const, demo: false, error: undefined };
}
