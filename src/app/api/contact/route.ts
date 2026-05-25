import { NextRequest, NextResponse } from "next/server";
import { contactSchema } from "@/lib/server/validation";
import { addContactMessage } from "@/lib/server/storage";
import { rateLimit, getClientIp } from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`contact:${ip}`, { max: 3, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Demasiados envíos. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }
  const parsed = contactSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "Datos inválidos" }, { status: 400 });
  }
  if (parsed.data.honeypot) return NextResponse.json({ ok: true });

  await addContactMessage({
    name: parsed.data.name,
    email: parsed.data.email,
    message: parsed.data.message,
  });
  return NextResponse.json({ ok: true });
}
