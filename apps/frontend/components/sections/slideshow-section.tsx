"use client";

import React, { useEffect, useState } from "react";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
// @ts-ignore - embla-carousel-autoplay doesn't have types
import Autoplay from "embla-carousel-autoplay";
import Image from "next/image";

// Import all images dynamically
const images = Array.from({ length: 10 }, (_, i) => ({
  src: `/slideshow/${i + 1}.png`,
  alt: `Creator testimonial ${i + 1}`,
}));

const SlideshowSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="py-16 px-4 ">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl italic font-semibold text-gray-900 mb-4">
            A Little Love Note from One Creator to Another
          </h2>
        </div>

        {/* Slideshow */}
        <div className="relative">
          <Carousel
            setApi={setApi}
            className="w-full"
            opts={{
              align: "start",
              loop: true,
            }}
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
                <CarouselItem key={index} className="md:basis-1/2 lg:basis-1/3">
                  <div className="relative rounded-lg overflow-hidden shadow-lg bg-gray-100">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      width={400}
                      height={300}
                      className="w-full h-auto object-contain transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = `data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3EImage ${index + 1}%3C/text%3E%3C/svg%3E`;
                      }}
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>

          {/* Slide indicators */}
          <div className="flex justify-center mt-6 space-x-2">
            {Array.from({ length: count }).map((_, index) => (
              <button
                key={index}
                className={`w-2 h-2 rounded-full transition-colors duration-300 ${
                  index === current - 1
                    ? "bg-gray-900"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => api?.scrollTo(index)}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Attribution */}
        <div className="text-center mt-12">
          <p className="text-lg text-gray-600 italic">-🖤 Manavi</p>
          <p className="text-sm text-gray-500 mt-1">
            Artist & Founder, ConsciousClubb
          </p>
        </div>
      </div>
    </section>
  );
};

export default SlideshowSection;
