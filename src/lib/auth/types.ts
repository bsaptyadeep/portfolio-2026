import type { Profile } from "@/types/database";
import type { User } from "@supabase/supabase-js";

export interface AdminSession {
  user: User;
  profile: Profile;
  isAdmin: true;
}

export type ActionResult<T = void> =
  | { success: true; data: T }
  | { success: false; error: string };

export function actionError(message: string): ActionResult<never> {
  return { success: false, error: message };
}
