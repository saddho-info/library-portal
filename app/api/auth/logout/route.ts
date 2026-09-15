import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { logoutRequest } from "@/lib/auth/api";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/config";
import { clearAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  const jar = await cookies();
  await logoutRequest({
    accessToken: jar.get(ACCESS_COOKIE)?.value,
    refreshToken: jar.get(REFRESH_COOKIE)?.value,
  });
  const response = NextResponse.json({ ok: true });
  clearAuthCookies(response);
  return response;
}
