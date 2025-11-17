import { getPasswordResetTokenByToken } from "@/lib/queries";
import Link from "next/link";
import NewPasswordFormSection from "./new-password-form-section";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { Metadata } from "next";
import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { NavbarLogo } from "@/components/ui/navbar";

export const metadata: Metadata = {
  title: "Set New Password | Conscious Club",
  description:
    "Create a new password for your Conscious Club account. Use the secure link sent to your email to reset your password and regain access to your account.",
  keywords: [
    "new password",
    "set password",
    "conscious club",
    "account security",
    "password reset",
  ],
  robots: "noindex, nofollow", // Don't index password reset pages
  openGraph: {
    title: "Set New Password | Conscious Club",
    description:
      "Create a new password for your Conscious Club account securely.",
    type: "website",
  },
};

type Props = {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ResetPasswordPage = async (props: Props) => {
  return (
    <main className="min-h-svh grid grid-cols-1 md:grid-cols-2">
      <section className="relative flex items-center justify-center bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <PasswordResetContent searchParams={props.searchParams} />
        </Suspense>
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <NavbarLogo />
        </div>
      </section>

      <aside className="hidden md:block">
        <TestimonialPanel />
      </aside>
    </main>
  );
};

async function PasswordResetContent({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedSearchParams = await searchParams;
  const paramsToken = resolvedSearchParams?.token;
  let dbToken;

  if (paramsToken) {
    dbToken = await getPasswordResetTokenByToken(paramsToken as string);
  }

  if (!dbToken) {
    return (
      <div className="w-full max-w-md px-4 py-12 md:px-8">
        <div className="flex flex-col items-center justify-center gap-2 text-center">
          <h3 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
            Invalid Token
          </h3>
          <p className="mt-2 text-sm text-muted-foreground">
            The token is invalid or has expired. Please request a new password
            reset link.
          </p>
        </div>
        <div className="mt-6 text-center">
          <Button asChild>
            <Link href="/reset-password" className="">
              Request New Password Reset
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md px-4 py-12 md:px-8">
      <div className="text-center mb-6">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
          Set up a new Password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your new password below for {dbToken.email}.
        </p>
      </div>
      <Suspense>
        <NewPasswordFormSection />
      </Suspense>
    </div>
  );
}

export default ResetPasswordPage;
