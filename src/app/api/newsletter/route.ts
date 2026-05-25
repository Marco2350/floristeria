import { NextRequest, NextResponse } from "next/server";
import { newsletterSchema } from "@/lib/server/validation";
import { addSubscriber } from "@/lib/server/storage";
import { rateLimit, getClientIp } from "@/lib/server/rate-limit";

export async function POST(req: NextRequest) {
  const ip = getClientIp(req.headers);
  const rl = rateLimit(`newsletter:${ip}`, { max: 5, windowMs: 60_000 });
  if (!rl.ok) {
    return NextResponse.json(
      { ok: false, error: "Demasiados intentos. Intenta más tarde." },
      { status: 429, headers: { "Retry-After": String(rl.retryAfterSec ?? 60) } },
    );
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "JSON inválido" }, { status: 400 });
  }

  const parsed = newsletterSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { ok: false, error: "Datos inválidos" },
      { status: 400 },
    );
  }
  // Honeypot — silent success to confuse bots
  if (parsed.data.honeypot) {
    return NextResponse.json({ ok: true });
  }

  const added = await addSubscriber(parsed.data.email, parsed.data.source);
  return NextResponse.json({
    ok: true,
    duplicate: !added,
    message: added
      ? "¡Listo! Te avisaremos de las novedades."
      : "Ya estabas en la lista. Gracias.",
  });
}
