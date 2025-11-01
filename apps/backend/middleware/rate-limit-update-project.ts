import rateLimit from "express-rate-limit";
import { createRedisStore } from "@/lib/rate-limit-store";

// Rate limit configuration constants
const WINDOW_MS = 60 * 60 * 1000; // 1 hour
const MAX_REQUESTS = 15; // 15 updates per hour

/**
 * Rate limiter middleware for project updates
 * Limits: 15 updates per hour per user
 * (Slightly more lenient than upload since updates are more frequent)
 */
export const updateProjectRateLimit = rateLimit({
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
    return user?.id ? `update-project:${user.id}` : req.ip || "unknown";
  },
  // Custom store using Redis - windowMs is passed here to match the rate limiter config
  store: createRedisStore(WINDOW_MS),
  // Custom handler for rate limit exceeded
  handler: (req, res) => {
    const user = (req as any).user;
    console.warn("⚠️ [RATE-LIMIT] Update project rate limit exceeded:", {
      userId: user?.id,
      ip: req.ip,
      projectId: req.params?.projectId,
    });

    res.status(429).json({
      error: "Rate limit exceeded. Please try again later.",
      code: "RATE_LIMIT_EXCEEDED",
    });
  },
});

