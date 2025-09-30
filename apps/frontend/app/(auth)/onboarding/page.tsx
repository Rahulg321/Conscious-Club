import { auth } from "@/auth";
import { OnboardingPageContent } from "@/components/onboarding-page-content";
import { OnboardingProvider } from "@/components/forms/onboarding/context/OnboardingContext";
import { redirect } from "next/navigation";

export const metadata = {
  title: "Onboarding",
  description: "Onboarding",
};

export default async function OnboardingPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  // Check if user has already completed onboarding
  const onboardingCompleted = (userSession.user as any)?.onboardingCompleted;
  if (onboardingCompleted) {
    redirect("/dashboard");
  }

  const step = parseInt((await searchParams).step as string, 10) || 1;

  return (
    <OnboardingProvider>
      <OnboardingPageContent step={step} />
    </OnboardingProvider>
  );
}
