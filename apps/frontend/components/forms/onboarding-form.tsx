"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingContext } from "./onboarding/context/OnboardingContext";
import { getStepsForRole } from "./onboarding/config";
import { StepHeader } from "./onboarding/components/StepHeader";
import { ProgressIndicator } from "./onboarding/components/ProgressIndicator";
import { RoleSelectionStep } from "./onboarding/components/steps/RoleSelectionStep";
import { ProfileCompletionStep } from "./onboarding/components/steps/ProfileCompletionStep";
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
    stepErrors,
  } = useOnboardingContext();

  const steps = getStepsForRole(formData.userRole as any);
  const currentStepData = steps.find((step) => step.id === currentStep);

  // Check if current step has validation errors
  const hasStepErrors =
    stepErrors[currentStep] && (stepErrors[currentStep]?.length ?? 0) > 0;

  return (
    <div className="pb-16">
      <div className="px-4 py-4 space-y-4 ">
        <ProgressIndicator steps={steps} currentStep={currentStep} />
        <StepHeader step={currentStepData} />
        <Separator />
      </div>

      <div className="px-4 md:px-8 lg:px-12 py-4 pb-16">
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

          {currentStep === 3 && (
            <DisciplineRoleStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 4 && (
            <ProjectUploadStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        <div className="mt-4 space-y-4">
          {/* Submit error display */}
          {submitError && (
            <div className="rounded-md bg-red-50 p-4">
              <div className="text-sm text-red-700">{submitError}</div>
            </div>
          )}

          {/* Step validation errors */}
          {stepErrors[currentStep] &&
            (stepErrors[currentStep]?.length ?? 0) > 0 && (
              <div className="rounded-md bg-red-50 p-4">
                <div className="text-sm text-red-700">
                  <p className="font-medium mb-2">
                    Please fix the following errors:
                  </p>
                  <ul className="list-disc list-inside space-y-1">
                    {stepErrors[currentStep]?.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 mt-8 border-t border-gray-200 pb-8">
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
              disabled={hasStepErrors}
              className="flex items-center gap-2 disabled:opacity-50"
            >
              Next
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
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
