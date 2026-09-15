import Link from "next/link";
import { StatusPill, type StatusValue } from "@/components/ui/status-pill";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatCount, formatShipmentDate } from "@/lib/receiving/format";
import type { StockReceipt } from "@/lib/receiving/types";

export function ReceiptsTable({ receipts }: { receipts: StockReceipt[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Receipt</TableHead>
          <TableHead>Shipment</TableHead>
          <TableHead className="text-right">Received</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Confirmed</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((row) => (
          <TableRow key={row.id}>
            <TableCell>
              <Link
                href={`/receiving/receipts/${row.id}`}
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {row.code}
              </Link>
              {row.discrepancyCount > 0 ? (
                <p className="text-xs text-warning">
                  {row.discrepancyCount} discrepanc
                  {row.discrepancyCount === 1 ? "y" : "ies"}
                </p>
              ) : null}
            </TableCell>
            <TableCell>
              <Link
                href={`/receiving/${row.distributionId}`}
                className="hover:text-primary hover:underline"
              >
                {row.distribution.code}
              </Link>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(row.receivedCount)} / {formatCount(row.itemCount)}
            </TableCell>
            <TableCell>
              <StatusPill status={row.status as StatusValue} />
            </TableCell>
            <TableCell className="text-muted-foreground">
              {formatShipmentDate(row.confirmedAt ?? row.createdAt)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
