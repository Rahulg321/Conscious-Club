import { auth } from "@/auth";
import { OnboardingForm } from "@/components/forms/onboarding-form";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function OnboardingPage() {
  const userSession = await auth();

  if (!userSession) redirect("/login");

  return (
    <main className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      <section className="overflow-y-auto px-4 md:px-8 lg:px-12 py-8">
        <OnboardingForm />
      </section>

      <aside className="hidden md:block h-screen">
        <TestimonialPanel imageUrl="https://plus.unsplash.com/premium_photo-1756138487610-f76348465c58?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" />
      </aside>
    </main>
  );
}
