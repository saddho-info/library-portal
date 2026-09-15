import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { formatCount, formatMoney } from "@/lib/sales/format";
import type { SaleSummary } from "@/lib/sales/types";

export function SalesKpis({ summary }: { summary: SaleSummary }) {
  return (
    <section aria-label="Sales summary" className="grid gap-3 sm:grid-cols-3">
      <Card>
        <CardHeader>
          <CardDescription>Sales</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatCount(summary.saleCount)}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <p className="text-xs text-muted-foreground">Completed today and earlier</p>
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Copies sold</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatCount(summary.itemCount)}
          </CardTitle>
        </CardHeader>
      </Card>
      <Card>
        <CardHeader>
          <CardDescription>Revenue</CardDescription>
          <CardTitle className="text-2xl tabular-nums">
            {formatMoney(summary.totalCents)}
          </CardTitle>
        </CardHeader>
      </Card>
    </section>
  );
}
