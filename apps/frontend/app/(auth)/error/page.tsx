import Link from "next/link";

import React, { Suspense } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertTriangle,
  Shield,
  Mail,
  Link as LinkIcon,
  Settings,
} from "lucide-react";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";
import { TestimonialPanel } from "@/components/testimonial-panel";

import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Authentication Error | Conscious Club",
  description:
    "There was an authentication error with your Conscious Club account. Please try again or contact our support team for assistance.",
  keywords: [
    "authentication error",
    "login error",
    "conscious club",
    "account error",
    "support",
  ],
  robots: "noindex, nofollow", // Don't index error pages
  openGraph: {
    title: "Authentication Error | Conscious Club",
    description:
      "There was an authentication error with your Conscious Club account.",
    type: "website",
  },
};

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
      icon: <Settings className="size-8" />,
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
      bg: "bg-red-100 dark:bg-red-950/20",
      text: "text-red-600 dark:text-red-400",
      border: "border-red-200 dark:border-red-800",
    },
    yellow: {
      bg: "bg-yellow-100 dark:bg-yellow-950/20",
      text: "text-yellow-600 dark:text-yellow-400",
      border: "border-yellow-200 dark:border-yellow-800",
    },
    blue: {
      bg: "bg-blue-100 dark:bg-blue-950/20",
      text: "text-blue-600 dark:text-blue-400",
      border: "border-blue-200 dark:border-blue-800",
    },
    orange: {
      bg: "bg-orange-100 dark:bg-orange-950/20",
      text: "text-orange-600 dark:text-orange-400",
      border: "border-orange-200 dark:border-orange-800",
    },
  };
  return colorMap[color as keyof typeof colorMap] || colorMap.red;
};

type Props = {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ErrorPage = async ({ searchParams }: Props) => {
  return (
    <main className="min-h-svh grid grid-cols-1 md:grid-cols-2">
      <section className="relative flex items-center justify-center bg-background">
        <Suspense fallback={<div>Loading...</div>}>
          <ErrorContent searchParams={searchParams} />
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
};

async function ErrorContent({ searchParams }: Props) {
  const { error } = await searchParams;

  const errorString = Array.isArray(error) ? error[0] : error;

  const errorConfig = getErrorConfig(errorString || "Default");

  const colors = getColorClasses(errorConfig.color);

  return (
    <div className="w-full max-w-md px-4 py-12 md:px-8">
      <div className="flex flex-col items-center gap-4 mb-8">
        <span
          className={`${colors.bg} rounded-full p-4 border-2 ${colors.border} flex items-center justify-center ${colors.text}`}
        >
          {errorConfig.icon}
        </span>
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
          {errorConfig.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground text-center leading-relaxed">
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

      <div className="mt-6 pt-6 border-t border-border">
        <div className="flex items-center justify-center gap-4 text-sm text-muted-foreground">
          <Link
            href="/"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Go to Home
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            href="/help"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Help Center
          </Link>
          <span className="text-muted-foreground/50">•</span>
          <Link
            href="/contact"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Contact Support
          </Link>
        </div>
      </div>

      {process.env.NODE_ENV === "development" && errorString && (
        <div className="mt-6 p-4 bg-muted rounded-lg text-left">
          <p className="text-xs text-muted-foreground mb-2">Debug Info:</p>
          <code className="text-xs text-foreground break-all">
            Error: {errorString}
          </code>
        </div>
      )}
    </div>
  );
}

export default ErrorPage;
