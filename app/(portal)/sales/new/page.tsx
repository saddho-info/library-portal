import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
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

export const metadata: Metadata = {
  title: "New sale",
};

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{ copyId?: string; editionId?: string }>;
}) {
  const params = await searchParams;
  const copyId = params.copyId?.trim();
  const editionIdParam = params.editionId?.trim();

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

  const onHandEditions = (
    await getInventory({ page: 1, limit: 100 })
  ).data
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

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New sale"
        description="Sell one or more copies of the same title, with an optional discount. QR scan remains available below."
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
          <CardTitle>Sell by title</CardTitle>
          <CardDescription>
            {copy && !copyBlocked
              ? `${copy.edition.book.title} · ${formatCopyNumber(copy.copyNumber)} opened this form. Choose how many copies of this edition to sell.`
              : "Choose one edition, set quantity, and apply an amount or percent discount. Each unit is still a tracked physical copy."}
          </CardDescription>
        </CardHeader>
        <CardContent>
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
            <TitleSaleForm
              editions={onHandEditions}
              initialEditionId={initialEditionId}
            />
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
