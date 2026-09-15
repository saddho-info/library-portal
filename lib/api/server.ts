import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { ACCESS_COOKIE, API_URL } from "@/lib/auth/config";

export class ApiError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export async function getAccessToken(): Promise<string> {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    redirect("/login");
  }
  return accessToken;
}

export async function apiServerFetch(
  path: string,
  init: RequestInit = {},
): Promise<Response> {
  const accessToken = await getAccessToken();
  const url = new URL(path, API_URL);
  const headers = new Headers(init.headers);
  if (!headers.has("Authorization")) {
    headers.set("Authorization", `Bearer ${accessToken}`);
  }
  if (init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(url, {
    ...init,
    headers,
    cache: "no-store",
  });
}

export async function readApiError(response: Response): Promise<string> {
  const body = (await response.json().catch(() => ({}))) as {
    message?: string | string[];
  };
  if (Array.isArray(body.message)) {
    return body.message.join(" ");
  }
  if (typeof body.message === "string" && body.message.length > 0) {
    return body.message;
  }
  return `Request failed (${response.status})`;
}
