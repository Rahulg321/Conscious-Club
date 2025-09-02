import React from "react";

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
  orientation = "row",
}) => {
  const containerDirectionClass =
    orientation === "row-reverse" ? "lg:flex-row-reverse" : "lg:flex-row";
  const iconFillClass = accentClassName.includes("text-")
    ? accentClassName.replace("text-", "fill-")
    : "fill-purple-500";

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
            <h2 className={`font-bold ${accentClassName} mb-8`}>{title}</h2>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <div
                  className="flex items-start gap-4"
                  key={`${index}-${feature.text}`}
                >
                  <div className="flex-shrink-0 w-6 h-6 mt-1">
                    <svg
                      viewBox="0 0 24 24"
                      className={`w-full h-full ${iconFillClass}`}
                    >
                      <path d={feature.iconSvgPath || defaultStarPath} />
                    </svg>
                  </div>
                  <p className="">{feature.text}</p>
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
