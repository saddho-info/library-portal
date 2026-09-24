import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { ManualProductEntry } from "@/components/sales/manual-product-entry";
import { SaleForm } from "@/components/sales/sale-form";
import { TitleSaleForm } from "@/components/sales/title-sale-form";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ApiError } from "@/lib/api/server";
import { formatCopyNumber } from "@/lib/inventory/format";
import { getCopy, getInventory } from "@/lib/inventory/get-inventory";
import {
  productLookupTerm,
  resolveManualEditionId,
} from "@/lib/sales/manual-product";

export const metadata: Metadata = {
  title: "New sale",
};

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{
    copyId?: string;
    editionId?: string;
    product?: string;
  }>;
}) {
  const params = await searchParams;
  const copyId = params.copyId?.trim();
  const editionIdParam = params.editionId?.trim();
  const product = params.product?.trim() ?? "";
  const lookup = product ? productLookupTerm(product) : "";

  const copy = copyId
    ? await getCopy(copyId, false).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      })
    : null;

  const copyBlocked = Boolean(copy && copy.status !== "IN_STOCK_LIBRARY");
  const initialEditionId =
    editionIdParam || (copy?.status === "IN_STOCK_LIBRARY" ? copy.editionId : undefined);

  const inventory = await getInventory(
    lookup ? { search: lookup, limit: 20 } : { page: 1, limit: 100 },
  );
  let onHandEditions = inventory.data
    .filter((row) => row.libraryOnHand > 0)
    .map((row) => ({
      editionId: row.editionId,
      title: row.book.title,
      isbn: row.isbn,
      format: row.format,
      listPriceCents: row.listPriceCents,
      currency: row.currency,
      onHand: row.libraryOnHand,
    }));

  if (
    initialEditionId &&
    !onHandEditions.some((edition) => edition.editionId === initialEditionId)
  ) {
    const pinned = await getInventory({ editionId: initialEditionId, limit: 1 });
    const row = pinned.data.find((item) => item.libraryOnHand > 0);
    if (row) {
      onHandEditions = [
        {
          editionId: row.editionId,
          title: row.book.title,
          isbn: row.isbn,
          format: row.format,
          listPriceCents: row.listPriceCents,
          currency: row.currency,
          onHand: row.libraryOnHand,
        },
        ...onHandEditions,
      ];
    }
  }

  const manualEditionId = lookup
    ? resolveManualEditionId(
        onHandEditions.map((edition) => edition.editionId),
        editionIdParam,
      )
    : initialEditionId;

  const saleEditions =
    lookup && manualEditionId
      ? onHandEditions.filter((edition) => edition.editionId === manualEditionId)
      : onHandEditions;

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New sale"
        description="Sell on-hand copies by typing an ISBN or title when a scanner is not available. A QR token still works below."
        actions={
          <Link
            href="/sales"
            className={buttonClassName({ variant: "outline" })}
          >
            Cancel
          </Link>
        }
      />

      <Card className="max-w-xl">
        <CardHeader>
          <CardTitle>Enter product</CardTitle>
          <CardDescription>
            {copy && !copyBlocked
              ? `${copy.edition.book.title} · ${formatCopyNumber(copy.copyNumber)} opened this form. Choose how many copies of this edition to sell.`
              : "Look up a title by ISBN or name, then set quantity and an optional discount. Each unit is still a tracked physical copy."}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          {copyBlocked && copy ? (
            <p className="text-sm text-destructive">
              Only copies with status on hand can start a sale. This copy is{" "}
              {copy.status.replaceAll("_", " ").toLowerCase()}.{" "}
              <Link
                href={`/inventory/copies/${copy.id}`}
                className="font-medium underline"
              >
                View copy
              </Link>
            </p>
          ) : (
            <>
              {!copyId ? (
                <ManualProductEntry
                  product={product}
                  matches={onHandEditions}
                  selectedEditionId={manualEditionId}
                />
              ) : null}
              {!lookup || manualEditionId ? (
                <TitleSaleForm
                  editions={saleEditions}
                  initialEditionId={manualEditionId}
                />
              ) : null}
            </>
          )}
        </CardContent>
      </Card>

      {!copyId ? (
        <Card className="max-w-xl">
          <CardHeader>
            <CardTitle>Sell by QR token</CardTitle>
            <CardDescription>
              Paste a scanned token to sell one specific physical copy at list
              price (or a price you enter).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SaleForm />
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
