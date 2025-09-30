"use client";

import { OnboardingForm } from "@/components/forms/onboarding-form";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { getTestimonialImage } from "@/lib/testimonial-images";
import { useOnboardingContext } from "@/components/forms/onboarding/context/OnboardingContext";

export function OnboardingPageContent({ step }: { step: number }) {
  const { formData } = useOnboardingContext();

  const testimonialImage = getTestimonialImage(formData.userRole as any, step);

  return (
    <main className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <section className="overflow-y-auto">
        <OnboardingForm />
      </section>

      <aside className="hidden md:block relative">
        <TestimonialPanel imageUrl={testimonialImage} />
      </aside>
    </main>
  );
}
