import type { PublicUser } from "@/lib/auth/types";

export function formatRole(role: string): string {
  switch (role) {
    case "SUPER_ADMIN":
      return "Super admin";
    case "LIBRARY_ADMIN":
      return "Library admin";
    case "LIBRARY_STAFF":
      return "Library staff";
    default:
      return role.replace(/_/g, " ").toLowerCase();
  }
}

export function userInitials(
  user: Pick<PublicUser, "firstName" | "lastName">,
): string {
  const first = user.firstName.trim().charAt(0);
  const last = user.lastName.trim().charAt(0);
  return `${first}${last}`.toUpperCase() || "?";
}

export function canManageLibrary(role: string): boolean {
  return role === "SUPER_ADMIN" || role === "LIBRARY_ADMIN";
}
