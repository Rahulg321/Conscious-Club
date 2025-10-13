import { auth } from "@/auth";
import { LoginForm } from "@/components/forms/login-form";
import { ProviderButtons } from "@/components/provider-buttons";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { redirect } from "next/navigation";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";

export const metadata: Metadata = {
  title: "Login",
  description: "Login to your account",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const error = (await searchParams).error;

  const userSession = await auth();

  if (userSession) {
    // Check if user has completed onboarding
    const onboardingCompleted = (userSession.user as any)?.onboardingCompleted;
    if (onboardingCompleted) {
      redirect("/dashboard");
    } else {
      redirect("/onboarding");
    }
  }

  // Error message configuration
  const getErrorMessage = (error: string | string[] | undefined) => {
    const errorString = Array.isArray(error) ? error[0] : error;

    switch (errorString) {
      case "OAuthAccountNotLinked":
        return {
          message:
            "This OAuth account is not linked to your existing account. Please sign in with your original method or contact support.",
          type: "warning" as const,
        };
      case "Configuration":
        return {
          message:
            "There's a problem with the authentication configuration. Please contact support or try again later.",
          type: "error" as const,
        };
      case "AccessDenied":
        return {
          message:
            "You don't have permission to access this resource. Please check your account status or contact an administrator.",
          type: "error" as const,
        };
      case "Verification":
        return {
          message:
            "Please check your email and click the verification link before signing in.",
          type: "info" as const,
        };
      default:
        return null;
    }
  };

  const errorInfo = getErrorMessage(error);

  return (
    <main className="min-h-screen grid grid-cols-1 md:grid-cols-2">
      {/* Left: Auth panel with soft light gradient */}
      <section className="relative flex items-center justify-center bg-white ">
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/">
            <Image src={CClogo} alt="ConsciousClub Logo" />
          </Link>
        </div>

        <div className="w-full max-w-md px-4 py-12 md:px-8">
          <div className="text-center mb-6">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">
              Welcome back
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              Please enter your details to sign in.
            </p>
          </div>

          {/* Error message display */}
          {errorInfo && (
            <div
              className={`mb-6 p-4 rounded-lg border ${
                errorInfo.type === "warning"
                  ? "bg-yellow-50 border-yellow-200 text-yellow-800"
                  : errorInfo.type === "error"
                    ? "bg-red-50 border-red-200 text-red-800"
                    : "bg-blue-50 border-blue-200 text-blue-800"
              }`}
            >
              <div className="text-sm font-medium mb-1">
                {errorInfo.type === "warning" && "⚠️ Account Not Linked"}
                {errorInfo.type === "error" && "❌ Authentication Error"}
                {errorInfo.type === "info" && "ℹ️ Verification Required"}
              </div>
              <div className="text-sm">{errorInfo.message}</div>
            </div>
          )}

          <ProviderButtons />
          <LoginForm />
        </div>
      </section>

      <aside className="hidden md:block">
        <TestimonialPanel imageUrl="/onboarding/CC_Onboarding_Register.png" />
      </aside>
    </main>
  );
}
