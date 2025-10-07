import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <main className="h-screen grid grid-cols-1 md:grid-cols-2 overflow-hidden">
      {/* Left Section - Form Skeleton */}
      <section className="overflow-y-auto">
        <div className="">
          {/* Header with Progress */}
          <div className="px-4 py-4 space-y-4">
            {/* Progress Indicator */}
            <div className="flex items-center justify-between gap-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex-1">
                  <Skeleton className="h-2 w-full rounded-full" />
                </div>
              ))}
            </div>

            {/* Step Header */}
            <div className="space-y-2">
              <Skeleton className="h-8 w-48" />
              <Skeleton className="h-4 w-full max-w-md" />
            </div>

            {/* Separator */}
            <Skeleton className="h-px w-full" />
          </div>

          {/* Form Content */}
          <div className="px-4 md:px-8 lg:px-12 py-4 space-y-6">
            {/* Form Fields */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-32" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>

            {/* Action Buttons Grid */}
            <div className="grid grid-cols-2 gap-4">
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
              <Skeleton className="h-20 w-full rounded-lg" />
            </div>

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-4 mt-4 border-t border-gray-200">
              <Skeleton className="h-10 w-24" />
              <Skeleton className="h-10 w-24" />
            </div>
          </div>
        </div>
      </section>

      {/* Right Section - Testimonial Skeleton */}
      <aside className="hidden md:block relative bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="h-full flex flex-col items-center justify-center p-8 space-y-6">
          <Skeleton className="h-64 w-64 rounded-full" />
          <div className="space-y-3 w-full max-w-md">
            <Skeleton className="h-6 w-3/4 mx-auto" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6 mx-auto" />
          </div>
          <Skeleton className="h-8 w-40" />
        </div>
      </aside>
    </main>
  );
}
