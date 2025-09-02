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
      <div className="flex flex-col items-center justify-center px-4 py-8">
        <div
          className={`flex flex-col ${containerDirectionClass} items-center justify-center gap-12 lg:gap-20 max-w-6xl w-full`}
        >
          <div className="flex-shrink-0">
            <img
              src={image.src}
              alt={image.alt}
              className="w-full max-w-md lg:max-w-lg h-auto"
            />
          </div>

          <div className="flex flex-col space-y-8 max-w-md">
            <h1
              className={`font-bold text-5xl sm:text-6xl md:text-7xl lg:text-8xl ${accentClassName} mb-8 leading-tight`}
            >
              {title}
            </h1>

            <div className="space-y-8">
              {features.map((feature, index) => (
                <div
                  className="flex items-start gap-6"
                  key={`${index}-${feature.text}`}
                >
                  <div className="flex-shrink-0 w-8 h-8 sm:w-10 sm:h-10  mt-1">
                    <PiStarFourFill
                      className={`size-4 ${iconClassName} md:size-6 lg:size-8`}
                    />
                  </div>
                  <p className="text-lg sm:text-xl ">{feature.text}</p>
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
