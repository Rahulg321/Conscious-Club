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
      <section className="relative overflow-y-auto">
        <div className="absolute left-4 top-4 md:left-8 md:top-8 z-10">
          <Link href="/">
            <Image src={CClogo} alt="ConsciousClub Logo" />
          </Link>
        </div>
        <OnboardingForm />
      </section>

      <aside className="hidden md:block relative">
        <TestimonialPanel imageUrl={testimonialImage} />
      </aside>
    </main>
  );
}
