import Link from "next/link";
import type { ReactNode } from "react";
import { PageHeader } from "@/components/portal/page-header";
import { buttonClassName } from "@/components/ui/button-styles";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
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
  formatCopyNumber,
  formatIsbn13,
  formatMoney,
  formatSaleDate,
} from "@/lib/sales/format";
import type { SaleDetail } from "@/lib/sales/types";

export function SaleDetailView({ sale }: { sale: SaleDetail }) {
  const listTotalCents = sale.items.reduce(
    (sum, item) => sum + item.edition.listPriceCents * item.quantity,
    0,
  );
  const discountCents = Math.max(0, listTotalCents - sale.totalCents);

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={sale.code}
        description={`Sold ${formatSaleDate(sale.soldAt)}`}
        actions={
          <div className="flex flex-wrap gap-2">
            <Link
              href="/sales"
              className={buttonClassName({ variant: "outline" })}
            >
              All sales
            </Link>
            <Link href="/sales/new" className={buttonClassName()}>
              New sale
            </Link>
          </div>
        }
      />

      <Card>
        <CardHeader>
          <CardTitle>Sale</CardTitle>
          <CardDescription>
            Inventory was decremented when this sale was confirmed.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-3 text-sm">
          <Field
            label="Total"
            value={formatMoney(sale.totalCents, sale.currency)}
          />
          {discountCents > 0 ? (
            <Field
              label="Discount"
              value={formatMoney(discountCents, sale.currency)}
            />
          ) : null}
          <Field
            label="Recorded by"
            value={`${sale.actor.firstName} ${sale.actor.lastName}`}
          />
          {sale.notes ? <Field label="Notes" value={sale.notes} /> : null}
        </CardContent>
      </Card>

      <section className="flex flex-col gap-3">
        <h2 className="text-base font-semibold">Line items</h2>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Copy</TableHead>
              <TableHead>Edition</TableHead>
              <TableHead className="text-right">Price</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sale.items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <p className="font-medium">{item.edition.book.title}</p>
                  <p className="text-xs text-muted-foreground">
                    {item.edition.book.authors}
                  </p>
                </TableCell>
                <TableCell>
                  <Link
                    href={`/inventory/copies/${item.copy.id}`}
                    className="tabular-nums hover:text-primary hover:underline"
                  >
                    {formatCopyNumber(item.copy.copyNumber)}
                  </Link>
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {formatBookFormat(item.edition.format)} ·{" "}
                  {formatIsbn13(item.edition.isbn)}
                </TableCell>
                <TableCell className="text-right tabular-nums">
                  {formatMoney(item.unitPriceCents, sale.currency)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </section>
    </div>
  );
}

function Field({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="flex flex-col gap-0.5 sm:flex-row sm:gap-3">
      <dt className="w-28 shrink-0 text-muted-foreground">{label}</dt>
      <dd className="min-w-0">{value}</dd>
    </div>
  );
}
