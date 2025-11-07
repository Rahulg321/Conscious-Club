import Image from "next/image";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";

const images = Array.from({ length: 10 }, (_, i) => ({
  src: `/slideshow/${i + 1}.png`,
  alt: `Creator testimonial ${i + 1}`,
}));

export function TestimonialPanel() {
  return (
    <div className="flex justify-center items-center h-full pr-24 rounded-2xl">
      <Carousel
        className="w-full"
        plugins={[
          Autoplay({
            delay: 4000, // 4 seconds between slides
            stopOnInteraction: false,
            stopOnMouseEnter: false,
          }),
        ]}
      >
        <CarouselContent>
          {images.map((image, index) => (
            <CarouselItem key={index}>
              <div className="p-1">
                <Image
                  src={image.src}
                  alt={image.alt}
                  // sizes="(min-width: 708px) 50vw, 100vw"
                  width={1000}
                  height={1000}
                  className="object-cover w-full h-full rounded-2xl"
                  priority
                />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
}
