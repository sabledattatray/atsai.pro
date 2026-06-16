/**
 * rateLimit.ts — lightweight in-memory sliding-window rate limiter.
 *
 * Usage in an API route:
 *   const { limited, remaining } = rateLimit(req, { limit: 10, windowMs: 60_000 });
 *   if (limited) return NextResponse.json({ error: 'Rate limit exceeded.' }, { status: 429 });
 */

import { NextRequest } from 'next/server';

interface Window {
  count: number;
  resetAt: number;
}

// Global store shared across hot-reloads in dev via module-level singleton
const store = new Map<string, Window>();

// Cleanup old entries every 5 minutes to prevent unbounded memory growth
const CLEANUP_INTERVAL_MS = 5 * 60 * 1_000;
let lastCleanup = Date.now();

function cleanup() {
  const now = Date.now();
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;
  for (const [key, win] of store.entries()) {
    if (now > win.resetAt) store.delete(key);
  }
}

export interface RateLimitOptions {
  /** Maximum number of requests allowed in the window. Default: 20 */
  limit?: number;
  /** Window duration in milliseconds. Default: 60 000 (1 minute) */
  windowMs?: number;
  /** Optional identifier suffix to namespace per-route limits */
  identifier?: string;
}

export interface RateLimitResult {
  limited: boolean;
  remaining: number;
  resetAt: number;
}

/**
 * Check whether the calling IP has exceeded the rate limit.
 * Call this at the top of your API route handler.
 */
export function rateLimit(
  req: NextRequest,
  options: RateLimitOptions = {}
): RateLimitResult {
  const { limit = 20, windowMs = 60_000, identifier = '' } = options;

  // Derive client IP from standard headers (works on Vercel / Cloudflare / Railway)
  const ip =
    req.headers.get('x-real-ip') ||
    req.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
    'unknown';

  const key = `${ip}:${identifier}`;
  const now = Date.now();

  cleanup();

  let win = store.get(key);
  if (!win || now > win.resetAt) {
    win = { count: 0, resetAt: now + windowMs };
    store.set(key, win);
  }

  win.count++;

  const remaining = Math.max(0, limit - win.count);
  const limited = win.count > limit;

  return { limited, remaining, resetAt: win.resetAt };
}
