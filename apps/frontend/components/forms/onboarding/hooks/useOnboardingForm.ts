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
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  const updateFormData = (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    // Clear step errors when user updates form data
    if (stepErrors[currentStep]) {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
    }
  };

  // Validation functions for each step
  const validateStep1 = (data: OnboardingFormData): string[] => {
    const errors: string[] = [];
    if (!data.userRole) {
      errors.push("Please select a role");
    }
    return errors;
  };

  const validateStep2 = (data: OnboardingFormData): string[] => {
    const errors: string[] = [];
    if (!data.name.trim()) {
      errors.push("Full name is required");
    }
    if (!data.gender) {
      errors.push("Please select your gender");
    }
    if (!data.location.trim()) {
      errors.push("Location is required");
    }
    if (!data.dateOfBirth) {
      errors.push("Date of birth is required");
    }
    return errors;
  };

  const validateStep3 = (
    data: OnboardingFormData,
    userRole: string
  ): string[] => {
    const errors: string[] = [];
    if (userRole === "explorer") {
      if (!data.fun.trim()) {
        errors.push("Please tell us what interests you most");
      }
    } else {
      if (!data.discipline) {
        errors.push("Please select a discipline");
      }
      if (!data.role.trim()) {
        errors.push("Please enter your role");
      }
    }
    return errors;
  };

  const validateStep4 = (data: OnboardingFormData): string[] => {
    // Step 4 is optional for project upload, so no validation needed
    return [];
  };

  const validateCurrentStep = (): boolean => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1:
        errors.push(...validateStep1(formData));
        break;
      case 2:
        errors.push(...validateStep2(formData));
        break;
      case 3:
        errors.push(...validateStep3(formData, formData.userRole));
        break;
      case 4:
        errors.push(...validateStep4(formData));
        break;
    }

    if (errors.length > 0) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: errors }));
      return false;
    } else {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
      return true;
    }
  };

  const nextStep = (maxSteps: number) => {
    if (currentStep < maxSteps) {
      // Validate current step before proceeding
      if (validateCurrentStep()) {
        setCurrentStep(currentStep + 1);
      }
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
    stepErrors,
    resetForm,
  };
};
