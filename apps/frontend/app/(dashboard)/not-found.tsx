import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Home, Search, FileQuestion } from "lucide-react";
import BackButton from "./back-button";

export default async function NotFound() {
  const userSession = await auth();

  if (!userSession?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center px-4">
      <div className="max-w-2xl mx-auto text-center">
        {/* 404 Illustration */}
        <div className="mb-8">
          <div className="relative">
            <div className="text-8xl md:text-9xl font-bold text-gray-200 select-none">
              404
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <FileQuestion className="w-16 h-16 md:w-20 md:h-20 text-gray-400" />
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Oops! Page Not Found
          </h1>
          <p className="text-lg text-gray-600 mb-6 max-w-lg mx-auto">
            The page you're looking for seems to have wandered off into the
            digital void. Don't worry, even the best explorers sometimes take a
            wrong turn.
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
          <Button asChild size="lg" className="w-full sm:w-auto">
            <Link
              href={`/profile/${userSession?.user?.id}`}
              className="flex items-center gap-2"
            >
              <Home className="w-5 h-5" />
              Go to Profile
            </Link>
          </Button>

          <Button
            asChild
            variant="outline"
            size="lg"
            className="w-full sm:w-auto"
          >
            <Link href="/dashboard" className="flex items-center gap-2">
              <Search className="w-5 h-5" />
              Explore Dashboard
            </Link>
          </Button>

          <BackButton />
        </div>

        {/* Helpful Links */}
        <div className="border-t border-gray-200 pt-8">
          <p className="text-sm text-gray-500 mb-4">
            Or try these popular pages:
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-sm">
            <Link
              href="/discover"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Discover Projects
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/community"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Community
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/bravos"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Bravos
            </Link>
            <span className="text-gray-300">•</span>
            <Link
              href="/support"
              className="text-blue-600 hover:text-blue-800 hover:underline transition-colors"
            >
              Support
            </Link>
          </div>
        </div>

        {/* Fun Message */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
          <p className="text-sm text-blue-800">
            💡 <strong>Pro tip:</strong> Use the search bar in the dashboard to
            quickly find what you're looking for!
          </p>
        </div>
      </div>
    </div>
  );
}
