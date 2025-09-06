import { OnboardingStep } from "../types";

interface StepHeaderProps {
  step: OnboardingStep | undefined;
}

export const StepHeader = ({ step }: StepHeaderProps) => {
  return (
    <div className="text-center">
      <h1 className="text-balance text-2xl font-semibold tracking-tight">
        {step?.title}
      </h1>
      <p className="mt-2 text-sm text-muted-foreground">{step?.description}</p>
    </div>
  );
};
