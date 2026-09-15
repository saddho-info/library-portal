import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { meRequest } from "@/lib/auth/api";
import { ACCESS_COOKIE, isAllowedLibraryRole } from "@/lib/auth/config";
import type { PublicUser } from "@/lib/auth/types";

export async function getSessionUser(): Promise<PublicUser | null> {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return null;
  }

  try {
    const user = await meRequest(accessToken);
    if (!isAllowedLibraryRole(user.role)) {
      return null;
    }
    return user;
  } catch {
    return null;
  }
}

export async function requireLibrarySession(): Promise<PublicUser> {
  const user = await getSessionUser();
  if (!user) {
    redirect("/login");
  }
  return user;
}
