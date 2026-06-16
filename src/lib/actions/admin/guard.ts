"use server";

import { getSession } from "@/lib/auth/session";
import type { ActionResult, AdminSession } from "@/lib/auth/types";

export async function assertAdmin(): Promise<ActionResult<AdminSession>> {
  const session = await getSession();

  if (!session) {
    return { success: false, error: "You must be signed in." };
  }

  if (!session.isAdmin || !session.profile) {
    return { success: false, error: "Admin access required." };
  }

  return {
    success: true,
    data: {
      user: session.user,
      profile: session.profile,
      isAdmin: true,
    },
  };
}
