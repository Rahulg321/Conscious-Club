"use server";

import { sendContactFormEmail } from "../mail";
import { rateLimit } from "../redis";
import { headers } from "next/headers";

/**
 * Submits the contact form and sends an email to the user.
 *
 * @param values - The values of the contact form
 * @returns {
 *   status: boolean;
 *   message: string;
 *   resetTime: string;
 * }
 */
export async function submitContactForm(values: {
  firstName: string;
  lastName: string;
  email: string;
  message: string;
}) {
  const ip =
    (await headers()).get("x-forwarded-for")?.split(",")[0]?.trim() || "anon";
  const { ok, remaining, reset } = await rateLimit(
    `api:contact-form:${ip}`,
    5, // 5 requests per minute
    60_000 // 1 minute
  );
  if (!ok) {
    return {
      status: false,
      message: "Rate limit exceeded",
      resetTime: new Date(reset).toISOString(),
    };
  }

  console.log({ remaining, reset });

  try {
    console.log("Values", values);
    const emailResponse = await sendContactFormEmail(
      values.email,
      values.firstName,
      values.lastName,
      values.message
    );

    if (emailResponse?.error) {
      return {
        status: false,
        message: emailResponse?.error,
      };
    }

    return {
      status: true,
      message: "Email Sent!! Your query has been recorded",
    };
  } catch (error) {
    console.log("an error occured while trying to submit contact form");
    return {
      status: false,
      message: "",
    };
  }
}
