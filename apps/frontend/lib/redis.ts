import { Redis } from "ioredis";

// Validate REDIS_URL environment variable
if (!process.env.REDIS_URL) {
  console.error("❌ [REDIS] REDIS_URL environment variable is not set");
  throw new Error("REDIS_URL environment variable is required for rate limiting");
}

export const redisClient = new Redis(process.env.REDIS_URL);

export async function rateLimit(
  keyBase: string,
  max: number,
  windowMs: number
) {
  const key = `rl:${keyBase}`;
  const count = await redisClient.incr(key);
  if (count === 1) await redisClient.pexpire(key, windowMs);
  const ok = count <= max;
  const ttl = await redisClient.pttl(key);
  const reset = Date.now() + ttl;
  return { ok, remaining: Math.max(0, max - count), reset };
}
