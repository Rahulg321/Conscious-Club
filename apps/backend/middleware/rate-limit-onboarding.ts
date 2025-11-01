import rateLimit from "express-rate-limit";
import { createRedisStore } from "@/lib/rate-limit-store";

// Rate limit configuration constants
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 5; // 5 onboarding attempts per hour

/**
 * Rate limiter middleware for onboarding
 * Limits: 5 onboarding attempts per hour per user
 * (Onboarding is typically a one-time process, but allows some retries)
 */
export const onboardingRateLimit = rateLimit({
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
    return user?.id ? `onboarding:${user.id}` : req.ip || "unknown";
  },
  // Custom store using Redis - windowMs is passed here to match the rate limiter config
  store: createRedisStore(WINDOW_MS),
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    const user = (req as any).user;
    console.warn("⚠️ [RATE-LIMIT] Onboarding rate limit exceeded:", {
      userId: user?.id,
      ip: req.ip,
    });

    res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});
