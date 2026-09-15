import type { Metadata } from "next";
import Link from "next/link";
import { PageHeader } from "@/components/portal/page-header";
import { SaleForm } from "@/components/sales/sale-form";
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
import { getCopy } from "@/lib/inventory/get-inventory";
import { dollarsFromCents } from "@/lib/sales/format";

export const metadata: Metadata = {
  title: "New sale",
};

export default async function NewSalePage({
  searchParams,
}: {
  searchParams: Promise<{ copyId?: string }>;
}) {
  const params = await searchParams;
  const copyId = params.copyId?.trim();

  const copy = copyId
    ? await getCopy(copyId, false).catch((error: unknown) => {
        if (error instanceof ApiError && error.status === 404) {
          return null;
        }
        throw error;
      })
    : null;

  const canSell = copy?.status === "IN_STOCK_LIBRARY";

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="New sale"
        description="Confirm a sale for one physical copy. Inventory updates immediately."
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
          <CardTitle>
            {copy ? "Confirm copy sale" : "Sell by QR token"}
          </CardTitle>
          <CardDescription>
            {copy
              ? canSell
                ? `List price ${dollarsFromCents(copy.edition.listPriceCents)} ${copy.edition.currency}. You can override the unit price.`
                : `This copy is ${copy.status.replaceAll("_", " ").toLowerCase()} and cannot be sold.`
              : "Paste the opaque QR token from a scanned copy that is on hand at this library."}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {copy && !canSell ? (
            <p className="text-sm text-destructive">
              Only copies with status on hand can be sold.{" "}
              <Link
                href={`/inventory/copies/${copy.id}`}
                className="font-medium underline"
              >
                View copy
              </Link>
            </p>
          ) : (
            <SaleForm
              copyId={canSell ? copy?.id : undefined}
              defaultPriceCents={
                canSell ? copy?.edition.listPriceCents : undefined
              }
              defaultCurrency={copy?.edition.currency}
              title={copy?.edition.book.title}
              copyLabel={
                copy
                  ? `${formatCopyNumber(copy.copyNumber)} · ${copy.edition.format}`
                  : undefined
              }
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
