"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { createSaleAction } from "@/lib/sales/actions";
import { dollarsFromCents } from "@/lib/sales/format";
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
