"use server";

import { eq } from "drizzle-orm";
import { db } from "@repo/db";
import { getPasswordResetTokenByToken, getUserByEmail } from "../queries";
import { newPasswordFormSchema } from "../schemas/auth-schema";
import { user } from "@repo/db/schema";
import { generateHashedPassword } from "../utils";
import { passwordResetToken } from "@repo/db/schema";
import { ZodError } from "zod";

export interface NewPasswordVerificationActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_data"
    | "expired_token"
    | "invalid_token"
    | "user_not_found";
}

/**
 * Verifies a user's password
 * @param _ - The state of the action
 * @param formData - The form data containing the new password
 * @param token - The token to verify the user's password
 * @returns The status of the verification
 */
export const newPasswordVerification = async (
  _: NewPasswordVerificationActionState,
  formData: FormData
): Promise<NewPasswordVerificationActionState> => {
  try {
    const validatedData = newPasswordFormSchema.parse({
      password: formData.get("password"),
      token: formData.get("token"),
    });

    const token = validatedData.token;

    const foundPasswordResetToken = await getPasswordResetTokenByToken(token);

    if (!foundPasswordResetToken) {
      return { status: "invalid_token" };
    }

    if (foundPasswordResetToken.expires < new Date()) {
      return { status: "expired_token" };
    }

    const existingUser = (
      await getUserByEmail(foundPasswordResetToken.email)
    )?.[0];

    if (!existingUser) {
      return { status: "user_not_found" };
    }

    const hashedPassword = generateHashedPassword(validatedData.password);

    await db
      .update(user)
      .set({ password: hashedPassword })
      .where(eq(user.id, existingUser.id));

    await db
      .delete(passwordResetToken)
      .where(eq(passwordResetToken.id, foundPasswordResetToken.id));

    return { status: "success" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
