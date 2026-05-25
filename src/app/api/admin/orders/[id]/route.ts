import { NextRequest, NextResponse } from "next/server";
import { isAdmin } from "@/lib/server/auth";
import { updateOrderStatus, getOrder } from "@/lib/server/storage";
import { z } from "zod";

const statusSchema = z.object({
  status: z.enum([
    "pendiente",
    "confirmado",
    "preparando",
    "en-camino",
    "entregado",
    "cancelado",
  ]),
});

export async function GET(_req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const order = await getOrder(id);
  if (!order) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, order });
}

export async function PATCH(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  if (!(await isAdmin())) return NextResponse.json({ ok: false }, { status: 401 });
  const { id } = await ctx.params;
  const body = await req.json().catch(() => null);
  const parsed = statusSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Estado inválido" }, { status: 400 });
  }
  const updated = await updateOrderStatus(id, parsed.data.status);
  if (!updated) return NextResponse.json({ ok: false }, { status: 404 });
  return NextResponse.json({ ok: true, order: updated });
}
