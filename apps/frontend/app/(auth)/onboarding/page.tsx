import { auth } from "@/auth";
import { OnboardingPageContent } from "@/components/onboarding-page-content";
import { OnboardingProvider } from "@/components/forms/onboarding/context/OnboardingContext";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import React, { Suspense } from "react";

export const metadata: Metadata = {
  title: "Complete Your Profile | Conscious Club",
  description:
    "Complete your Conscious Club profile setup to get started! Share your interests, skills, and connect with like-minded creators and explorers in our conscious community.",
  keywords: [
    "profile setup",
    "onboarding",
    "conscious club",
    "create profile",
    "get started",
  ],
  robots: "noindex, nofollow", // Don't index onboarding pages
  openGraph: {
    title: "Complete Your Profile | Conscious Club",
    description:
      "Complete your Conscious Club profile setup to get started with our creative community.",
    type: "website",
  },
};

export default async function OnboardingPage() {
  return (
    <OnboardingProvider>
      <Suspense fallback={<div>Loading...</div>}>
        <OnboardingAuthCheck />
      </Suspense>
      <OnboardingPageContent />
    </OnboardingProvider>
  );
}

async function OnboardingAuthCheck() {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  // Check if user has already completed onboarding
  const onboardingCompleted = (userSession.user as any)?.onboardingCompleted;
  if (onboardingCompleted) {
    redirect("/profile");
  }

  return null;
}
