"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, type ButtonSize, type ButtonVariant } from "@/components/ui/button";

export function SignOutButton({
  variant = "outline",
  size,
  className,
}: {
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function onClick() {
    setLoading(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.replace("/login");
    router.refresh();
  }

  return (
    <Button
      variant={variant}
      size={size}
      className={className}
      onClick={onClick}
      loading={loading}
    >
      Sign out
    </Button>
  );
}
