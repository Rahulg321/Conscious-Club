import { auth } from "@/auth";
import { RegisterForm } from "@/components/forms/register-form";
import { ProviderButtons } from "@/components/provider-buttons";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { redirect } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Sign Up | Conscious Club",
  description:
    "Join Conscious Club today! Create your free account to start sharing your creative projects, discovering inspiring content, and connecting with a community of conscious creators and explorers.",
  keywords: [
    "sign up",
    "register",
    "conscious club",
    "creative community",
    "join",
    "free account",
  ],
  openGraph: {
    title: "Sign Up | Conscious Club",
    description:
      "Join Conscious Club today! Create your free account to start sharing creative projects and connecting with conscious creators.",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Sign Up | Conscious Club",
    description:
      "Join Conscious Club today! Create your free account to start sharing creative projects and connecting with conscious creators.",
  },
};

export default async function RegisterPage() {
  return (
    <main className="min-h-svh grid grid-cols-1 md:grid-cols-2">
      <section className="relative flex items-center justify-center bg-background">
        <Suspense fallback={<div></div>}>
          <RegisterAuthCheck />
        </Suspense>
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/">
            <Image src={CClogo} alt="ConsciousClub Logo" />
          </Link>
        </div>

        <div className="w-full max-w-md px-4 py-12 md:px-8">
          <div className="text-center mb-6">
            <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
              Create your account
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your details to get started.
            </p>
          </div>

          <ProviderButtons />
          <Suspense>
            <RegisterForm />
          </Suspense>
        </div>
      </section>

      <aside className="hidden md:block">
        <TestimonialPanel />
      </aside>
    </main>
  );
}

async function RegisterAuthCheck() {
  const userSession = await auth();

  if (userSession) redirect("/profile");

  return null;
}
