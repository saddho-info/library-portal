export const DEFAULT_AFTER_LOGIN = "/receiving";

/** Allow only in-app relative paths; reject protocol-relative / open redirects. */
export function safeNextPath(value: string | null | undefined): string {
  if (!value || !value.startsWith("/") || value.startsWith("//")) {
    return DEFAULT_AFTER_LOGIN;
  }
  if (value === "/" || value === "/login") {
    return DEFAULT_AFTER_LOGIN;
  }
  return value;
}
