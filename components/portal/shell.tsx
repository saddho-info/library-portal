"use client";

import { Suspense, useEffect, useRef, useState, type ReactNode } from "react";
import { Sidebar } from "@/components/portal/sidebar";
import { TopBar } from "@/components/portal/top-bar";
import { FlashToast } from "@/components/ui/flash-toast";
import type { PublicUser } from "@/lib/auth/types";

export function PortalShell({
  user,
  children,
}: {
  user: PublicUser;
  children: ReactNode;
}) {
  const [navOpen, setNavOpen] = useState(false);
  const closeButtonRef = useRef<HTMLButtonElement | null>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!navOpen) {
      previouslyFocused.current?.focus();
      previouslyFocused.current = null;
      return;
    }

    previouslyFocused.current = document.activeElement as HTMLElement | null;

    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setNavOpen(false);
      }
    }

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden";
    queueMicrotask(() => closeButtonRef.current?.focus());

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
    };
  }, [navOpen]);

  return (
    <div className="flex min-h-full flex-1 bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-3 focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:shadow-card"
      >
        Skip to content
      </a>
      <Suspense fallback={null}>
        <FlashToast />
      </Suspense>
      <Sidebar
        user={user}
        open={navOpen}
        onClose={() => setNavOpen(false)}
        closeButtonRef={closeButtonRef}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <TopBar menuOpen={navOpen} onMenuOpen={() => setNavOpen(true)} />
        <main id="main-content" className="flex-1 px-4 py-6 sm:px-6">
          {children}
        </main>
      </div>
    </div>
  );
}
