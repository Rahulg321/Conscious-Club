import React from "react";
import { PiStarFourFill } from "react-icons/pi";

type FeatureItem = {
  text: string;
  iconSvgPath?: string;
};

type SplitFeatureSectionProps = {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  image: { src: string; alt: string };
  features: FeatureItem[];
  accentClassName?: string;
  iconClassName?: string;
  orientation?: "row" | "row-reverse";
};

const defaultStarPath =
  "M12 2L15.09 8.26L22 9L17 14L18.18 21L12 17.77L5.82 21L7 14L2 9L8.91 8.26L12 2Z";

const SplitFeatureSection: React.FC<SplitFeatureSectionProps> = ({
  eyebrow,
  title,
  subtitle,
  image,
  features,
  accentClassName = "text-purple-600",
  iconClassName = "text-purple-600",

  orientation = "row",
}) => {
  const containerDirectionClass =
    orientation === "row-reverse" ? "lg:flex-row-reverse" : "lg:flex-row";

  return (
    <div className="w-full">
      <div className="flex flex-col items-center justify-center px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 md:py-16 lg:py-20">
        <div
          className={`flex flex-col ${containerDirectionClass} items-center justify-center gap-8 sm:gap-10 md:gap-12 lg:gap-16 xl:gap-20 max-w-7xl w-full`}
        >
          {/* Image Container */}
          <div className="flex-shrink-0 w-full sm:w-auto">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full max-w-[280px] sm:max-w-[320px] md:max-w-[380px] lg:max-w-[440px] xl:max-w-[500px] h-auto mx-auto"
            />
          </div>

          {/* Content Container */}
          <div className="flex flex-col space-y-4 sm:space-y-6 md:space-y-8 w-full lg:w-auto lg:flex-1 lg:max-w-xl">
            <h1
              className={`font-bold text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl } leading-tight`}
            >
              {title}
            </h1>

            {subtitle && (
              <p className="text-base sm:text-lg md:text-xl text-gray-700 leading-relaxed">
                {subtitle}
              </p>
            )}

            {/* Features List */}
            <div className="space-y-4 sm:space-y-5 md:space-y-6 pt-2 sm:pt-4">
              {features.map((feature, index) => (
                <div
                  className="flex items-start gap-3 sm:gap-4 "
                  key={`${index}-${feature.text}`}
                >
                  <div className="flex-shrink-0 mt-0.5 sm:mt-1">
                    <PiStarFourFill
                      className={`w-5 h-5 sm:w-6 sm:h-6 md:w-7 md:h-7`}
                    />
                  </div>
                  <p className="text-sm sm:text-base md:text-lg lg:text-xl text-gray-800 leading-relaxed">
                    {feature.text}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SplitFeatureSection;
