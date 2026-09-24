import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  formatBookFormat,
  formatCount,
  formatIsbn13,
} from "@/lib/inventory/format";
import type { InventoryRollup } from "@/lib/inventory/types";
import { formatMoney, formatSaleDate } from "@/lib/sales/format";
import type { SaleListItem } from "@/lib/sales/types";
import type { StockReceipt } from "@/lib/receiving/types";

export function PublisherTitlesTable({
  rows,
  showSellLink = false,
}: {
  rows: InventoryRollup[];
  showSellLink?: boolean;
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Title</TableHead>
          <TableHead>ISBN</TableHead>
          <TableHead className="text-right">On hand</TableHead>
          <TableHead className="text-right">Sold</TableHead>
          {showSellLink ? <TableHead className="text-right">Action</TableHead> : null}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.editionId}>
            <TableCell>
              <Link
                href={`/inventory/${row.editionId}`}
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {row.book.title}
              </Link>
              <p className="text-xs text-muted-foreground">
                {formatBookFormat(row.format)}
                {row.editionTitle ? ` · ${row.editionTitle}` : ""}
              </p>
            </TableCell>
            <TableCell className="font-mono text-xs text-muted-foreground">
              {formatIsbn13(row.isbn)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(row.libraryOnHand)}
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(row.sold)}
            </TableCell>
            {showSellLink ? (
              <TableCell className="text-right">
                {row.libraryOnHand > 0 ? (
                  <Link
                    href={`/sales/new?editionId=${row.editionId}`}
                    className="text-sm font-medium text-primary hover:underline"
                  >
                    Sell this title
                  </Link>
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
            ) : null}
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

export function PublisherSalesTable({ sales }: { sales: SaleListItem[] }) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Sold</TableHead>
          <TableHead>Title</TableHead>
          <TableHead className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sales.map((sale) => {
          const first = sale.items[0];
          return (
            <TableRow key={sale.id}>
              <TableCell className="text-muted-foreground">
                {formatSaleDate(sale.soldAt)}
              </TableCell>
              <TableCell>
                <Link
                  href={`/sales/${sale.id}`}
                  className="font-medium text-foreground hover:text-primary hover:underline"
                >
                  {first?.edition.book.title ?? sale.code}
                </Link>
                {sale.itemCount > 1 ? (
                  <p className="text-xs text-muted-foreground">
                    +{sale.itemCount - 1} more
                  </p>
                ) : null}
              </TableCell>
              <TableCell className="text-right tabular-nums">
                {formatMoney(sale.totalCents, sale.currency)}
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>
    </Table>
  );
}

export function PublisherReceiptsTable({
  receipts,
}: {
  receipts: StockReceipt[];
}) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Received</TableHead>
          <TableHead>Receipt</TableHead>
          <TableHead className="text-right">Copies</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {receipts.map((receipt) => (
          <TableRow key={receipt.id}>
            <TableCell className="text-muted-foreground">
              {formatSaleDate(receipt.confirmedAt)}
            </TableCell>
            <TableCell>
              <Link
                href={`/receiving/receipts/${receipt.id}`}
                className="font-medium text-foreground hover:text-primary hover:underline"
              >
                {receipt.code}
              </Link>
              <p className="text-xs text-muted-foreground">
                {receipt.distribution.code}
              </p>
            </TableCell>
            <TableCell className="text-right tabular-nums">
              {formatCount(receipt.receivedCount)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}
