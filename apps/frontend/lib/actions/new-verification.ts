"use server";

import { eq } from "drizzle-orm";
import { user } from "@repo/db/schema";
import { getUserByEmail, getVerificationTokenByToken } from "../queries";
import { db } from "@repo/db";

export interface NewVerificationActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_token"
    | "expired_token"
    | "user_not_found";
}

/**
 * Verifies a user's email
 * @param token - The token to verify the user's email
 * @returns The status of the verification
 */
export const newVerification = async (
  token: string
): Promise<NewVerificationActionState> => {
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
