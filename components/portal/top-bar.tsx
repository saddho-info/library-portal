"use client";

import { usePathname } from "next/navigation";
import { MenuIcon } from "@/components/portal/icons";
import { matchNavItem } from "@/lib/navigation";

export function TopBar({
  menuOpen,
  onMenuOpen,
}: {
  menuOpen: boolean;
  onMenuOpen: () => void;
}) {
  const pathname = usePathname();
  const item = matchNavItem(pathname);

  return (
    <header className="sticky top-0 z-30 flex h-14 items-center gap-3 border-b border-border bg-card/90 px-4 backdrop-blur-sm sm:px-6">
      <button
        type="button"
        className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
        onClick={onMenuOpen}
        aria-label="Open navigation"
        aria-controls="portal-sidebar"
        aria-expanded={menuOpen}
      >
        <MenuIcon className="size-5" />
      </button>
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">
          {item?.label ?? "Library"}
        </p>
        <p className="hidden truncate text-xs text-muted-foreground sm:block">
          Library Portal
        </p>
      </div>
    </header>
  );
}
