"use client";

import { OnboardingForm } from "@/components/forms/onboarding-form";
import { TestimonialPanel } from "@/components/testimonial-panel";

export function OnboardingPageContent() {
  return (
    <main className="min-h-svh grid grid-cols-1 md:grid-cols-2 overflow-hidden bg-background">
      <section className="relative overflow-y-auto scrollbar-thin">
        <div className="min-h-full">
          <OnboardingForm />
        </div>
      </section>

      <aside className="hidden md:block relative">
        <TestimonialPanel />
      </aside>
    </main>
  );
}
