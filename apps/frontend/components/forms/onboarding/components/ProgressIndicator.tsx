import { Check } from "lucide-react";
import { OnboardingStep } from "../types";

interface ProgressIndicatorProps {
  steps: OnboardingStep[];
  currentStep: number;
}

export const ProgressIndicator = ({
  steps,
  currentStep,
}: ProgressIndicatorProps) => {
  return (
    <div className="flex items-center justify-center gap-2">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
              step.id < currentStep
                ? "bg-indigo-600 text-white"
                : step.id === currentStep
                  ? "bg-indigo-600 text-white"
                  : "bg-gray-200 text-gray-600"
            }`}
          >
            {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
          </div>
          {index < steps.length - 1 && (
            <div
              className={`h-0.5 w-8 ${step.id < currentStep ? "bg-indigo-600" : "bg-gray-200"}`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
