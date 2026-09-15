import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/portal/page-header";
import { buttonClassName } from "@/components/ui/button-styles";
import { StatusPill, type StatusValue } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ApiError } from "@/lib/api/server";
import { formatBookFormat, formatIsbn13 } from "@/lib/inventory/format";
import { formatCopyNumber, formatShipmentDate } from "@/lib/receiving/format";
import { getStockReceipt } from "@/lib/receiving/get-receiving";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}): Promise<Metadata> {
  const { receiptId } = await params;
  try {
    const receipt = await getStockReceipt(receiptId);
    return { title: receipt.code };
  } catch {
    return { title: "Receipt" };
  }
}

export default async function ReceiptDetailPage({
  params,
}: {
  params: Promise<{ receiptId: string }>;
}) {
  const { receiptId } = await params;
  const receipt = await getStockReceipt(receiptId).catch((error: unknown) => {
    if (error instanceof ApiError && (error.status === 404 || error.status === 403)) {
      notFound();
    }
    throw error;
  });

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={receipt.code}
        description={`Shipment ${receipt.distribution.code} from ${receipt.distribution.publisher.name}`}
        actions={
          <div className="flex items-center gap-2">
            <StatusPill status={receipt.status as StatusValue} />
            <Link
              href={`/receiving/${receipt.distributionId}`}
              className={buttonClassName({ variant: "outline" })}
            >
              View shipment
            </Link>
          </div>
        }
      />

      <p className="text-sm text-muted-foreground">
        Confirmed {formatShipmentDate(receipt.confirmedAt)} by{" "}
        {receipt.actor.firstName} {receipt.actor.lastName}.{" "}
        {receipt.receivedCount} received
        {receipt.discrepancyCount > 0
          ? ` · ${receipt.discrepancyCount} discrepanc${receipt.discrepancyCount === 1 ? "y" : "ies"}`
          : ""}
        .
      </p>
      {receipt.notes ? (
        <p className="text-sm">{receipt.notes}</p>
      ) : null}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Copy</TableHead>
            <TableHead>Edition</TableHead>
            <TableHead>Received</TableHead>
            <TableHead>Discrepancy</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {receipt.items.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <Link
                  href={`/inventory/copies/${item.copyId}`}
                  className="font-medium hover:text-primary hover:underline"
                >
                  {formatCopyNumber(item.copy.copyNumber)}
                </Link>
              </TableCell>
              <TableCell>
                <p>{item.edition.book.title}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBookFormat(item.edition.format)} ·{" "}
                  {formatIsbn13(item.edition.isbn)}
                </p>
              </TableCell>
              <TableCell>{item.received ? "Yes" : "No"}</TableCell>
              <TableCell>
                {item.discrepancy === "NONE" ? (
                  "—"
                ) : (
                  <StatusPill
                    status={item.discrepancy === "MISSING" ? "FAILED" : "PARTIAL"}
                    label={item.discrepancy === "MISSING" ? "Missing" : "Damaged"}
                  />
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
