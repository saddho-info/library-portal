import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { formatMoney } from "@/lib/sales/format";
import type { TitleSaleOption } from "@/components/sales/title-sale-form";
import { buttonClassName } from "@/components/ui/button-styles";

export function manualSaleHref(input: {
  product?: string;
  editionId?: string;
  copyId?: string;
}): string {
  const params = new URLSearchParams();
  if (input.product) {
    params.set("product", input.product);
  }
  if (input.editionId) {
    params.set("editionId", input.editionId);
  }
  if (input.copyId) {
    params.set("copyId", input.copyId);
  }
  const query = params.toString();
  return query ? `/sales/new?${query}` : "/sales/new";
}

export function ManualProductEntry({
  product,
  matches,
  selectedEditionId,
  copyId,
}: {
  product: string;
  matches: TitleSaleOption[];
  selectedEditionId?: string;
  copyId?: string;
}) {
  const showChoices = product.length > 0 && matches.length > 1;

  return (
    <div className="flex flex-col gap-4">
      <form method="get" className="flex flex-col gap-2 sm:flex-row sm:items-end">
        {copyId ? <input type="hidden" name="copyId" value={copyId} /> : null}
        <div className="min-w-0 flex-1">
          <Input
            name="product"
            label="ISBN or title"
            placeholder="9780306406157 or book title"
            defaultValue={product}
            hint="Type the ISBN from the book or the title when a scanner is not available."
          />
        </div>
        <Button type="submit" variant="secondary">
          Find product
        </Button>
      </form>

      {product && matches.length === 0 ? (
        <p className="text-sm text-destructive" role="status">
          No on-hand copies match that ISBN or title. Check the number, or sell
          with a QR token below.
        </p>
      ) : null}

      {showChoices ? (
        <ul className="flex flex-col gap-2">
          {matches.map((edition) => {
            const selected = edition.editionId === selectedEditionId;
            return (
              <li key={edition.editionId}>
                <Link
                  href={manualSaleHref({
                    product,
                    editionId: edition.editionId,
                    copyId,
                  })}
                  className={`flex items-center justify-between gap-3 rounded-md border px-3 py-2 text-sm ${
                    selected
                      ? "border-primary bg-muted/60"
                      : "border-border hover:bg-muted/40"
                  }`}
                  aria-current={selected ? "true" : undefined}
                >
                  <span>
                    <span className="font-medium">{edition.title}</span>
                    <span className="mt-0.5 block text-xs text-muted-foreground">
                      {edition.format} · ISBN {edition.isbn} · {edition.onHand}{" "}
                      on hand ·{" "}
                      {formatMoney(edition.listPriceCents, edition.currency)}
                    </span>
                  </span>
                  <span className={buttonClassName({ variant: "outline", size: "sm" })}>
                    {selected ? "Selected" : "Sell"}
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      ) : null}
    </div>
  );
}
