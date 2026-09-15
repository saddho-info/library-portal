import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MovementsTable } from "@/components/inventory/movements-table";
import { PageHeader } from "@/components/portal/page-header";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { StatusPill } from "@/components/ui/status-pill";
import { ApiError } from "@/lib/api/server";
import {
  formatBookFormat,
  formatCopyNumber,
  formatIsbn13,
} from "@/lib/inventory/format";
import { getCopy, getMovements } from "@/lib/inventory/get-inventory";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ copyId: string }>;
}): Promise<Metadata> {
  const { copyId } = await params;
  try {
    const copy = await getCopy(copyId, false);
    return {
      title: `${copy.edition.book.title} ${formatCopyNumber(copy.copyNumber)}`,
    };
  } catch {
    return { title: "Copy" };
  }
}

export default async function LibraryCopyDetailPage({
  params,
}: {
  params: Promise<{ copyId: string }>;
}) {
  const { copyId } = await params;
  const copy = await getCopy(copyId, true).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });
  const movements = await getMovements({ copyId, limit: 20 });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${copy.edition.book.title} ${formatCopyNumber(copy.copyNumber)}`}
        description={`${formatBookFormat(copy.edition.format)} · ${formatIsbn13(copy.edition.isbn)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            {copy.status === "IN_STOCK_LIBRARY" ? (
              <Link
                href={`/sales/new?copyId=${copy.id}`}
                className={buttonClassName()}
              >
                Sell copy
              </Link>
            ) : null}
            <Link
              href={`/inventory/${copy.editionId}`}
              className={buttonClassName({ variant: "outline" })}
            >
              Back to edition
            </Link>
          </div>
        }
      />

      <div className="flex flex-wrap items-center gap-2">
        <StatusPill status={copy.status} />
        <span className="text-sm text-muted-foreground">
          {copy.library?.name ?? "This library"}
        </span>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>QR token</CardTitle>
          <CardDescription>
            The scan payload is this opaque token, looked up server-side.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          <p className="break-all font-mono text-xs text-muted-foreground">
            {copy.qrToken ?? "No token on this copy."}
          </p>
          {copy.qrImageDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={copy.qrImageDataUrl}
              alt={`QR code for copy ${formatCopyNumber(copy.copyNumber)}`}
              className="size-48 rounded-md border border-border bg-white p-2"
            />
          ) : null}
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Movements</h2>
        {movements.data.length === 0 ? (
          <EmptyState
            title="No movements for this copy"
            description="Receipt and sale events will be listed here."
          />
        ) : (
          <MovementsTable movements={movements.data} />
        )}
      </section>
    </div>
  );
}
