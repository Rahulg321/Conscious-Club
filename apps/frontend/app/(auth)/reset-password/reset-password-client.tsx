"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useActionState, useEffect, useState } from "react";
import { toast } from "sonner";

import { SubmitButton } from "@/components/buttons/submit-button";

import {
  ResetPasswordActionState,
  resetPassword,
} from "@/lib/actions/reset-password-action";
import { useSession } from "next-auth/react";
import { ResetPasswordForm } from "@/components/forms/reset-password-form";

export default function ResetPasswordClient() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSuccessful, setIsSuccessful] = useState(false);

  const [state, formAction] = useActionState<
    ResetPasswordActionState,
    FormData
  >(resetPassword, {
    status: "idle",
  });

  const { update: updateSession } = useSession();

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Invalid credentials!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed validating your submission!");
    } else if (state.status === "user_not_found") {
      toast.error("User not found!");
    } else if (state.status === "invalid_method") {
      toast.error("Invalid method!");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      toast.success(
        "Password reset email sent! Check your email for the link to reset your password."
      );

      setTimeout(() => {
        setIsSuccessful(false);
        router.refresh();
      }, 2000);
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    setEmail(formData.get("email") as string);
    formAction(formData);
  };

  return (
    <div className="w-full max-w-md px-4 py-12 md:px-8">
      <div className="text-center mb-6">
        <h1 className="text-balance text-2xl font-semibold tracking-tight text-foreground">
          Reset Password
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Enter your email to reset your password
        </p>
      </div>

      <ResetPasswordForm action={handleSubmit}>
        <SubmitButton isSuccessful={isSuccessful}>Reset Password</SubmitButton>
        <div className="mt-4 flex flex-col items-center justify-center gap-2 text-center text-sm text-muted-foreground">
          <Link
            href="/login"
            className="font-semibold text-foreground hover:underline transition-colors"
          >
            Back to login
          </Link>
          <p>
            {"Don't have an account? "}
            <Link
              href="/register"
              className="font-semibold text-foreground hover:underline transition-colors"
            >
              Sign up
            </Link>
            {" for free."}
          </p>
        </div>
      </ResetPasswordForm>
    </div>
  );
}
