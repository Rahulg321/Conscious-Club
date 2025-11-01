import rateLimit from "express-rate-limit";
import { createRedisStore } from "@/lib/rate-limit-store";

// Rate limit configuration constants
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10; // 10 entries per hour

/**
 * Rate limiter middleware for challenge entry submissions
 * Limits: 10 entries per hour per user
 *
 * Note: While only one entry per challenge is allowed per user,
 * this rate limit protects against:
 * - Repeated attempts with different challenge IDs
 * - Large file uploads that consume resources
 * - API abuse and brute force attempts
 */
export const submitChallengeEntryRateLimit = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    error: "Rate limit exceeded. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true,
  legacyHeaders: false,
  // Custom key generator to use user ID from authenticated request
  keyGenerator: (req) => {
    const user = (req as any).user;
    return user?.id ? `submit-challenge-entry:${user.id}` : req.ip || "unknown";
  },
  // Custom store using Redis - windowMs is passed here to match the rate limiter config
  store: createRedisStore(WINDOW_MS),
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    const user = (req as any).user;
    console.warn(
      "⚠️ [RATE-LIMIT] Submit challenge entry rate limit exceeded:",
      {
        userId: user?.id,
        ip: req.ip,
        challengeId: req.body?.challengeId,
      }
    );

    res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});
