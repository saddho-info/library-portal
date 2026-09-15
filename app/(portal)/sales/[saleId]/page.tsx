import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SaleDetailView } from "@/components/sales/sale-detail";
import { ApiError } from "@/lib/api/server";
import { getSale } from "@/lib/sales/get-sales";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ saleId: string }>;
}): Promise<Metadata> {
  const { saleId } = await params;
  try {
    const sale = await getSale(saleId);
    return { title: sale.code };
  } catch {
    return { title: "Sale" };
  }
}

export default async function LibrarySaleDetailPage({
  params,
}: {
  params: Promise<{ saleId: string }>;
}) {
  const { saleId } = await params;
  const sale = await getSale(saleId).catch((error: unknown) => {
    if (error instanceof ApiError && error.status === 404) {
      notFound();
    }
    throw error;
  });

  return <SaleDetailView sale={sale} />;
}
