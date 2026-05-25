import { NextRequest, NextResponse } from "next/server";
import { orderSchema } from "@/lib/server/validation";
import { createOrder, listOrders } from "@/lib/server/storage";
import { rateLimit, getClientIp } from "@/lib/server/rate-limit";
import { isAdmin } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`orders:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos" },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const parsed = orderSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", details: parsed.error.issues },
      { status: 400 },
    );
  }
  if (parsed.data.honeypot) {
    // Pretend success — likely bot
    return NextResponse.json({ ok: true, id: "OK-BOT" });
  }

  const { honeypot: _h, ...rest } = parsed.data;
  void _h;
  const order = await createOrder(rest);
  return NextResponse.json({ ok: true, id: order.id });
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const orders = await listOrders();
  return NextResponse.json({ ok: true, orders });
}
