import { NextRequest, NextResponse } from "next/server";
import { apiServerFetch, readApiError } from "@/lib/api/server";

const ALLOWED = new Set([
  "sales.csv",
  "sales.pdf",
  "inventory.csv",
  "inventory.pdf",
  "receipts.csv",
  "receipts.pdf",
  "audit-logs.csv",
  "audit-logs.pdf",
]);

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ kind: string }> },
) {
  const { kind } = await context.params;
  if (!ALLOWED.has(kind)) {
    return NextResponse.json({ message: "Unknown report" }, { status: 404 });
  }

  const upstream = await apiServerFetch(
    `/api/v1/reports/${kind}${request.nextUrl.search}`,
  );

  if (!upstream.ok) {
    return NextResponse.json(
      { message: await readApiError(upstream) },
      { status: upstream.status },
    );
  }

  const headers = new Headers();
  const contentType = upstream.headers.get("content-type");
  const disposition = upstream.headers.get("content-disposition");
  if (contentType) headers.set("Content-Type", contentType);
  if (disposition) headers.set("Content-Disposition", disposition);

  return new NextResponse(upstream.body, {
    status: 200,
    headers,
  });
}
