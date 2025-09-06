import Image from "next/image";
import { Star } from "lucide-react";

export function TestimonialPanel({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative h-full w-full">
      <Image
        src={
          imageUrl ||
          "/placeholder.svg?height=1200&width=900&query=portrait%20photo%20for%20login%20testimonial"
        }
        alt="Login testimonial"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover"
        priority
      />

      {/* Overlay for contrast */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-black/0" />

      {/* Copy */}
      <div className="absolute bottom-8 left-6 right-6 text-white md:left-10 md:right-10 md:bottom-12">
        <p className="text-pretty text-xl md:text-2xl font-medium">
          This platform makes challenges feel like games, and rewards feel even
          sweeter!
        </p>

        <div className="mt-6 flex items-center gap-2">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="h-4 w-4 fill-white text-white"
              aria-hidden="true"
            />
          ))}
        </div>

        <div className="mt-6">
          <p className="text-base font-semibold">Sarah Fernandez</p>
          <p className="text-xs/relaxed opacity-90">UI/UX Designer, Google</p>
        </div>
      </div>
    </div>
  );
}
