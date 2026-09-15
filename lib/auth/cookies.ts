import { NextResponse } from "next/server";
import { ACCESS_COOKIE, REFRESH_COOKIE } from "./config";

const REFRESH_MAX_AGE = 60 * 60 * 24 * 7;

type CookieTarget = {
  cookies: {
    set: (
      name: string,
      value: string,
      options: {
        httpOnly: boolean;
        sameSite: "lax";
        secure: boolean;
        path: string;
        maxAge: number;
      },
    ) => void;
    delete: (name: string) => void;
  };
};

function cookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge,
  };
}

export function setAuthCookies(
  target: CookieTarget | NextResponse,
  tokens: { accessToken: string; refreshToken: string; expiresIn: number },
) {
  target.cookies.set(
    ACCESS_COOKIE,
    tokens.accessToken,
    cookieOptions(tokens.expiresIn),
  );
  target.cookies.set(
    REFRESH_COOKIE,
    tokens.refreshToken,
    cookieOptions(REFRESH_MAX_AGE),
  );
}

export function clearAuthCookies(target: CookieTarget | NextResponse) {
  target.cookies.delete(ACCESS_COOKIE);
  target.cookies.delete(REFRESH_COOKIE);
}
