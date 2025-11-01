import type { Store, ClientRateLimitInfo } from "express-rate-limit";
import { redisClient } from "./redis";

/**
 * Custom Redis store for express-rate-limit using ioredis
 * Compatible with express-rate-limit v8.x
 *
 * This store uses Redis to track rate limit counts across
 * multiple server instances in a distributed system.
 *
 * @param windowMs - The time window in milliseconds for the rate limit
 * @returns A Store instance configured for the specified window
 */
export function createRedisStore(windowMs: number): Store {
  class IORedisStore implements Store {
    private windowMs: number;

    constructor(windowMs: number) {
      this.windowMs = windowMs;
    }

    async increment(key: string): Promise<ClientRateLimitInfo> {
      const count = await redisClient.incr(key);

      // Set expiration on first increment
      if (count === 1) {
        await redisClient.pexpire(key, this.windowMs);
      }

      const ttl = await redisClient.pttl(key);
      const resetTime =
        ttl > 0
          ? new Date(Date.now() + ttl)
          : new Date(Date.now() + this.windowMs);

      return {
        totalHits: count,
        resetTime,
      };
    }

    async decrement(key: string): Promise<void> {
      await redisClient.decr(key);
    }

    async resetKey(key: string): Promise<void> {
      await redisClient.del(key);
    }

    async shutdown(): Promise<void> {
      // Don't close the shared Redis client - it might be used elsewhere
    }
  }

  return new IORedisStore(windowMs);
}
