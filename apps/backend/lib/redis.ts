import { Redis } from "ioredis";

// Create Redis client with error handling
// ioredis handles connection failures gracefully, but we ensure REDIS_URL exists
const redisUrl = process.env.REDIS_URL;

if (!redisUrl) {
  console.warn(
    "WARNING: REDIS_URL environment variable is not set. Redis operations will fail."
  );
}

export const redisClient = new Redis(redisUrl || "redis://localhost:6379", {
  // Retry strategy: retry with exponential backoff
  retryStrategy: (times) => {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
  // Don't crash on connection errors
  enableOfflineQueue: false,
  // Log connection errors
  lazyConnect: false,
});

redisClient.on("error", (err) => {
  console.error("Redis Client Error:", err.message);
});

redisClient.on("connect", () => {
  console.log("Redis Client Connected");
});

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
