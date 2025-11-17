"use client";

import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useOnboardingContext } from "./onboarding/context/OnboardingContext";
import { getStepsForRole } from "./onboarding/config";
import { StepHeader } from "./onboarding/components/StepHeader";
import { ProgressIndicator } from "./onboarding/components/ProgressIndicator";
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
        <ProgressIndicator
          // steps={steps}
          currentStep={currentStep}
        />
        <StepHeader step={currentStepData} />
        <Separator />
      </div>

      <div className="px-4 md:px-8 lg:px-12 py-2 pb-8">
        <div className="space-y-2">
          {currentStep === 1 && (
            <ProfileCompletionStep
              formData={formData}
              updateFormData={updateFormData}
              handleFileUpload={handleFileUpload}
            />
          )}

          {currentStep === 2 && (
            <DisciplineRoleStep
              formData={formData}
              updateFormData={updateFormData}
            />
          )}

          {currentStep === 3 && (
            <ProjectUploadStep
              submitOnboarding={submitOnboarding}
              isSubmitting={isSubmitting}
              formData={formData}
              updateFormData={updateFormData}
            />
          )}
        </div>

        <div className="mt-4 space-y-4">
          {/* Submit error display - shows general errors */}
          {submitError && (
            <div className="rounded-md bg-red-50 border border-red-200 p-4">
              <div className="flex items-start">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3 flex-1">
                  <h3 className="text-sm font-medium text-red-800">
                    Submission Error
                  </h3>
                  <div className="mt-2 text-sm text-red-700">
                    <p>{submitError}</p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step validation errors - shows field-specific errors */}
          {stepErrors[currentStep] &&
            (stepErrors[currentStep]?.length ?? 0) > 0 && (
              <div className="rounded-md bg-red-50 border border-red-200 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <svg
                      className="h-5 w-5 text-red-400"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="ml-3 flex-1">
                    <h3 className="text-sm font-medium text-red-800 mb-2">
                      Please fix the following issues:
                    </h3>
                    <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                      {stepErrors[currentStep]?.map((error, index) => (
                        <li key={index}>{error}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
        </div>

        {/* Navigation buttons */}
        <div className="flex items-center justify-between pt-6 mt-2 border-t border-gray-200">
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
              className="flex items-center gap-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
            >
              Next
              {currentStep < steps.length && (
                <ChevronRight className="h-5 w-5" />
              )}
            </Button>
          ) : (
            <Button
              onClick={submitOnboarding}
              disabled={isSubmitting}
              className="bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50"
            >
              {isSubmitting ? "Saving..." : "Save"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
