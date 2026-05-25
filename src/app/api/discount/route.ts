import { NextRequest, NextResponse } from "next/server";
import { discountSchema } from "@/lib/server/validation";
import { findDiscount } from "@/lib/server/storage";
import { rateLimit, getClientIp } from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`discount:${ip}`, { max: 20, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const parsed = discountSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Código inválido" }, { status: 400 });
  }

  const code = await findDiscount(parsed.data.code);
  if (!code) {
    return NextResponse.json({ ok: false, error: "Código no válido" }, { status: 404 });
  }
  if (parsed.data.subtotal < code.minSubtotal) {
    return NextResponse.json({
      ok: false,
      error: `Mínimo de compra: L. ${code.minSubtotal.toLocaleString("es-HN")}`,
    });
  }
  const amount =
    code.type === "percent"
      ? Math.round((parsed.data.subtotal * code.value) / 100)
      : code.value;
  return NextResponse.json({
    ok: true,
    code: code.code,
    amount,
    description: code.description,
  });
}
