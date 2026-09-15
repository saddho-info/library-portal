"use client";

import { Button } from "@/components/ui/button";
import { ErrorState } from "@/components/ui/error-state";

export default function PortalError({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <ErrorState
      title="This section failed to load"
      message={error.message || "An unexpected error occurred. Try again."}
      action={
        <Button variant="outline" onClick={() => retry()}>
          Try again
        </Button>
      }
    />
  );
}
