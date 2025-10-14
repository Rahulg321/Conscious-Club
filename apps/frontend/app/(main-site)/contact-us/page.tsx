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
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-2xl">
        <div className="bg-white rounded-2xl shadow-xl p-8 md:p-12">
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">
              Get in Touch
            </h1>
            <p className="mt-3 text-base text-gray-600">
              We'd love to hear from you. Send us a message and we'll respond
              within 24 hours as possible.
            </p>
          </div>

          <ContactUsForm />
        </div>
      </div>
    </main>
  );
}
