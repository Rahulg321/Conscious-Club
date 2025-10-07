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
    <div>
      <div className="flex flex-col items-center justify-center px-4 py-6">
        <div
          className={`flex flex-col ${containerDirectionClass} items-center justify-center gap-8 lg:gap-12 max-w-5xl w-full`}
        >
          <div className="flex-shrink-0">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full max-w-xs lg:max-w-md h-auto"
            />
          </div>

          <div className="flex flex-col space-y-6 max-w-md">
            <h1
              className={`font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl ${accentClassName} mb-6 leading-tight`}
            >
              {title}
            </h1>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  className="flex items-start gap-4"
                  key={`${index}-${feature.text}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 mt-1">
                    <PiStarFourFill
                      className={`size-3 ${iconClassName} md:size-4 lg:size-6`}
                    />
                  </div>
                  <p className="text-base sm:text-lg">{feature.text}</p>
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
