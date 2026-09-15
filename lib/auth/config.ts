export const API_URL =
  process.env.API_URL ??
  process.env.NEXT_PUBLIC_API_URL ??
  "http://localhost:3000";

export const ACCESS_COOKIE = "pt_lib_access";
export const REFRESH_COOKIE = "pt_lib_refresh";

export const LIBRARY_ROLES = [
  "SUPER_ADMIN",
  "LIBRARY_ADMIN",
  "LIBRARY_STAFF",
] as const;

export type LibraryRole = (typeof LIBRARY_ROLES)[number];

export function isAllowedLibraryRole(role: string): role is LibraryRole {
  return (LIBRARY_ROLES as readonly string[]).includes(role);
}
