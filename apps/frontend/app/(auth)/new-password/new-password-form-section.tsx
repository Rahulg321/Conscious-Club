"use client";

import { useSearchParams, useRouter } from "next/navigation";
import React, { useActionState, useEffect, useState } from "react";
import {
  newPasswordVerification,
  NewPasswordVerificationActionState,
} from "@/lib/actions/new-password-verification";
import { SubmitButton } from "@/components/buttons/submit-button";
import Link from "next/link";

import { toast } from "sonner";
import { NewPasswordForm } from "@/components/forms/new-password-form";

const NewPasswordFormSection = () => {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [isSuccessful, setIsSuccessful] = useState(false);
  const router = useRouter();

  const [state, formAction] = useActionState<
    NewPasswordVerificationActionState,
    FormData
  >(newPasswordVerification, {
    status: "idle",
  });

  useEffect(() => {
    if (state.status === "failed") {
      toast.error("Failed to reset password!");
    } else if (state.status === "invalid_data") {
      toast.error("Failed to reset password!");
    } else if (state.status === "user_not_found") {
      toast.error("The user was not found!");
    } else if (state.status === "success") {
      setIsSuccessful(true);
      toast.success(
        "Password reset successfully! You can now login with your new password."
      );
      router.push("/login");
    } else if (state.status === "invalid_token") {
      toast.error("The token is invalid!");
    } else if (state.status === "expired_token") {
      toast.error("The token has expired!");
    }
  }, [state.status, router]);

  const handleSubmit = (formData: FormData) => {
    formData.set("token", token as string);
    formAction(formData);
  };

  return (
    <NewPasswordForm action={handleSubmit}>
      <SubmitButton isSuccessful={isSuccessful}>
        {state.status === "in_progress" ? "Saving..." : "Save"}
      </SubmitButton>
      <div className="mt-4 text-center text-sm">
        <Link
          href="/login"
          className="font-semibold text-gray-800 hover:underline dark:text-zinc-200"
        >
          Back to login
        </Link>
      </div>
    </NewPasswordForm>
  );
};

export default NewPasswordFormSection;
