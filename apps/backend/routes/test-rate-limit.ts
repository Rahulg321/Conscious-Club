import { Router, type Request, type Response } from "express";
import { testRateLimit } from "@/middleware/rate-limit-test";

const router = Router();

/**
 * Test route for rate limiting
 * GET /test-rate-limit
 *
 * This route allows you to test rate limiting without authentication.
 * It limits to 5 requests per minute per IP address.
 *
 * To test:
 * 1. Make 5+ requests quickly (within 1 minute)
 * 2. Check the RateLimit-* headers in the response
 * 3. After 5 requests, you should get a 429 error
 * 4. Wait 1 minute and try again
 */
router.get("/", testRateLimit, async (req: Request, res: Response) => {
  const timestamp = new Date().toISOString();
  const ip = req.ip || req.socket.remoteAddress || "unknown";

  // Get rate limit info from headers (set by express-rate-limit)
  const rateLimitRemaining = res.getHeader("RateLimit-Remaining");
  const rateLimitLimit = res.getHeader("RateLimit-Limit");
  const rateLimitReset = res.getHeader("RateLimit-Reset");

  console.log("✅ [TEST-RATE-LIMIT] Request successful:", {
    ip,
    timestamp,
    remaining: rateLimitRemaining,
    limit: rateLimitLimit,
  });

  res.json({
    success: true,
    message: "Rate limit test successful!",
    timestamp,
    yourIp: ip,
    rateLimit: {
      remaining: rateLimitRemaining,
      limit: rateLimitLimit,
      resetAt: rateLimitReset
        ? new Date(Number(rateLimitReset) * 1000).toISOString()
        : null,
    },
    instructions: {
      step1: "Make 5 requests quickly to this endpoint",
      step2: "Check the 'remaining' count in the response",
      step3: "On the 6th request, you should get a 429 error",
      step4: "Wait 1 minute and try again - the limit resets",
    },
  });
});

/**
 * Reset endpoint - allows clearing your rate limit (for testing purposes)
 * GET /test-rate-limit/reset
 *
 * WARNING: This should be removed or secured in production!
 */
router.get("/reset", async (req: Request, res: Response) => {
  const ip = req.ip || req.socket.remoteAddress || "unknown";
  const key = `rl:test:${ip}`;

  try {
    // This would need access to redisClient - for now, just return info
    res.json({
      message: "To reset rate limit, clear the Redis key manually",
      key: key,
      note: "In production, this endpoint should be removed or secured",
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to reset rate limit",
      details: error instanceof Error ? error.message : "Unknown error",
    });
  }
});

export default router;
