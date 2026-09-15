import type { Metadata } from "next";
import Link from "next/link";
import { CopiesTable } from "@/components/inventory/copies-table";
import {
  InventoryPagination,
  InventoryTable,
} from "@/components/inventory/inventory-table";
import { QrLookupForm } from "@/components/inventory/qr-lookup-form";
import { PageHeader } from "@/components/portal/page-header";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { Input } from "@/components/ui/input";
import {
  getCopies,
  getInventory,
  getInventorySummary,
} from "@/lib/inventory/get-inventory";
import { formatCount } from "@/lib/inventory/format";

export const metadata: Metadata = {
  title: "Inventory",
};

export default async function LibraryInventoryPage({
  searchParams,
}: {
  searchParams: Promise<{ search?: string; page?: string }>;
}) {
  const params = await searchParams;
  const search = params.search?.trim() ?? "";
  const page = Math.max(1, Number(params.page) || 1);

  const [summary, result, copies] = await Promise.all([
    getInventorySummary(),
    getInventory({
      page,
      limit: 20,
      search: search || undefined,
    }),
    getCopies({ limit: 8 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Inventory"
        description="Stock on hand at this library. Copies arrive after a publisher distribution is received."
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>On hand</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(summary.libraryOnHand)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>In transit</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(summary.inTransit)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sold</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(summary.sold)}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <Card>
        <CardHeader>
          <CardTitle>Identify a copy</CardTitle>
          <CardDescription>
            Paste a QR token to look up the matching unit at this library.
            Camera scanning lands in the mobile app.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <QrLookupForm />
        </CardContent>
      </Card>

      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        <div className="min-w-0 flex-1">
          <Input
            name="search"
            label="Search"
            placeholder="Title, author, or ISBN"
            defaultValue={search}
          />
        </div>
        <Button type="submit" variant="secondary">
          Filter
        </Button>
      </form>

      {result.data.length === 0 ? (
        <EmptyState
          title={search ? "No matching stock" : "No library stock yet"}
          description={
            search
              ? "Try a different title or ISBN."
              : "Inventory appears here after the publisher distributes copies and this library receives them."
          }
        />
      ) : (
        <>
          <InventoryTable rows={result.data} />
          <InventoryPagination meta={result.meta} query={{ search }} />
        </>
      )}

      {copies.data.length > 0 ? (
        <section className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-semibold">Recent copies</h2>
            <Link
              href="/inventory"
              className="text-sm font-medium text-primary hover:underline"
            >
              {formatCount(copies.meta.total)} total
            </Link>
          </div>
          <CopiesTable copies={copies.data} />
        </section>
      ) : null}
    </div>
  );
}
