import { createClient } from "@/lib/supabase/server";
import type { Project } from "@/types/database";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

export async function getProjectById(id: string): Promise<Project | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createClient();
  const { data } = await supabase.from("projects").select("*").eq("id", id).single();
  return data;
}
