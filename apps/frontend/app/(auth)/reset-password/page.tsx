import { Metadata } from "next";
import ResetPasswordClient from "./reset-password-client";

export const metadata: Metadata = {
  title: "Reset Password | Conscious Club",
  description:
    "Reset your Conscious Club account password. Enter your email address and we'll send you a secure link to create a new password.",
  keywords: [
    "reset password",
    "forgot password",
    "conscious club",
    "account recovery",
    "password reset",
  ],
  robots: "noindex, nofollow", // Don't index password reset pages
  openGraph: {
    title: "Reset Password | Conscious Club",
    description: "Reset your Conscious Club account password securely.",
    type: "website",
  },
};

export default function Page() {
  return <ResetPasswordClient />;
}
