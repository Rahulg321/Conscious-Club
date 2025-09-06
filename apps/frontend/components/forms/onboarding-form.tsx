"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingForm } from "./onboarding/hooks/useOnboardingForm";
import { getStepsForRole } from "./onboarding/config";
import { StepHeader } from "./onboarding/components/StepHeader";
import { ProgressIndicator } from "./onboarding/components/ProgressIndicator";
import { RoleSelectionStep } from "./onboarding/components/steps/RoleSelectionStep";
import { ProfileCompletionStep } from "./onboarding/components/steps/ProfileCompletionStep";
import { InterestsStep } from "./onboarding/components/steps/InterestsStep";
import { DisciplineRoleStep } from "./onboarding/components/steps/DisciplineRoleStep";
import { ProjectUploadStep } from "./onboarding/components/steps/ProjectUploadStep";

export function OnboardingForm() {
  const {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    handleFileUpload,
    submitOnboarding,
    isSubmitting,
    submitError,
  } = useOnboardingForm();

  const steps = getStepsForRole(formData.userRole as any);
  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <StepHeader step={currentStepData} />

      {/* Progress indicator */}
      <ProgressIndicator steps={steps} currentStep={currentStep} />

      <Separator />

      {/* Error display */}
      {submitError && (
        <div className="rounded-md bg-red-50 p-4">
          <div className="text-sm text-red-700">{submitError}</div>
        </div>
      )}

      {/* Step content */}
      <div className="space-y-4">
        {currentStep === 1 && (
          <RoleSelectionStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 2 && (
          <ProfileCompletionStep
            formData={formData}
            updateFormData={updateFormData}
            handleFileUpload={handleFileUpload}
          />
        )}

        {currentStep === 3 && formData.userRole === "explorer" && (
          <InterestsStep formData={formData} updateFormData={updateFormData} />
        )}

        {currentStep === 3 && formData.userRole !== "explorer" && (
          <DisciplineRoleStep
            formData={formData}
            updateFormData={updateFormData}
          />
        )}

        {currentStep === 4 && formData.userRole !== "explorer" && (
          <ProjectUploadStep
            formData={formData}
            updateFormData={updateFormData}
            handleFileUpload={handleFileUpload}
          />
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < steps.length ? (
          <Button
            onClick={() => nextStep(steps.length)}
            className="flex items-center gap-2"
          >
            {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button
            onClick={submitOnboarding}
            disabled={isSubmitting}
            className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50"
          >
            {isSubmitting ? "Submitting..." : "Get Started"}
          </Button>
        )}
      </div>
    </div>
  );
}
