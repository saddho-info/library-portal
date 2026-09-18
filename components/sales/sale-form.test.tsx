import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { SaleForm } from "@/components/sales/sale-form";

vi.mock("@/lib/sales/actions", () => ({
  createSaleAction: vi.fn(async () => ({})),
}));

describe("SaleForm", () => {
  it("shows QR lookup when no copy is preselected", () => {
    render(<SaleForm />);
    expect(screen.getByLabelText(/QR token/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /confirm sale/i }),
    ).toBeInTheDocument();
  });

  it("shows title details when a copy is selected", () => {
    render(
      <SaleForm
        copyId="copy_1"
        title="Silent Archive"
        copyLabel="Copy #3"
        defaultPriceCents={2499}
      />,
    );
    expect(screen.getByText("Silent Archive")).toBeInTheDocument();
    expect(screen.getByText("Copy #3")).toBeInTheDocument();
    expect(screen.getByDisplayValue("24.99")).toBeInTheDocument();
  });
});
