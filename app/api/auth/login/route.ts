import { NextResponse } from "next/server";
import { loginRequest } from "@/lib/auth/api";
import { isAllowedLibraryRole } from "@/lib/auth/config";
import { clearAuthCookies, setAuthCookies } from "@/lib/auth/cookies";

export async function POST(request: Request) {
  const body = (await request.json()) as { email?: string; password?: string };
  if (!body.email || !body.password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  try {
    const tokens = await loginRequest(body.email, body.password);
    if (!isAllowedLibraryRole(tokens.user.role)) {
      const response = NextResponse.json(
        {
          message:
            "This account cannot access the Library Portal. Use the Publisher Dashboard instead.",
        },
        { status: 403 },
      );
      clearAuthCookies(response);
      return response;
    }

    const response = NextResponse.json({ user: tokens.user });
    setAuthCookies(response, tokens);
    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Unable to sign in";
    const status = message.toLowerCase().includes("invalid") ? 401 : 400;
    return NextResponse.json({ message }, { status });
  }
}
