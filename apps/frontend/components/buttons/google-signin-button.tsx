"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { signIn } from "next-auth/react";
import { FaGoogle } from "react-icons/fa6";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { FcGoogle } from "react-icons/fc";

const SigninGoogle = () => {
  return (
    <Button
      variant="outline"
      className="h-10 w-full justify-center gap-2 bg-transparent"
      onClick={() => {
        signIn("google", { callbackUrl: DEFAULT_LOGIN_REDIRECT });
      }}
    >
      <FcGoogle />
      <span className="text-sm">Google</span>
    </Button>
  );
};

export default SigninGoogle;
