import { Redis } from "ioredis";

// Optional REDIS_URL - gracefully fallback if not available
let redisClient: Redis | null = null;

if (process.env.REDIS_URL) {
  redisClient = new Redis(process.env.REDIS_URL);
} else {
  console.warn("⚠️ [REDIS] REDIS_URL environment variable is not set - rate limiting will be disabled");
}

export { redisClient };

export async function rateLimit(
  keyBase: string,
  max: number,
  windowMs: number
) {
  // If Redis is not available, allow all requests (no rate limiting)
  if (!redisClient) {
    console.warn("⚠️ [REDIS] Rate limiting skipped - Redis client not available");
    return { ok: true, remaining: max, reset: Date.now() + windowMs };
  }

  const key = `rl:${keyBase}`;
  const count = await redisClient.incr(key);
  if (count === 1) await redisClient.pexpire(key, windowMs);
  const ok = count <= max;
  const ttl = await redisClient.pttl(key);
  const reset = Date.now() + ttl;
  return { ok, remaining: Math.max(0, max - count), reset };
}
