import { NextResponse } from "next/server";
import { clearAdminCookie } from "@/lib/server/auth";

export async function POST() {
  await clearAdminCookie();
  return NextResponse.json({ ok: true });
}
