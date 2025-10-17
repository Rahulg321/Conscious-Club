"use client";

import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import SigninGoogle from "./buttons/google-signin-button";

export function ProviderButtons() {
  return (
    <div className="">
      <SigninGoogle />
    </div>
  );
}
