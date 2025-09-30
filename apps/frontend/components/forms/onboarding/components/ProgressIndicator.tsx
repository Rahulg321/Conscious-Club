import { OnboardingStep } from "../types";

interface ProgressIndicatorProps {
  steps: OnboardingStep[];
  currentStep: number;
}

export const ProgressIndicator = ({
  steps,
  currentStep,
}: ProgressIndicatorProps) => {
  const totalSteps = steps.length;
  const progressPercentage = ((currentStep - 1) / (totalSteps - 1)) * 100;

  return (
    <div className="w-full mx-auto">
      <div className="relative">
        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-indigo-600 rounded-full transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        {/* Step labels */}
        {/* <div className="flex justify-between mt-2">
          {steps.map((step, index) => (
            <span
              key={step.id}
              className={`text-xs font-medium transition-colors duration-200 ${
                step.id <= currentStep ? "text-indigo-600" : "text-gray-400"
              }`}
            >
              {step.title || `Step ${step.id}`}
            </span>
          ))}
        </div> */}
      </div>
    </div>
  );
};
