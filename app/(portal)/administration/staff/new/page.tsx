import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/portal/page-header";
import { StaffForm } from "@/components/administration/staff-form";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { canManageLibrary } from "@/lib/auth/display";
import { requireLibrarySession } from "@/lib/auth/session";

export const metadata: Metadata = {
  title: "Add staff",
};

export default async function NewStaffPage() {
  const user = await requireLibrarySession();
  if (!canManageLibrary(user.role)) {
    redirect("/administration");
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Add staff"
        description="Create a library staff or admin account scoped to this organization."
        actions={
          <Link
            href="/administration"
            className={buttonClassName({ variant: "outline" })}
          >
            Cancel
          </Link>
        }
      />
      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Staff account</CardTitle>
          <CardDescription>
            They will sign in to this portal with the email and temporary password
            you set.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <StaffForm />
        </CardContent>
      </Card>
    </div>
  );
}
