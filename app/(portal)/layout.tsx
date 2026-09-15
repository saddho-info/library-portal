import type { ReactNode } from "react";
import { PortalShell } from "@/components/portal/shell";
import { requireLibrarySession } from "@/lib/auth/session";

export default async function PortalLayout({
  children,
}: {
  children: ReactNode;
}) {
  const user = await requireLibrarySession();
  return <PortalShell user={user}>{children}</PortalShell>;
}
