import { headers } from "next/headers";
import { rateLimit } from "../redis";

/**
 * Gets the client IP address from request headers
 */
export async function getClientIp(): Promise<string> {
  const headersList = await headers();
  // Check common IP header names (order matters - check most specific first)
  const forwardedFor = headersList.get("x-forwarded-for");
  if (forwardedFor) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwardedFor.split(",")[0]?.trim() || "unknown";
  }

  const realIp = headersList.get("x-real-ip");
  if (realIp) {
    return realIp.trim();
  }

  const cfConnectingIp = headersList.get("cf-connecting-ip"); // Cloudflare
  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  // Fallback to a default value if no IP is found
  return "unknown";
}

/**
 * Helper function to check rate limit and return error if exceeded
 * @param keyBase - Base key for rate limiting
 * @param max - Maximum requests allowed
 * @param windowMs - Time window in milliseconds
 * @returns Error message if rate limited, null otherwise
 */
export async function checkRateLimit(
  keyBase: string,
  max: number,
  windowMs: number
): Promise<{ error: string; resetTime: string } | null> {
  const { ok, remaining, reset } = await rateLimit(keyBase, max, windowMs);

  if (!ok) {
    return {
      error: "Rate limit exceeded. Please try again later.",
      resetTime: new Date(reset).toISOString(),
    };
  }

  return null;
}
