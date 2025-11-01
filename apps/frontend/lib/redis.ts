import { Redis } from "ioredis";

export const redisClient = new Redis(process.env.REDIS_URL as string);

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
