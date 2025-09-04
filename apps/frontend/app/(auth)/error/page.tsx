import Link from "next/link";
import React from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Shield,
  Mail,
  Link as LinkIcon,
  Settings,
  RefreshCw,
} from "lucide-react";

interface ErrorConfig {
  icon: React.ReactNode;
  title: string;
  description: string;
  primaryAction: {
    label: string;
    href: string;
  };
  secondaryAction?: {
    label: string;
    href: string;
  };
  color: "red" | "yellow" | "blue" | "orange";
}

const getErrorConfig = (error: string): ErrorConfig => {
  const configs: Record<string, ErrorConfig> = {
    Configuration: {
      icon: <Settings className="h-8 w-8" />,
      title: "Configuration Error",
      description:
        "There's a problem with the authentication configuration. Please contact support or try again later.",
      primaryAction: { label: "Contact Support", href: "/contact" },
      secondaryAction: { label: "Try Again", href: "/login" },
      color: "red",
    },
    AccessDenied: {
      icon: <Shield className="h-8 w-8" />,
      title: "Access Denied",
      description:
        "You don't have permission to access this resource. Please check your account status or contact an administrator.",
      primaryAction: { label: "Back to Login", href: "/login" },
      secondaryAction: { label: "Contact Admin", href: "/contact" },
      color: "orange",
    },
    Verification: {
      icon: <Mail className="h-8 w-8" />,
      title: "Email Verification Required",
      description:
        "Please check your email and click the verification link before signing in. If you didn't receive the email, you can request a new one.",
      primaryAction: { label: "Check Email", href: "/login" },
      secondaryAction: { label: "Resend Email", href: "/resend-verification" },
      color: "blue",
    },
    OAuthAccountNotLinked: {
      icon: <LinkIcon className="h-8 w-8" />,
      title: "Account Not Linked",
      description:
        "This OAuth account is not linked to your existing account. Please sign in with your original method or contact support.",
      primaryAction: { label: "Sign In with Email", href: "/login" },
      secondaryAction: { label: "Contact Support", href: "/contact" },
      color: "yellow",
    },
    Default: {
      icon: <AlertTriangle className="h-8 w-8" />,
      title: "Authentication Error",
      description:
        "An unexpected error occurred during authentication. Please try again or contact support if the problem persists.",
      primaryAction: { label: "Try Again", href: "/login" },
      secondaryAction: { label: "Contact Support", href: "/contact" },
      color: "red",
    },
  };

  return configs[error] ?? configs.Default!;
};

const getColorClasses = (color: string) => {
  const colorMap = {
    red: {
      bg: "bg-red-100",
      text: "text-red-500",
      border: "border-red-200",
    },
    yellow: {
      bg: "bg-yellow-100",
      text: "text-yellow-500",
      border: "border-yellow-200",
    },
    blue: {
      bg: "bg-blue-100",
      text: "text-blue-500",
      border: "border-blue-200",
    },
    orange: {
      bg: "bg-orange-100",
      text: "text-orange-500",
      border: "border-orange-200",
    },
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.red;
};

const ErrorPage = async ({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const { error } = await searchParams;
  const errorString = Array.isArray(error) ? error[0] : error;

  console.log("error", errorString);

  const errorConfig = getErrorConfig(errorString || "Default");
  const colors = getColorClasses(errorConfig.color);

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <section
        className={`bg-white rounded-xl shadow-xl p-8 max-w-lg w-full text-center border ${colors.border}`}
      >
        <div className="flex flex-col items-center gap-4 mb-8">
          <span
            className={`${colors.bg} rounded-full p-4 border-2 ${colors.border}`}
          >
            {errorConfig.icon}
          </span>
          <h1 className="text-3xl font-bold text-gray-800">
            {errorConfig.title}
          </h1>
          <p className="text-gray-600 text-base leading-relaxed">
            {errorConfig.description}
          </p>
        </div>

        <div className="space-y-3">
          <Button asChild className="w-full h-12 text-base font-medium">
            <Link href={errorConfig.primaryAction.href}>
              {errorConfig.primaryAction.label}
            </Link>
          </Button>

          {errorConfig.secondaryAction && (
            <Button
              asChild
              variant="outline"
              className="w-full h-12 text-base font-medium"
            >
              <Link href={errorConfig.secondaryAction.href}>
                {errorConfig.secondaryAction.label}
              </Link>
            </Button>
          )}
        </div>

        <div className="mt-6 pt-6 border-t border-gray-200">
          <div className="flex items-center justify-center gap-4 text-sm text-gray-500">
            <Link
              href="/"
              className="hover:text-gray-700 hover:underline transition-colors"
            >
              Go to Home
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/help"
              className="hover:text-gray-700 hover:underline transition-colors"
            >
              Help Center
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/contact"
              className="hover:text-gray-700 hover:underline transition-colors"
            >
              Contact Support
            </Link>
          </div>
        </div>

        {/* Error details for debugging (only in development) */}
        {process.env.NODE_ENV === "development" && errorString && (
          <div className="mt-6 p-4 bg-gray-100 rounded-lg text-left">
            <p className="text-xs text-gray-500 mb-2">Debug Info:</p>
            <code className="text-xs text-gray-700 break-all">
              Error: {errorString}
            </code>
          </div>
        )}
      </section>
    </main>
  );
};

export default ErrorPage;
