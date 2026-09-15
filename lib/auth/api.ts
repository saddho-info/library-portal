import { API_URL } from "./config";
import type { AuthTokens, PublicUser } from "./types";

export async function loginRequest(
  email: string,
  password: string,
): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/v1/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, password }),
  });
  return parseAuthResponse(response);
}

export async function refreshRequest(refreshToken: string): Promise<AuthTokens> {
  const response = await fetch(`${API_URL}/api/v1/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return parseAuthResponse(response);
}

export async function logoutRequest(input: {
  accessToken?: string;
  refreshToken?: string;
}): Promise<void> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (input.accessToken) {
    headers.Authorization = `Bearer ${input.accessToken}`;
  }
  await fetch(`${API_URL}/api/v1/auth/logout`, {
    method: "POST",
    headers,
    body: JSON.stringify({ refreshToken: input.refreshToken }),
  });
}

export async function meRequest(accessToken: string): Promise<PublicUser> {
  const response = await fetch(`${API_URL}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
    cache: "no-store",
  });
  if (!response.ok) {
    throw new Error("Unauthorized");
  }
  return (await response.json()) as PublicUser;
}

async function parseAuthResponse(response: Response): Promise<AuthTokens> {
  const body = (await response.json().catch(() => ({}))) as {
    message?: string | string[];
  } & Partial<AuthTokens>;

  if (!response.ok) {
    const message = Array.isArray(body.message)
      ? body.message.join(" ")
      : (body.message ?? "Unable to sign in");
    throw new Error(message);
  }

  if (!body.accessToken || !body.refreshToken || !body.user) {
    throw new Error("Invalid auth response");
  }

  return body as AuthTokens;
}
