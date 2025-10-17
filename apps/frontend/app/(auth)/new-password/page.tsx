import { getPasswordResetTokenByToken } from "@/lib/queries";
import Link from "next/link";
import NewPasswordFormSection from "./new-password-form-section";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";
import { Metadata } from "next";

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

const ResetPasswordPage = async (props: {
  params: Promise<{ token: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) => {
  const searchParams = await props.searchParams;
  const paramsToken = searchParams?.token;
  let dbToken;

  if (paramsToken) {
    dbToken = await getPasswordResetTokenByToken(paramsToken as string);
  }

  if (!dbToken) {
    return (
      <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/">
            <Image src={CClogo} alt="ConsciousClub Logo" />
          </Link>
        </div>
        <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-6">
          <div className="flex flex-col items-center justify-center gap-2 px-4 text-center sm:px-16">
            <h3 className="text-xl font-semibold">Invalid Token</h3>
            <p className="text-sm">
              The token is invalid or has expired. Please request a new password
              reset link.
            </p>
          </div>
          <div className="px-4 sm:px-16 pb-12 text-center">
            <Link
              href="/reset-password"
              className="font-semibold hover:underline"
            >
              Request New Password Reset
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-dvh w-screen items-start pt-12 md:pt-0 md:items-center justify-center bg-background">
      <div className="absolute left-4 top-4 md:left-8 md:top-8">
        <Link href="/">
          <Image src={CClogo} alt="ConsciousClub Logo" />
        </Link>
      </div>
      <div className="w-full max-w-md overflow-hidden rounded-2xl flex flex-col gap-12">
        <div className="flex flex-col items-center justify-center gap-2 px-4 pt-12 text-center sm:px-16">
          <h3 className="text-xl font-semibold">Set up a new Password</h3>
          <p className="text-sm">
            Enter your new password below for {dbToken.email}.
          </p>
        </div>
        <div className="px-4 sm:px-16 pb-12">
          <NewPasswordFormSection />
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
