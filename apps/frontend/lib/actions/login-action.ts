"use server";

import { auth } from "@/auth";
import { loginFormSchema, LoginFormSchemaType } from "../schemas/auth-schema";
import { getUserByEmail, hasCompletedOnboarding } from "../queries";
import { signIn } from "@/auth";
import { DEFAULT_LOGIN_REDIRECT, FIRST_LOGIN_REDIRECT } from "@/routes";
import { rateLimit } from "../redis";
import { getClientIp } from "../utils/rate-limit";

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

  // Rate limiting: 5 login attempts per 15 minutes per IP, with email fallback
  const ip = await getClientIp();
  const { ok, remaining, reset } = await rateLimit(
    `login:${ip}:${email}`, // Use IP + email for better tracking
    5, // 5 login attempts per 15 minutes
    15 * 60 * 1000 // 15 minutes
  );

  if (!ok) {
    return {
      success: false,
      message: "Too many login attempts. Please try again later.",
      resetTime: new Date(reset).toISOString(),
    };
  }

  const existingUser = (await getUserByEmail(email))?.[0];

  console.log("existingUser", existingUser);

  if(!existingUser){
    return { success: false, message: "No such user exists" };
  }
  if (!existingUser.email || !existingUser.password) {
    return { success: false, message: "No such user exists" };
  }

  if (!existingUser.password) {
    return { success: false, message: "Incorrect Credentials" };
  }

  if (!existingUser.emailVerified) {
    return { success: false, message: "Email has not been verified" };
  }

  try {
    // Check if user has completed onboarding
    const onboardingCompleted = await hasCompletedOnboarding(existingUser.id);
    const redirectTo = onboardingCompleted
      ? DEFAULT_LOGIN_REDIRECT
      : FIRST_LOGIN_REDIRECT;

    await signIn("credentials", {
      email,
      password,
      redirectTo: `${redirectTo}?login=success`,
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
