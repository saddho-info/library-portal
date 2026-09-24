export type NavIconName =
  | "receiving"
  | "publishers"
  | "inventory"
  | "sales"
  | "returns"
  | "reports"
  | "administration";

export type NavItem = {
  href: string;
  label: string;
  description: string;
  phase: string;
  icon: NavIconName;
};

export type NavGroup = {
  id: string;
  label: string;
  items: NavItem[];
};

export const NAV_GROUPS: NavGroup[] = [
  {
    id: "operations",
    label: "Operations",
    items: [
      {
        href: "/receiving",
        label: "Receiving",
        description:
          "Review inbound shipments, verify copies, and confirm stock onto shelves.",
        phase: "Phase 12",
        icon: "receiving",
      },
      {
        href: "/publishers",
        label: "Publishers",
        description:
          "Stock and sales for publishers cleared to distribute to this library.",
        phase: "Phase 7",
        icon: "publishers",
      },
      {
        href: "/inventory",
        label: "Inventory",
        description: "On-hand copies, QR lookup, and movement history.",
        phase: "Phase 7",
        icon: "inventory",
      },
      {
        href: "/sales",
        label: "Sales",
        description: "Record counter sales by QR token or from an on-hand copy.",
        phase: "Phase 10",
        icon: "sales",
      },
      {
        href: "/returns",
        label: "Returns",
        description: "Return sold or damaged copies to on-hand stock.",
        phase: "V2",
        icon: "returns",
      },
    ],
  },
  {
    id: "insights",
    label: "Insights",
    items: [
      {
        href: "/reports",
        label: "Reports",
        description:
          "On-hand stock, sales totals, receiving activity, and CSV/PDF exports.",
        phase: "Phase 20",
        icon: "reports",
      },
    ],
  },
  {
    id: "admin",
    label: "Admin",
    items: [
      {
        href: "/administration",
        label: "Administration",
        description: "Library profile and staff accounts.",
        phase: "Phase 12",
        icon: "administration",
      },
    ],
  },
];

export const NAV_ITEMS: NavItem[] = NAV_GROUPS.flatMap((group) => group.items);

export function getNavItem(href: string): NavItem | undefined {
  return NAV_ITEMS.find((item) => item.href === href);
}

export function matchNavItem(pathname: string): NavItem | undefined {
  return NAV_ITEMS.find(
    (item) => pathname === item.href || pathname.startsWith(`${item.href}/`),
  );
}

export function isNavActive(pathname: string, href: string): boolean {
  return pathname === href || pathname.startsWith(`${href}/`);
}
