import rateLimit from "express-rate-limit";
import { createRedisStore } from "@/lib/rate-limit-store";

// Rate limit configuration constants
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 10; // 10 uploads per hour

/**
 * Rate limiter middleware for project uploads
 * Limits: 10 uploads per hour per user
 */
export const uploadProjectRateLimit = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    error: "Rate limit exceeded. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  // Custom key generator to use user ID from authenticated request
  keyGenerator: (req) => {
    const user = (req as any).user;
    return user?.id ? `upload-project:${user.id}` : req.ip || "unknown";
  },
  // Custom store using Redis - windowMs is passed here to match the rate limiter config
  store: createRedisStore(WINDOW_MS),
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    const user = (req as any).user;
    console.warn("⚠️ [RATE-LIMIT] Upload project rate limit exceeded:", {
      userId: user?.id,
      ip: req.ip,
    });

    res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});
