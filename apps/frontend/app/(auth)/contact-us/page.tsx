import { ContactUsForm } from "@/components/forms/contact-us-form";
import { TestimonialPanel } from "@/components/testimonial-panel";
import { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import CClogo from "@/public/cc-home-logo.png";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Get in touch with us",
};

export default function ContactUsPage() {
  return (
    <main className="grid grid-cols-1 md:grid-cols-2">
      <section className="relative flex items-center justify-center bg-white">
        <div className="absolute left-4 top-4 md:left-8 md:top-8">
          <Link href="/">
            <Image src={CClogo} alt="ConsciousClub Logo" />
          </Link>
        </div>

        <div className="w-full max-w-md px-4 md:px-8">
          <div className="text-center mb-6">
            <h1 className="text-balance text-2xl font-semibold tracking-tight">
              Get in Touch
            </h1>
            <p className="mt-2 text-sm text-muted-foreground">
              We'd love to hear from you. Send us a message and we'll respond as
              soon as possible.
            </p>
          </div>

          <ContactUsForm />
        </div>
      </section>

      {/* Right: Testimonial panel with image */}
      <aside className="hidden md:block">
        <TestimonialPanel imageUrl="/onboarding/CC_Onboarding_Register.png" />
      </aside>
    </main>
  );
}
