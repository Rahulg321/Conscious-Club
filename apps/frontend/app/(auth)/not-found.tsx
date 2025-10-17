import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Page Not Found | Conscious Club",
  description:
    "The page you're looking for doesn't exist. Return to Conscious Club to discover creative projects and connect with like-minded creators.",
  keywords: ["page not found", "404", "conscious club", "missing page"],
  robots: "noindex, nofollow", // Don't index 404 pages
  openGraph: {
    title: "Page Not Found | Conscious Club",
    description: "The page you're looking for doesn't exist on Conscious Club.",
    type: "website",
  },
};

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 px-4">
      <div className="max-w-md mx-auto text-center">
        <div className="mb-8">
          <h1 className="text-6xl font-bold text-gray-200 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-4">
            Page Not Found
          </h2>
          <p className="text-gray-600 mb-8">
            The page you're looking for doesn't exist in our creative community.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            href="/"
            className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Return to Conscious Club
          </Link>

          <div className="flex justify-center space-x-4 text-sm">
            <Link href="/login" className="text-blue-600 hover:underline">
              Sign In
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/register" className="text-blue-600 hover:underline">
              Sign Up
            </Link>
            <span className="text-gray-300">•</span>
            <Link href="/discover" className="text-blue-600 hover:underline">
              Discover
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
