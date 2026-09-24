import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PublishersTable } from "@/components/publishers/publishers-table";
import type { Publisher, PublisherLibraryStats } from "@/lib/publishers/types";

function publisher(overrides: Partial<Publisher> = {}): Publisher {
  return {
    id: "pub_1",
    name: "Northwind",
    slug: "northwind",
    email: null,
    phone: null,
    address: null,
    isActive: true,
    createdAt: "2026-09-01T00:00:00.000Z",
    updatedAt: "2026-09-01T00:00:00.000Z",
    ...overrides,
  };
}

describe("PublishersTable", () => {
  it("shows on-hand, stored, and sales money for each publisher", () => {
    const stats = new Map<string, PublisherLibraryStats>([
      [
        "pub_1",
        {
          publisherId: "pub_1",
          onHand: 12,
          stored: 20,
          salesTotalCents: 4599,
          saleCount: 3,
        },
      ],
    ]);

    render(
      <PublishersTable publishers={[publisher()]} statsById={stats} />,
    );

    expect(screen.getByRole("link", { name: "Northwind" })).toHaveAttribute(
      "href",
      "/inventory/publishers/pub_1",
    );
    expect(screen.getByText("12")).toBeInTheDocument();
    expect(screen.getByText("20")).toBeInTheDocument();
    expect(screen.getByText("$45.99")).toBeInTheDocument();
  });
});
