import "server-only";

/**
 * Small sliding-window rate limiter kept in memory.
 * On serverless hosting each instance has its own memory, so this stops bursts from
 * one visitor rather than being a hard global limit. That's the right trade-off for a
 * survey: it blocks accidental double-submits and simple scripts without extra services.
 */
const hits = new Map<string, number[]>();
let lastSweep = Date.now();

export function rateLimit(key: string, limit: number, windowMs: number): { ok: boolean; retryAfterSec: number } {
  const now = Date.now();

  // Occasionally drop stale entries so memory stays bounded.
  if (now - lastSweep > windowMs) {
    for (const [k, times] of hits) if (times[times.length - 1] < now - windowMs) hits.delete(k);
    lastSweep = now;
  }

  const recent = (hits.get(key) ?? []).filter((t) => t > now - windowMs);
  if (recent.length >= limit) {
    hits.set(key, recent);
    return { ok: false, retryAfterSec: Math.ceil((recent[0] + windowMs - now) / 1000) };
  }
  recent.push(now);
  hits.set(key, recent);
  return { ok: true, retryAfterSec: 0 };
}

/** Best-effort client IP behind Vercel's proxy. Used only as an in-memory key, never stored. */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  return (fwd?.split(",")[0] ?? request.headers.get("x-real-ip") ?? "unknown").trim();
}
