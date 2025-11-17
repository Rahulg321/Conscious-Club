import NewVerificationForm from "@/components/forms/new-verification-form";
import { Metadata } from "next";
import React, { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";
import { NavbarLogo } from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "Verify Email | Conscious Club",
  description:
    "Verify your email address to complete your Conscious Club account setup. Check your inbox for the verification link and click it to activate your account.",
  keywords: [
    "email verification",
    "verify email",
    "conscious club",
    "account activation",
    "email confirmation",
  ],
  robots: "noindex, nofollow", // Don't index verification pages
  openGraph: {
    title: "Verify Email | Conscious Club",
    description:
      "Verify your email address to complete your Conscious Club account setup.",
    type: "website",
  },
};

const NewVerificationPage = () => {
  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <NavbarLogo />
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-6">
        <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
          <h3 className="text-xl font-semibold text-foreground">
            Confirming your verification
          </h3>
          <p className="text-sm text-muted-foreground">
            Once your email is verified, you can sign in to your account.
          </p>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <NewVerificationForm />
        </Suspense>
      </div>
    </div>
  );
};

export default NewVerificationPage;
