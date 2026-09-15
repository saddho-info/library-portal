import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CopiesTable } from "@/components/inventory/copies-table";
import { MovementsTable } from "@/components/inventory/movements-table";
import { PageHeader } from "@/components/portal/page-header";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { ApiError } from "@/lib/api/server";
import {
  formatBookFormat,
  formatCount,
  formatIsbn13,
} from "@/lib/inventory/format";
import {
  getCopies,
  getInventory,
  getMovements,
} from "@/lib/inventory/get-inventory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ editionId: string }>;
}): Promise<Metadata> {
  const { editionId } = await params;
  try {
    const result = await getInventory({ editionId, limit: 1 });
    const row = result.data[0];
    return { title: row ? `${row.book.title} stock` : "Edition stock" };
  } catch {
    return { title: "Edition stock" };
  }
}

export default async function LibraryEditionInventoryPage({
  params,
}: {
  params: Promise<{ editionId: string }>;
}) {
  const { editionId } = await params;
  const rollups = await getInventory({ editionId, limit: 1 }).catch(
    (error: unknown) => {
      if (error instanceof ApiError && error.status === 404) {
        notFound();
      }
      throw error;
    },
  );
  const rollup = rollups.data[0];
  if (!rollup) {
    notFound();
  }

  const [copies, movements] = await Promise.all([
    getCopies({ editionId, limit: 50 }),
    getMovements({ editionId, limit: 10 }),
  ]);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={rollup.book.title}
        description={`${formatBookFormat(rollup.format)} · ${formatIsbn13(rollup.isbn)}`}
        actions={
          <Link
            href="/inventory"
            className={buttonClassName({ variant: "outline" })}
          >
            All inventory
          </Link>
        }
      />

      <section className="grid gap-3 sm:grid-cols-3">
        <Card>
          <CardHeader>
            <CardDescription>On hand</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(rollup.libraryOnHand || rollup.totalOnHand)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Sold</CardDescription>
            <CardTitle className="text-2xl tabular-nums">
              {formatCount(rollup.sold)}
            </CardTitle>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader>
            <CardDescription>Authors</CardDescription>
            <CardTitle className="text-base font-medium">
              {rollup.book.authors}
            </CardTitle>
          </CardHeader>
        </Card>
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Copies at this library</h2>
        {copies.data.length === 0 ? (
          <EmptyState
            title="No copies here yet"
            description="Units show up after a shipment is received."
          />
        ) : (
          <CopiesTable copies={copies.data} />
        )}
      </section>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Recent movements</h2>
        {movements.data.length === 0 ? (
          <EmptyState
            title="No movements"
            description="Receipts and sales for this edition will appear here."
          />
        ) : (
          <MovementsTable movements={movements.data} />
        )}
      </section>
    </div>
  );
}
