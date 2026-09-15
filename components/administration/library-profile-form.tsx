"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { updateLibraryAction } from "@/lib/administration/actions";
import type { FormState, LibraryProfile } from "@/lib/administration/types";

const initialState: FormState = {};

export function LibraryProfileForm({ library }: { library: LibraryProfile }) {
  const [state, formAction, pending] = useActionState(
    updateLibraryAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <input type="hidden" name="libraryId" value={library.id} />
      <Input
        name="name"
        label="Name"
        defaultValue={library.name}
        required
        error={state.fieldErrors?.name}
      />
      <Input
        name="email"
        type="email"
        label="Email"
        defaultValue={library.email ?? ""}
      />
      <Input name="phone" label="Phone" defaultValue={library.phone ?? ""} />
      <Textarea
        name="address"
        label="Address"
        defaultValue={library.address ?? ""}
        rows={3}
      />
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" loading={pending}>
        Save profile
      </Button>
    </form>
  );
}
