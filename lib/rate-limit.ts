import { createHash } from "node:crypto";

const contactLimiter = new Map<string, number[]>();

const WINDOW_MS = 15 * 60 * 1000;
const MAX_REQUESTS = 5;

export function hashIp(value: string) {
  return createHash("sha256").update(value).digest("hex");
}

export function isRateLimited(key: string) {
  const now = Date.now();
  const list = contactLimiter.get(key) ?? [];
  const fresh = list.filter((time) => now - time <= WINDOW_MS);

  if (fresh.length >= MAX_REQUESTS) {
    contactLimiter.set(key, fresh);
    return true;
  }

  fresh.push(now);
  contactLimiter.set(key, fresh);
  return false;
}
