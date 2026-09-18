"use client";

import { useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useToast, type ToastInput } from "@/components/ui/toast";

const NOTICE_TOASTS: Record<string, ToastInput> = {
  sale_created: {
    title: "Sale recorded",
    variant: "success",
  },
  receipt_confirmed: {
    title: "Receipt confirmed",
    description: "Inventory has been updated.",
    variant: "success",
  },
  staff_created: {
    title: "Staff member added",
    variant: "success",
  },
};

/** Shows a one-shot toast from `?notice=` after a server-action redirect. */
export function FlashToast() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const notice = searchParams.get("notice");

  useEffect(() => {
    if (!notice) {
      return;
    }
    const payload = NOTICE_TOASTS[notice];
    if (payload) {
      toast(payload);
    }
    const next = new URLSearchParams(searchParams.toString());
    next.delete("notice");
    const query = next.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [notice, pathname, router, searchParams, toast]);

  return null;
}
