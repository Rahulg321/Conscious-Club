import { Metadata } from "next";
import ResetPasswordClient from "./reset-password-client";
import { TestimonialPanel } from "@/components/testimonial-panel";
import Link from "next/link";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";
import React, { Suspense } from "react";

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
  return (
    <main className="min-h-svh grid grid-cols-1 md:grid-cols-2">
      <section className="relative flex items-center justify-center bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <ResetPasswordClient />
        </Suspense>
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/">
            <Image src={CClogo} alt="ConsciousClub Logo" />
          </Link>
        </div>
      </section>

      <aside className="hidden md:block">
        <TestimonialPanel />
      </aside>
    </main>
  );
}
