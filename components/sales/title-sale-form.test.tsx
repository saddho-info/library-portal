import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { TitleSaleForm } from "@/components/sales/title-sale-form";

vi.mock("@/lib/sales/actions", () => ({
  createTitleSaleAction: vi.fn(async () => ({})),
}));

const editions = [
  {
    editionId: "ed_1",
    title: "Delta Light",
    isbn: "9780306406157",
    format: "PAPERBACK",
    listPriceCents: 1000,
    currency: "USD",
    onHand: 5,
  },
];

describe("TitleSaleForm", () => {
  it("updates the live total when quantity and amount discount change", () => {
    render(<TitleSaleForm editions={editions} />);

    fireEvent.change(screen.getByLabelText(/Quantity/i), {
      target: { value: "3" },
    });
    fireEvent.change(screen.getByLabelText(/Discount amount/i), {
      target: { value: "1.50" },
    });

    expect(screen.getByText("$30.00")).toBeInTheDocument();
    expect(screen.getByText("−$1.50")).toBeInTheDocument();
    expect(screen.getByText("$28.50")).toBeInTheDocument();
  });

  it("switches to percentage discount", () => {
    render(<TitleSaleForm editions={editions} />);

    fireEvent.click(screen.getByLabelText(/Percentage/i));
    fireEvent.change(screen.getByLabelText(/Discount percent/i), {
      target: { value: "10" },
    });

    expect(screen.getByText("$10.00")).toBeInTheDocument();
    expect(screen.getByText("−$1.00")).toBeInTheDocument();
    expect(screen.getByText("$9.00")).toBeInTheDocument();
  });
});
