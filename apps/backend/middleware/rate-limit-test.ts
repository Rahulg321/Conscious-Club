import rateLimit from "express-rate-limit";
import { createRedisStore } from "@/lib/rate-limit-store";

// Rate limit configuration constants
const WINDOW_MS = 60 * 1000; // 1 minute (easier to test than 1 hour)
const MAX_REQUESTS = 5; // 5 requests per minute

/**
 * Rate limiter middleware for testing
 * Limits: 5 requests per minute per IP
 * This is more restrictive to easily test the rate limiting
 */
export const testRateLimit = rateLimit({
  windowMs: WINDOW_MS,
  max: MAX_REQUESTS,
  message: {
    error: "Rate limit exceeded. Please try again later.",
    code: "RATE_LIMIT_EXCEEDED",
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: true, // Also return `X-RateLimit-*` headers for easier testing
  // Use IP address for testing (works even without authentication)
  keyGenerator: (req) => {
    return req.ip || "unknown";
  },
  // Custom store using Redis - windowMs is passed here to match the rate limiter config
  store: createRedisStore(WINDOW_MS),
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    console.warn("⚠️ [RATE-LIMIT-TEST] Rate limit exceeded:", {
      ip: req.ip,
      timestamp: new Date().toISOString(),
    });

    res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
      message: "You have exceeded the rate limit of 5 requests per minute.",
      retryAfter: 60, // seconds
    });
  },
});
