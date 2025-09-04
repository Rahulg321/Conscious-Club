"use server";

import { auth } from "@/auth";
import { loginFormSchema, LoginFormSchemaType } from "../schemas/auth-schema";
import { getUserByEmail } from "../queries";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";

/**
 *
 *
 * @param values
 * @returns
 */
export const loginAction = async (values: LoginFormSchemaType) => {
  const validatedData = loginFormSchema.safeParse(values);

  if (!validatedData.success) {
    return { success: false, message: "invalid_data" };
  }

  const { email, password } = validatedData.data;

  const existingUser = (await getUserByEmail(email))?.[0];

  console.log("existingUser", existingUser);

  if (!existingUser || !existingUser.email || !existingUser.password) {
    return { success: false, message: "No such user exists" };
  }

  if (!existingUser.password) {
    return { success: false, message: "Invalid method" };
  }

  if (!existingUser.emailVerified) {
    return { success: false, message: "Email has not been verified" };
  }

  try {
    await signIn("credentials", {
      email,
      password,
      redirectTo: `${DEFAULT_LOGIN_REDIRECT}?login=success`,
    });
  } catch (error) {
    // NEXT_REDIRECT is expected behavior when signIn succeeds
    if (error instanceof Error && error.message === "NEXT_REDIRECT") {
      return {
        success: true,
        message: "success",
      };
    }

    console.log("An error occured trying to sign in", error);
    console.error(error);
    return {
      success: false,
      message: "error signing in",
    };
  }

  // This part is unreachable because signIn with redirect throws an error.
  // It's here to satisfy the type-checker for the cases where redirect does not happen.
  return {
    success: true,
    message: "success",
  };
};
