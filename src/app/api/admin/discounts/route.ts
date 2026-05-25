import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { listDiscounts, saveDiscounts } from "@/lib/server/storage";
import { z } from "zod";

const discountSchema = z.object({
  code: z.string().trim().min(2).max(40),
  type: z.enum(["percent", "flat"]),
  value: z.number().positive(),
  minSubtotal: z.number().nonnegative(),
  active: z.boolean(),
  description: z.string().min(1).max(120),
});

const listSchema = z.array(discountSchema);

export async function GET() {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  return NextResponse.json({ ok: true, discounts: await listDiscounts() });
}

export async function PUT(req: NextRequest) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const body = await req.json().catch(() => null);
  const parsed = listSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }
  await saveDiscounts(parsed.data);
  return NextResponse.json({ ok: true });
}
