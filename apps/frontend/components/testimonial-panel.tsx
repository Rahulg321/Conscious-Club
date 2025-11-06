import Image from "next/image";

export function TestimonialPanel({ imageUrl }: { imageUrl: string }) {
  return (
    <div className="flex justify-center items-center h-full pr-24 rounded-2xl">
      <div className="relative w-full h-full overflow-hidden aspect-square ">
        <Image
          src={
            imageUrl ||
            "/placeholder.svg?height=1200&width=900&query=portrait%20photo%20for%20login%20testimonial"
          }
          alt="Login testimonial"
          fill
          sizes="(min-width: 708px) 50vw, 100vw"
          className="object-fit w-max rounded-2xl"
          priority
        />
      </div>
    </div>
  );
}
