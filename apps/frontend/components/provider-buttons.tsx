"use client";

import { Button } from "@/components/ui/button";
import { Apple } from "lucide-react";
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";

export function ProviderButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button
        variant="outline"
        className="h-10 w-full justify-center gap-2 bg-transparent"
      >
        <FcGoogle />
        <span className="text-sm">Google</span>
      </Button>
      <Button
        variant="outline"
        className="h-10 w-full justify-center gap-2 bg-transparent"
      >
        <FaApple className="h-4 w-4" aria-hidden="true" />
        <span className="text-sm">Apple</span>
      </Button>
    </div>
  );
}
