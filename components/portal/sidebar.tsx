"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { SignOutButton } from "@/components/auth/sign-out-button";
import { CloseIcon, NavIcon } from "@/components/portal/icons";
import { formatRole, userInitials } from "@/lib/auth/display";
import type { PublicUser } from "@/lib/auth/types";
import { cn } from "@/lib/cn";
import { NAV_GROUPS, isNavActive } from "@/lib/navigation";

export function Sidebar({
  user,
  open,
  onClose,
}: {
  user: PublicUser;
  open: boolean;
  onClose: () => void;
}) {
  const pathname = usePathname();

  return (
    <>
      <div
        className={cn(
          "fixed inset-0 z-40 bg-foreground/20 transition-opacity lg:hidden",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
        onClick={onClose}
        aria-hidden="true"
      />
      <aside
        id="portal-sidebar"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-60 flex-col border-r border-border bg-card transition-transform lg:static lg:translate-x-0",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex h-14 items-center justify-between gap-2 border-b border-border px-4">
          <Link
            href="/receiving"
            className="flex min-w-0 items-center gap-2"
            onClick={onClose}
          >
            <span className="flex size-7 items-center justify-center rounded-md bg-primary text-xs font-semibold text-primary-foreground">
              PT
            </span>
            <span className="truncate text-sm font-semibold tracking-tight">
              Library Portal
            </span>
          </Link>
          <button
            type="button"
            className="rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground focus-visible:ring-2 focus-visible:ring-ring lg:hidden"
            onClick={onClose}
            aria-label="Close navigation"
          >
            <CloseIcon className="size-4" />
          </button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-3" aria-label="Library sections">
          {NAV_GROUPS.map((group) => (
            <div key={group.id} className="mb-4 last:mb-0">
              <p className="px-2 pb-1.5 text-[11px] font-semibold tracking-[0.12em] text-muted-foreground uppercase">
                {group.label}
              </p>
              <ul className="flex flex-col gap-0.5">
                {group.items.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  return (
                    <li key={item.href}>
                      <Link
                        href={item.href}
                        onClick={onClose}
                        aria-current={active ? "page" : undefined}
                        className={cn(
                          "flex items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-primary/10 font-medium text-primary"
                            : "text-foreground/80 hover:bg-muted hover:text-foreground",
                        )}
                      >
                        <NavIcon name={item.icon} className="size-4 shrink-0" />
                        {item.label}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-border p-3">
          <div className="mb-2 flex items-center gap-2.5 px-1">
            <span
              className="flex size-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary"
              aria-hidden="true"
            >
              {userInitials(user)}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium">
                {user.firstName} {user.lastName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {formatRole(user.role)}
              </p>
            </div>
          </div>
          <SignOutButton variant="ghost" size="sm" className="w-full justify-start" />
        </div>
      </aside>
    </>
  );
}
