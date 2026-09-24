"use client";

import { useActionState, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSaleAction } from "@/lib/sales/actions";
import { dollarsFromCents, type SaleDiscountType } from "@/lib/sales/format";
import type { FormState } from "@/lib/sales/types";

const initialState: FormState = {};

export function SaleForm({
  copyId,
  defaultPriceCents,
  defaultCurrency = "USD",
  title,
  copyLabel,
}: {
  copyId?: string;
  defaultPriceCents?: number;
  defaultCurrency?: string;
  title?: string;
  copyLabel?: string;
}) {
  const [state, formAction, pending] = useActionState(
    createSaleAction,
    initialState,
  );
  const [discountType, setDiscountType] = useState<SaleDiscountType>("amount");
  const isAmount = discountType === "amount";

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {copyId ? (
        <input type="hidden" name="copyId" value={copyId} />
      ) : (
        <Input
          name="qrToken"
          label="QR token"
          placeholder="Paste the scanned token"
          error={state.fieldErrors?.qrToken}
          required
        />
      )}

      {copyId && title ? (
        <div className="rounded-md border border-border bg-muted/40 px-3 py-2 text-sm">
          <p className="font-medium">{title}</p>
          {copyLabel ? (
            <p className="text-xs text-muted-foreground">{copyLabel}</p>
          ) : null}
        </div>
      ) : null}

      {defaultPriceCents !== undefined ? (
        <input type="hidden" name="listPriceCents" value={defaultPriceCents} />
      ) : null}

      <Input
        name="unitPrice"
        label={`Unit price (${defaultCurrency})`}
        placeholder="24.99"
        defaultValue={
          defaultPriceCents !== undefined
            ? dollarsFromCents(defaultPriceCents)
            : ""
        }
        error={state.fieldErrors?.unitPrice}
        inputMode="decimal"
      />

      <fieldset className="flex flex-col gap-2">
        <legend className="text-sm font-medium text-foreground">
          Discount type
        </legend>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="radio"
            name="discountType"
            value="amount"
            checked={discountType === "amount"}
            onChange={() => setDiscountType("amount")}
            className="mt-1"
          />
          <span>
            <span className="font-medium">Amount</span>
            <span className="block text-xs text-muted-foreground">
              Plain discount in {defaultCurrency}
            </span>
          </span>
        </label>
        <label className="flex items-start gap-2 text-sm">
          <input
            type="radio"
            name="discountType"
            value="percent"
            checked={discountType === "percent"}
            onChange={() => setDiscountType("percent")}
            className="mt-1"
          />
          <span>
            <span className="font-medium">Percentage</span>
            <span className="block text-xs text-muted-foreground">
              Discount as a percent of the price
            </span>
          </span>
        </label>
      </fieldset>

      <Input
        name="discount"
        label={isAmount ? "Discount amount" : "Discount percentage"}
        placeholder={isAmount ? "0.00" : "0"}
        hint={
          isAmount
            ? "Amount taken off the unit price. Leave blank for no discount."
            : "Percent taken off the unit price. Leave blank for no discount."
        }
        error={state.fieldErrors?.discount}
        inputMode="decimal"
      />

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

      <Button type="submit" loading={pending}>
        Confirm sale
      </Button>
    </form>
  );
}
