import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { LibraryProfileForm } from "@/components/administration/library-profile-form";
import { StaffTable } from "@/components/administration/staff-table";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ErrorState } from "@/components/ui/error-state";
import { canManageLibrary, formatRole } from "@/lib/auth/display";
import { requireLibrarySession } from "@/lib/auth/session";
import {
  getLibrary,
  getStaff,
} from "@/lib/administration/get-administration";

export const metadata: Metadata = {
  title: "Administration",
};

export default async function AdministrationPage() {
  const user = await requireLibrarySession();
  if (!user.libraryId) {
    return (
      <ErrorState
        title="No library on this account"
        message="This sign-in is not attached to a library organization."
      />
    );
  }

  const canManage = canManageLibrary(user.role);
  const [library, staff] = await Promise.all([
    getLibrary(user.libraryId),
    getStaff({ page: 1, limit: 50 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Administration"
        description="Library profile and staff accounts for this organization."
        actions={
          canManage ? (
            <Link href="/administration/staff/new" className={buttonClassName()}>
              Add staff
            </Link>
          ) : null
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>{library.name}</CardTitle>
          <CardDescription>
            {library.slug} · {library._count.users} user
            {library._count.users === 1 ? "" : "s"} · signed in as{" "}
            {formatRole(user.role)}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {canManage ? (
            <LibraryProfileForm library={library} />
          ) : (
            <dl className="grid gap-3 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-muted-foreground">Email</dt>
                <dd>{library.email ?? "—"}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Phone</dt>
                <dd>{library.phone ?? "—"}</dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-muted-foreground">Address</dt>
                <dd>{library.address ?? "—"}</dd>
              </div>
            </dl>
          )}
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-sm font-semibold">Staff</h2>
        {staff.data.length === 0 ? (
          <EmptyState
            title="No staff accounts"
            description="Library admins can invite staff who receive stock and record sales."
          />
        ) : (
          <StaffTable staff={staff.data} />
        )}
      </section>
    </div>
  );
}
