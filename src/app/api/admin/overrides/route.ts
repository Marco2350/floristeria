import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { listOverrides, saveOverride } from "@/lib/server/storage";
import { z } from "zod";

const overrideSchema = z.object({
  id: z.string().min(1),
  outOfStock: z.boolean().optional(),
  priceOverride: z.number().nonnegative().optional(),
  hidden: z.boolean().optional(),
});

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, overrides: await listOverrides() });
}

export async function POST(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = overrideSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }
  await saveOverride(parsed.data);
  return NextResponse.json({ ok: true });
}
