"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { createStaffAction } from "@/lib/administration/actions";
import type { FormState } from "@/lib/administration/types";

const initialState: FormState = {};

export function StaffForm() {
  const [state, formAction, pending] = useActionState(
    createStaffAction,
    initialState,
  );

  return (
    <form action={formAction} className="flex max-w-xl flex-col gap-4">
      <Input name="firstName" label="First name" required />
      <Input name="lastName" label="Last name" required />
      <Input name="email" type="email" label="Email" required />
      <Input
        name="password"
        type="password"
        label="Temporary password"
        hint="At least 8 characters. The staff member can change it later."
        required
        minLength={8}
        error={state.fieldErrors?.password}
      />
      <Select
        name="role"
        label="Role"
        defaultValue="LIBRARY_STAFF"
        options={[
          { value: "LIBRARY_STAFF", label: "Library staff" },
          { value: "LIBRARY_ADMIN", label: "Library admin" },
        ]}
      />
      {state.error ? (
        <p className="text-sm text-destructive" role="alert">
          {state.error}
        </p>
      ) : null}
      <Button type="submit" loading={pending}>
        Create staff account
      </Button>
    </form>
  );
}
