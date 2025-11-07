import { OnboardingStep } from "../types";
import { SparklesText } from "@/components/ui/sparkles-text";

interface StepHeaderProps {
  step: OnboardingStep | undefined;
}

export const StepHeader = ({ step }: StepHeaderProps) => {
  return (
    <div className="text-center">
      <SparklesText className="text-2xl font-semibold ">
        {step?.title}
      </SparklesText>
      {/* <p className="text-sm text-muted-foreground">{step?.description}</p> */}
    </div>
  );
};
