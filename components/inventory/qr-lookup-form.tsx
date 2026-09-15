"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { lookupQrAction } from "@/lib/inventory/actions";
import type { FormState } from "@/lib/inventory/types";

const initialState: FormState = {};

export function QrLookupForm() {
  const [state, formAction, pending] = useActionState(
    lookupQrAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex flex-col gap-3 sm:flex-row sm:items-end">
      <div className="min-w-0 flex-1">
        <Input
          name="token"
          label="Look up QR token"
          placeholder="Paste the scanned token"
          error={state.fieldErrors?.token ?? state.error}
          required
        />
      </div>
      <Button type="submit" loading={pending}>
        Identify copy
      </Button>
    </form>
  );
}
