import Image from "next/image";

export function TestimonialPanel({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="relative w-full h-full overflow-hidden">
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
    </div>
  );
}
