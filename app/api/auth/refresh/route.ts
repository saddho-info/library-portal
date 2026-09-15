import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { refreshRequest } from "@/lib/auth/api";
import { REFRESH_COOKIE } from "@/lib/auth/config";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";

export async function POST() {
  const jar = await cookies();
  const refreshToken = jar.get(REFRESH_COOKIE)?.value;
  if (!refreshToken) {
    const response = NextResponse.json(
      { message: "Not authenticated" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }

  try {
    const tokens = await refreshRequest(refreshToken);
    const response = NextResponse.json({ user: tokens.user });
    setAuthCookies(response, tokens);
    return response;
  } catch {
    const response = NextResponse.json(
      { message: "Session expired" },
      { status: 401 },
    );
    clearAuthCookies(response);
    return response;
  }
}
