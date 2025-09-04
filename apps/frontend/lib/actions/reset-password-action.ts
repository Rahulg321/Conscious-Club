"use server";

import { sendPasswordResetEmail } from "../mail";
import { resetPasswordFormSchema } from "../schemas/auth-schema";
import { generatePasswordResetToken } from "../tokens";
import { getUserByEmail } from "../queries";
import { ZodError } from "zod";

export interface ResetPasswordActionState {
  status:
    | "idle"
    | "in_progress"
    | "success"
    | "failed"
    | "invalid_method"
    | "invalid_data"
    | "user_not_found";
}

export const resetPassword = async (
  _: ResetPasswordActionState,
  formData: FormData
): Promise<ResetPasswordActionState> => {
  try {
    const validatedData = resetPasswordFormSchema.parse({
      email: formData.get("email"),
    });

    console.log("validatedData", validatedData);

    const existingUser = (await getUserByEmail(validatedData.email))?.[0];

    if (!existingUser) {
      return { status: "user_not_found" };
    }

    if (!existingUser.password) {
      return { status: "invalid_method" };
    }

    const newPasswordResetToken = await generatePasswordResetToken(
      existingUser.email
    );

    const emailResponse = await sendPasswordResetEmail(
      existingUser.email,
      newPasswordResetToken?.token ?? ""
    );

    if (emailResponse.error) {
      return { status: "failed" };
    }

    return { status: "success" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { status: "invalid_data" };
    }

    return { status: "failed" };
  }
};
