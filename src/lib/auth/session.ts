import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROLES } from "@/lib/auth/constants";
import type { AdminSession } from "@/lib/auth/types";
import type { Profile } from "@/types/database";

export async function getSession() {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return null;
  }

  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (!profile) return { user, profile: null, isAdmin: false as const };

  return {
    user,
    profile,
    isAdmin: profile.role === ROLES.ADMIN,
  };
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) redirect("/login");
  return session;
}

export async function requireAdmin(): Promise<AdminSession> {
  const session = await requireAuth();

  if (!session.profile || session.profile.role !== ROLES.ADMIN) {
    redirect("/unauthorized");
  }

  return {
    user: session.user,
    profile: session.profile,
    isAdmin: true,
  };
}

export async function getAdminProfile(): Promise<Profile | null> {
  const session = await getSession();
  if (!session?.isAdmin || !session.profile) return null;
  return session.profile;
}
