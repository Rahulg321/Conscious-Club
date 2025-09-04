"use server";

import {
  registerFormSchema,
  RegisterFormSchemaType,
} from "../schemas/auth-schema";
import { createUser, getUserByEmail } from "../queries";
import { generateVerificationToken } from "../tokens";
import { sendVerificationTokenEmail } from "../mail";
import { db } from "@repo/db";
import { user } from "@repo/db/schema";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

export const registerAction = async (values: RegisterFormSchemaType) => {
  try {
    const validatedData = registerFormSchema.safeParse(values);

    if (!validatedData.success) {
      return {
        success: false,
        message: "Data is incoherent",
      };
    }

    const generatedUser = (
      await getUserByEmail(validatedData.data?.email)
    )?.[0];

    console.log("generatedUser", generatedUser);

    if (generatedUser) {
      if (generatedUser.emailVerified) {
        console.log("user exists");
        return { success: false, message: "user_exists" };
      } else {
        console.log("user exists but not verified");
        const newVerificationToken = await generateVerificationToken(
          validatedData.data.email
        );

        console.log("newVerificationToken", newVerificationToken);

        let emailSent = false;

        const emailResponse = await sendVerificationTokenEmail(
          validatedData.data.email,
          newVerificationToken?.token ?? ""
        );

        if (emailResponse.error) {
          return { status: "failed" };
        }

        emailSent = true;

        return { status: "sent_email" };
      }
    }

    try {
      await createUser(validatedData.data.email, validatedData.data.password);
    } catch (error) {
      console.log("An error occured trying to create user", error);
      return { success: false, message: "failed" };
    }

    const verificationToken = await generateVerificationToken(
      validatedData.data.email
    );

    console.log("verificationToken", verificationToken);

    const emailResponse = await sendVerificationTokenEmail(
      validatedData.data.email,
      verificationToken?.token ?? ""
    );

    if (emailResponse.error) {
      await db.delete(user).where(eq(user.email, validatedData.data.email));

      return { success: false, message: "failed" };
    }

    return { success: true, message: "sent_email" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { success: false, message: "invalid_data" };
    }

    console.log("An error occured trying to register", error);

    return { success: false, message: "failed" };
  }
};
