import { NextRequest, NextResponse } from "next/server";
import { subscriptionSchema } from "@/lib/server/validation";
import { createSubscription, listSubscriptions } from "@/lib/server/storage";
import { rateLimit, getClientIp } from "@/lib/server/rate-limit";
import { isAdmin } from "@/lib/server/auth";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`subs:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json({ ok: false, error: "Demasiados intentos" }, { status: 429 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const parsed = subscriptionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos", details: parsed.error.issues },
      { status: 400 },
    );
  }
  if (parsed.data.honeypot) return NextResponse.json({ ok: true });

  const { honeypot: _h, ...rest } = parsed.data;
  void _h;
  const sub = await createSubscription(rest);
  return NextResponse.json({ ok: true, id: sub.id });
}

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json({ ok: false }, { status: 401 });
  }
  const list = await listSubscriptions();
  return NextResponse.json({ ok: true, subscriptions: list });
}
