"use client";

import { useActionState, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createTitleSaleAction } from "@/lib/sales/actions";
import { formatMoney } from "@/lib/sales/format";
import {
  clampQuantity,
  computeTitleSaleTotals,
  MAX_TITLE_SALE_QTY,
  type DiscountType,
} from "@/lib/sales/title-sale";
import type { FormState } from "@/lib/sales/types";

export type TitleSaleOption = {
  editionId: string;
  title: string;
  isbn: string;
  format: string;
  listPriceCents: number;
  currency: string;
  onHand: number;
};

const initialState: FormState = {};

export function TitleSaleForm({
  editions,
  initialEditionId,
}: {
  editions: TitleSaleOption[];
  initialEditionId?: string;
}) {
  const [state, formAction, pending] = useActionState(
    createTitleSaleAction,
    initialState,
  );
  const [editionId, setEditionId] = useState(
    initialEditionId && editions.some((e) => e.editionId === initialEditionId)
      ? initialEditionId
      : (editions[0]?.editionId ?? ""),
  );
  const [quantity, setQuantity] = useState(1);
  const [discountType, setDiscountType] = useState<DiscountType>("amount");
  const [discountAmount, setDiscountAmount] = useState("0");
  const [discountPercent, setDiscountPercent] = useState("0");

  const selected = editions.find((edition) => edition.editionId === editionId);
  const maxQty = selected
    ? Math.min(selected.onHand, MAX_TITLE_SALE_QTY)
    : MAX_TITLE_SALE_QTY;

  const totals = useMemo(() => {
    if (!selected) {
      return null;
    }
    const qty = clampQuantity(quantity, selected.onHand);
    const discountValue =
      discountType === "amount"
        ? Number(discountAmount) || 0
        : Number(discountPercent) || 0;
    return computeTitleSaleTotals({
      listPriceCents: selected.listPriceCents,
      quantity: qty,
      discountType,
      discountValue,
    });
  }, [selected, quantity, discountType, discountAmount, discountPercent]);

  if (editions.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No on-hand titles are available to sell by quantity. Receive stock or
        sell a single copy with a QR token instead.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-4">
      <Select
        name="editionId"
        label="Title"
        value={editionId}
        onChange={(event) => {
          setEditionId(event.target.value);
          setQuantity(1);
        }}
        error={state.fieldErrors?.editionId}
        required
        options={editions.map((edition) => ({
          value: edition.editionId,
          label: `${edition.title} · ${edition.format} · ${edition.onHand} on hand`,
        }))}
      />

      {selected ? (
        <p className="text-xs text-muted-foreground">
          List price {formatMoney(selected.listPriceCents, selected.currency)} ·
          ISBN {selected.isbn}
        </p>
      ) : null}

      <Input
        name="quantity"
        label="Quantity"
        type="number"
        min={1}
        max={maxQty}
        value={quantity}
        onChange={(event) => setQuantity(Number(event.target.value) || 1)}
        error={state.fieldErrors?.quantity}
        hint={`1–${maxQty} copies of this edition`}
        required
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium">Discount</legend>
        <div className="flex flex-wrap gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="discountType"
              value="amount"
              checked={discountType === "amount"}
              onChange={() => setDiscountType("amount")}
            />
            Direct amount
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="discountType"
              value="percent"
              checked={discountType === "percent"}
              onChange={() => setDiscountType("percent")}
            />
            Percentage
          </label>
        </div>
      </fieldset>

      {discountType === "amount" ? (
        <Input
          name="discountAmount"
          label="Discount amount"
          placeholder="0.00"
          value={discountAmount}
          onChange={(event) => setDiscountAmount(event.target.value)}
          error={state.fieldErrors?.discountAmount}
          inputMode="decimal"
        />
      ) : (
        <Input
          name="discountPercent"
          label="Discount percent"
          type="number"
          min={0}
          max={100}
          step="0.01"
          value={discountPercent}
          onChange={(event) => setDiscountPercent(event.target.value)}
          error={state.fieldErrors?.discountPercent}
        />
      )}

      {totals && selected ? (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Subtotal</span>
            <span className="tabular-nums">
              {formatMoney(totals.subtotalCents, selected.currency)}
            </span>
          </div>
          <div className="flex justify-between gap-2">
            <span className="text-muted-foreground">Discount</span>
            <span className="tabular-nums">
              −{formatMoney(totals.discountCents, selected.currency)}
            </span>
          </div>
          <div className="mt-1 flex justify-between gap-2 border-t border-border pt-1 font-medium">
            <Label>Final total</Label>
            <span className="tabular-nums">
              {formatMoney(totals.finalTotalCents, selected.currency)}
            </span>
          </div>
        </div>
      ) : null}

      <Textarea
        name="notes"
        label="Notes"
        placeholder="Optional counter notes"
        rows={3}
      />

      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}

      <Button type="submit" loading={pending} disabled={!selected}>
        Confirm sale
      </Button>
    </form>
  );
}
