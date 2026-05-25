import "server-only";

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export type RateLimitResult = {
  ok: boolean;
  retryAfterSec?: number;
};

/**
 * Simple in-memory token-bucket rate limiter.
 * Identifier is typically `${ip}:${route}`.
 */
export function rateLimit(
  identifier: string,
  options: { max: number; windowMs: number },
): RateLimitResult {
  const now = Date.now();
  const bucket = store.get(identifier);
  if (!bucket || bucket.resetAt < now) {
    store.set(identifier, { count: 1, resetAt: now + options.windowMs });
    return { ok: true };
  }
  if (bucket.count >= options.max) {
    return { ok: false, retryAfterSec: Math.ceil((bucket.resetAt - now) / 1000) };
  }
  bucket.count++;
  return { ok: true };
}

export function getClientIp(headers: Headers): string {
  return (
    headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    headers.get("x-real-ip") ||
    "unknown"
  );
}
