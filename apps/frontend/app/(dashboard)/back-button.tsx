"use client";

import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function BackButton() {
  return (
    <Button
      variant="ghost"
      size="lg"
      onClick={() => window.history.back()}
      className="w-full sm:w-auto"
    >
      <ArrowLeft className="w-5 h-5 mr-2" />
      Go Back
    </Button>
  );
}
