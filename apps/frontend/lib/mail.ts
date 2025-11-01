"use server";

import ContactMessageEmail from "@/components/emails/contact-email";
import { ResetPasswordEmail } from "@/components/emails/reset-password";
import TokenVerificationEmail from "@/components/emails/token-verification-email";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

/**
 * Sends a verification token email to the user.
 * @param email - The email to send the verification token to.
 * @param token - The verification token to send to the user.
 */
export const sendVerificationTokenEmail = async (
  email: string,
  token: string
) => {
  const confirmLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-verification?token=${token}`;

  console.log("confirmLink", confirmLink);

  const { data, error } = await resend.emails.send({
    from: `Conscious Club <Contact@consciousclubb.com>`,
    to: [email],
    subject: "Verify your account",
    react: TokenVerificationEmail({
      tokenConfirmLink: confirmLink,
    }),
  });

  console.log("sending verification token email", data, error);

  if (error) {
    console.log("error sending email", error.name, error.message);
    return {
      error: `could not send email -> ${error.message}}`,
    };
  }

  return {
    success: true,
  };
};

/**
 * Sends a password reset email to the user.
 * @param email - The email to send the password reset email to.
 * @param token - The password reset token to send to the user.
 */
export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/new-password?token=${token}`;

  const { data, error } = await resend.emails.send({
    from: `Conscious Club <Contact@consciousclubb.com>`,
    to: [email],
    subject: "Reset your Password",
    react: ResetPasswordEmail({
      resetPasswordLink: resetLink,
    }),
  });

  if (error) {
    console.log("error sending email", error.name, error.message);
    return {
      error: `could not send email -> ${error.message}}`,
    };
  }

  return {
    success: true,
  };
};

export const sendContactFormEmail = async (
  email: string,
  firstName: string,
  lastName: string,
  message: string
) => {
  const { data, error } = await resend.emails.send({
    from: "Conscious Club <Contact@consciousclubb.com>",
    to: ["rg5353070@gmail.com", "info@ravisi.ms", "manavi@ravisi.ms"],
    replyTo: email,
    subject: `Contact Inquiry by ${firstName} ${lastName} from Conscious Club`,
    react: ContactMessageEmail({
      firstName,
      lastName,
      email,
      message,
    }),
  });

  if (error) {
    console.log("error sending email", error.name, error.message);
    return {
      error: `could not send email -> ${error.message}}`,
    };
  }

  return { data };
};
