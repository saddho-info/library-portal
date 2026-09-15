import { NextResponse, type NextRequest } from "next/server";
import { refreshRequest } from "@/lib/auth/api";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "@/lib/auth/config";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";
import { DEFAULT_AFTER_LOGIN, safeNextPath } from "@/lib/auth/paths";

const PUBLIC_PREFIXES = ["/login", "/design-system"];

function isPublicPath(pathname: string): boolean {
  if (pathname.startsWith("/api/auth")) {
    return true;
  }
  return PUBLIC_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const access = request.cookies.get(ACCESS_COOKIE)?.value;
  const refresh = request.cookies.get(REFRESH_COOKIE)?.value;
  const isPublic = isPublicPath(pathname);

  if (isPublic) {
    if (pathname === "/login" && (access || refresh)) {
      return NextResponse.redirect(new URL(DEFAULT_AFTER_LOGIN, request.url));
    }
    return NextResponse.next();
  }

  if (!access && !refresh) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("next", safeNextPath(pathname));
    return NextResponse.redirect(loginUrl);
  }

  if (!access && refresh) {
    try {
      const tokens = await refreshRequest(refresh);
      const response = NextResponse.next();
      setAuthCookies(response, tokens);
      return response;
    } catch {
      const loginUrl = new URL("/login", request.url);
      const response = NextResponse.redirect(loginUrl);
      clearAuthCookies(response);
      return response;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
