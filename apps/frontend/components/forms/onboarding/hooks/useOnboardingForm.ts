import { useState } from "react";
import { OnboardingFormData } from "../types";

const initialFormData: OnboardingFormData = {
  userRole: "",
  profilePicture: null,
  name: "",
  gender: "",
  location: "",
  socialMediaUrl: "",
  dateOfBirth: "",
  discipline: "",
  role: "",
  fun: "",
  projectName: "",
  projectDescription: "",
  projectCoverImage: null,
  projectLink: "",
};

export const useOnboardingForm = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const updateFormData = (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = (maxSteps: number) => {
    if (currentStep < maxSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture" | "projectCoverImage"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData(field, file);
    }
  };

  const submitOnboarding = async () => {
    setIsSubmitting(true);
    setSubmitError(null);

    try {
      // Create FormData for file uploads
      const formDataToSubmit = new FormData();

      // Add all form fields
      Object.entries(formData).forEach(([key, value]) => {
        if (value instanceof File) {
          formDataToSubmit.append(key, value);
        } else if (value !== null && value !== "") {
          formDataToSubmit.append(key, String(value));
        }
      });

      // Log out all the entries in the FormData
      for (const [key, value] of formDataToSubmit.entries()) {
        console.log("FormData entry:", key, value);
      }

      // Make API call to submit onboarding data
      const response = await fetch("/api/onboarding", {
        method: "POST",
        body: formDataToSubmit,
      });

      if (!response.ok) {
        throw new Error("Failed to submit onboarding data");
      }

      const result = await response.json();

      // Handle successful submission
      console.log("Onboarding submitted successfully:", result);

      // You can redirect or show success message here
      // For example: router.push("/dashboard");
    } catch (error) {
      console.error("Error submitting onboarding:", error);
      setSubmitError(
        error instanceof Error ? error.message : "An error occurred"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData(initialFormData);
    setCurrentStep(1);
    setSubmitError(null);
  };

  return {
    currentStep,
    formData,
    updateFormData,
    nextStep,
    prevStep,
    handleFileUpload,
    submitOnboarding,
    isSubmitting,
    submitError,
    resetForm,
  };
};
