"use server";

import { eq } from "drizzle-orm";
import { user } from "@repo/db/schema";
import { getUserByEmail, getVerificationTokenByToken } from "../queries";
import { db } from "@repo/db";
import { rateLimit } from "../redis";
import { getClientIp } from "../utils/rate-limit";

export interface NewVerificationActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_token"
    | "expired_token"
    | "user_not_found"
    | "rate_limit_exceeded";
}

/**
 * Verifies a user's email
 * @param token - The token to verify the user's email
 * @returns The status of the verification
 */
export const newVerification = async (
  token: string
): Promise<NewVerificationActionState> => {
  // Rate limiting: 10 verification attempts per hour per IP
  const ip = await getClientIp();
  const { ok, remaining, reset } = await rateLimit(
    `verification:${ip}`, // Use IP for tracking
    10, // 10 verification attempts per hour
    60 * 60 * 1000 // 1 hour
  );

  if (!ok) {
    return { status: "rate_limit_exceeded" };
  }

  const foundVerificationToken = await getVerificationTokenByToken(token);
  if (!foundVerificationToken) {
    console.log("Token not found");
    return { status: "invalid_token" };
  }

  if (foundVerificationToken.expires < new Date()) {
    console.log("Token expired");
    return { status: "expired_token" };
  }

  const existingUser = (
    await getUserByEmail(foundVerificationToken.email)
  )?.[0];

  if (!existingUser) {
    console.log("User not found");
    return { status: "user_not_found" };
  }

  try {
    await db
      .update(user)
      .set({ emailVerified: new Date() })
      .where(eq(user.id, existingUser.id));

    console.log("User verified");

    return { status: "success" };
  } catch (error) {
    console.log("An error occured trying to verify user", error);
    return { status: "failed" };
  }
};
