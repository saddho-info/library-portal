import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { ReceivingStepper } from "@/components/receiving/receiving-stepper";
import type { Shipment } from "@/lib/receiving/types";

vi.mock("@/lib/receiving/actions", () => ({
  confirmReceiptAction: vi.fn(async () => ({})),
}));

const shipment: Shipment = {
  id: "dist_1",
  publisherId: "pub_1",
  libraryId: "lib_1",
  status: "DISPATCHED",
  code: "D-100",
  notes: "Handle with care",
  actorUserId: "user_1",
  dispatchedAt: "2026-09-01T00:00:00.000Z",
  cancelledAt: null,
  createdAt: "2026-09-01T00:00:00.000Z",
  updatedAt: "2026-09-01T00:00:00.000Z",
  totalQuantity: 1,
  itemCount: 1,
  publisher: { id: "pub_1", name: "Northwind", slug: "northwind" },
  library: { id: "lib_1", name: "Riverside", slug: "riverside" },
  actor: {
    id: "user_1",
    firstName: "Pub",
    lastName: "Admin",
    email: "pa@test.com",
  },
  items: [
    {
      id: "di_1",
      editionId: "ed_1",
      quantity: 1,
      createdAt: "2026-09-01T00:00:00.000Z",
      edition: {
        id: "ed_1",
        isbn: "9781402894626",
        format: "HARDCOVER",
        title: null,
        book: {
          id: "book_1",
          title: "Silent Archive",
          authors: "Lina",
          slug: "silent-archive",
        },
      },
      copies: [{ id: "copy_1", copyNumber: 1, status: "DISTRIBUTED" }],
    },
  ],
};

describe("ReceivingStepper", () => {
  it("walks Review → Verify → Confirm", async () => {
    const user = userEvent.setup();
    render(<ReceivingStepper shipment={shipment} />);

    expect(screen.getByText(/Shipment D-100/)).toBeInTheDocument();
    expect(screen.getByText(/Handle with care/)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /continue to verify/i }),
    );
    expect(screen.getByText(/Verify copies/)).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: /continue to confirm/i }),
    );
    expect(
      screen.getByRole("heading", { name: /confirm receipt/i }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /^confirm receipt$/i }),
    ).toBeInTheDocument();
  });
});
