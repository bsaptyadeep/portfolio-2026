import { createClient } from "@/lib/supabase/server";
import { toTimelineEntry } from "@/lib/experience/utils";
import type { ExperienceTimelineEntry } from "@/types/experience";

function isSupabaseConfigured() {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL &&
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

/**
 * Fetches experience entries for the timeline component.
 * Ordered by sort_order ascending (most recent roles typically use lower sort_order).
 */
export async function getExperienceTimeline(
  options: { publishedOnly?: boolean; limit?: number } = {}
): Promise<ExperienceTimelineEntry[]> {
  const { publishedOnly = true, limit } = options;

  if (!isSupabaseConfigured()) return [];

  const supabase = await createClient();
  let query = supabase
    .from("experiences")
    .select("*")
    .order("sort_order", { ascending: true });

  if (publishedOnly) {
    query = query.eq("published", true);
  }

  if (limit) {
    query = query.limit(limit);
  }

  const { data } = await query;
  const entries = (data ?? []).map(toTimelineEntry);
  return entries;
}
