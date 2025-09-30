"use client";

import React, { createContext, useContext } from "react";
import { useOnboardingFormWithURL } from "../hooks/useOnboardingFormWithURL";

import { OnboardingFormData } from "../types";

interface OnboardingContextType {
  currentStep: number;
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => void;
  nextStep: (maxSteps: number) => void;
  prevStep: () => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture" | "projectCoverImage"
  ) => void;
  submitOnboarding: () => void;
  isSubmitting: boolean;
  submitError: string | null;
  stepErrors: Record<number, string[]>;
  resetForm: () => void;
}

const OnboardingContext = createContext<OnboardingContextType | undefined>(
  undefined
);

export const OnboardingProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const onboardingData = useOnboardingFormWithURL();

  return (
    <OnboardingContext.Provider value={onboardingData}>
      {children}
    </OnboardingContext.Provider>
  );
};

export const useOnboardingContext = () => {
  const context = useContext(OnboardingContext);
  if (context === undefined) {
    throw new Error(
      "useOnboardingContext must be used within an OnboardingProvider"
    );
  }
  return context;
};
