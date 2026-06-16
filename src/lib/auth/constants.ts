export const ROLES = {
  ADMIN: "admin",
  VIEWER: "viewer",
} as const;

export type UserRole = (typeof ROLES)[keyof typeof ROLES];

export const ADMIN_ROUTES_PREFIX = "/dashboard";
