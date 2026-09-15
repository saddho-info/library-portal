import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/portal/page-header";
import { ReceivingStepper } from "@/components/receiving/receiving-stepper";
import { buttonClassName } from "@/components/ui/button-styles";
import { StatusPill, type StatusValue } from "@/components/ui/status-pill";
import { ApiError } from "@/lib/api/server";
import { getShipment, getStockReceipts } from "@/lib/receiving/get-receiving";
import { isReceivable } from "@/lib/receiving/types";
import { ReceiptsTable } from "@/components/receiving/receipts-table";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ distributionId: string }>;
}): Promise<Metadata> {
  const { distributionId } = await params;
  try {
    const shipment = await getShipment(distributionId);
    return { title: shipment.code };
  } catch {
    return { title: "Shipment" };
  }
}

export default async function ReceiveShipmentPage({
  params,
}: {
  params: Promise<{ distributionId: string }>;
}) {
  const { distributionId } = await params;
  const shipment = await getShipment(distributionId).catch((error: unknown) => {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      notFound();
    }
    throw error;
  });

  const receipts = await getStockReceipts({
    distributionId: shipment.id,
    limit: 20,
  });
  const receivable = isReceivable(shipment.status);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={shipment.code}
        description={`${shipment.publisher.name} · ${shipment.itemCount} edition line${shipment.itemCount === 1 ? "" : "s"}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill status={shipment.status as StatusValue} />
            <Link
              href="/receiving"
              className={buttonClassName({ variant: "outline" })}
            >
              All receiving
            </Link>
          </div>
        }
      />

      {receivable ? (
        <ReceivingStepper shipment={shipment} />
      ) : (
        <p className="text-sm text-muted-foreground">
          This shipment is {shipment.status.replaceAll("_", " ").toLowerCase()}{" "}
          and cannot be received again.
        </p>
      )}

      {receipts.data.length > 0 ? (
        <section className="flex flex-col gap-3">
          <h2 className="text-sm font-semibold">Receipts for this shipment</h2>
          <ReceiptsTable receipts={receipts.data} />
        </section>
      ) : null}
    </div>
  );
}
