import type { Metadata } from "next";
import { SectionStub } from "@/components/portal/section-stub";

export const metadata: Metadata = {
  title: "Returns",
};

export default function ReturnsPage() {
  return <SectionStub href="/returns" />;
}
