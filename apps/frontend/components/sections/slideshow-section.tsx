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
import Image1 from "@/public/slideshow/1.png";
import Image2 from "@/public/slideshow/2.png";
import Image3 from "@/public/slideshow/3.png";
import Image4 from "@/public/slideshow/4.png";
import Image5 from "@/public/slideshow/5.png";
import Image6 from "@/public/slideshow/6.png";
import Image7 from "@/public/slideshow/7.png";
import Image8 from "@/public/slideshow/8.png";
import Image9 from "@/public/slideshow/9.png";
import Image10 from "@/public/slideshow/10.png";

const SlideshowSection = () => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const [count, setCount] = useState(0);

  const images = [
    {
      src: Image1,
      alt: "Creator testimonial 1",
    },
    {
      src: Image2,
      alt: "Creator testimonial 2",
    },
    {
      src: Image3,
      alt: "Creator testimonial 3",
    },
    {
      src: Image4,
      alt: "Creator testimonial 4",
    },
    {
      src: Image5,
      alt: "Creator testimonial 5",
    },
    {
      src: Image6,
      alt: "Creator testimonial 6",
    },
    {
      src: Image7,
      alt: "Creator testimonial 7",
    },
    {
      src: Image8,
      alt: "Creator testimonial 8",
    },
    {
      src: Image9,
      alt: "Creator testimonial 9",
    },
    {
      src: Image10,
      alt: "Creator testimonial 10",
    },
  ];

  useEffect(() => {
    if (!api) return;

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  return (
    <section className="py-16 px-4 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
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
                  <div className="relative aspect-[4/3] rounded-lg overflow-hidden shadow-lg">
                    <Image
                      src={image.src}
                      alt={image.alt}
                      fill
                      className="object-cover transition-transform duration-300 hover:scale-105"
                      onError={(e) => {
                        // Fallback for placeholder images
                        const target = e.target as HTMLImageElement;
                        target.src =
                          "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='400' height='300' viewBox='0 0 400 300'%3E%3Crect width='400' height='300' fill='%23f3f4f6'/%3E%3Ctext x='50%25' y='50%25' text-anchor='middle' dy='.3em' font-family='Arial, sans-serif' font-size='16' fill='%236b7280'%3EImage %7B" +
                          (index + 1) +
                          "%7D%3C/text%3E%3C/svg%3E";
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
