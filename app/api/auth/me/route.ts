import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { meRequest } from "@/lib/auth/api";
import { ACCESS_COOKIE } from "@/lib/auth/config";

export async function GET() {
  const jar = await cookies();
  const accessToken = jar.get(ACCESS_COOKIE)?.value;
  if (!accessToken) {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }

  try {
    const user = await meRequest(accessToken);
    return NextResponse.json(user);
  } catch {
    return NextResponse.json({ message: "Not authenticated" }, { status: 401 });
  }
}
