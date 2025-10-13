"use client";

import { OnboardingForm } from "@/components/forms/onboarding-form";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { getTestimonialImage } from "@/lib/testimonial-images";
import { useOnboardingContext } from "@/components/forms/onboarding/context/OnboardingContext";
import Link from "next/link";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";

export function OnboardingPageContent({ step }: { step: number }) {
  const { formData } = useOnboardingContext();

  const testimonialImage = getTestimonialImage(formData.userRole as any, step);

  return (
    <main className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <section className="relative overflow-y-auto scrollbar-thin">
        <div className="min-h-full">
          <OnboardingForm />
        </div>
      </section>

      <aside className="hidden md:block relative">
        <TestimonialPanel imageUrl={testimonialImage} />
      </aside>
    </main>
  );
}
