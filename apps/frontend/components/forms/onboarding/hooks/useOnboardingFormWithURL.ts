import { useState, useTransition, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { OnboardingFormData } from "../types";
import { toast } from "sonner";

const initialFormData: OnboardingFormData = {
  userRole: "creator",
  profilePicture: null,
  name: "",
  gender: "",
  city: "",
  country: "",
  socialMediaUrl: "",
  dateOfBirth: "",
  discipline: "",
  role: "",
  fun: "",
  projectName: "",
  projectDescription: "",
  projectMedia: [],
  projectLink: "",
  coverImage: null,
  dedicatedToPerson: "",
  dedicatedToBrand: "",
  dedicatedToCause: "",
  dedicationReason: "",
};

export const useOnboardingFormWithURL = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update: updateSession } = useSession();

  const currentStep = parseInt(searchParams.get("step") || "1", 10);
  const [formData, setFormData] = useState<OnboardingFormData>(initialFormData);
  const [isSubmitting, isSubmittingTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  // Update URL when step changes
  const updateStep = (newStep: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("step", newStep.toString());
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  const updateFormData = (
    field: keyof OnboardingFormData,
    value: string | boolean | File | File[] | null
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
    if (!data.name.trim()) {
      errors.push("Full name is required");
    }
    if (!data.gender) {
      errors.push("Please select your gender");
    }
    if (!data.city.trim()) {
      errors.push("City is required");
    }
    if (!data.country.trim()) {
      errors.push("Country is required");
    }
    if (!data.dateOfBirth) {
      errors.push("Date of birth is required");
    } else {
      // Check if user is at least 14 years old
      const birthDate = new Date(data.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      const dayDiff = today.getDate() - birthDate.getDate();

      // Calculate actual age considering month and day
      const actualAge =
        monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;

      if (actualAge < 14) {
        errors.push("You must be at least 14 years old to use this platform");
      }
    }
    return errors;
  };

  const validateStep2 = (data: OnboardingFormData): string[] => {
    const errors: string[] = [];
    if (!data.discipline) {
      errors.push("Please select a discipline");
    }
    if (!data.role.trim()) {
      errors.push("Please enter your role");
    }
    return errors;
  };

  const validateStep3 = (data: OnboardingFormData): string[] => {
    console.log("validating step 3", data);

    const errors: string[] = [];

    // Check if any project field is filled
    const hasAnyProjectField =
      data.coverImage !== null ||
      (data.projectMedia && data.projectMedia.length > 0) ||
      (data.projectName && data.projectName.trim() !== "") ||
      (data.projectDescription && data.projectDescription.trim() !== "") ||
      (data.projectLink && data.projectLink.trim() !== "") ||
      (data.dedicatedToPerson && data.dedicatedToPerson.trim() !== "") ||
      (data.dedicatedToBrand && data.dedicatedToBrand.trim() !== "") ||
      (data.dedicatedToCause && data.dedicatedToCause.trim() !== "") ||
      (data.dedicationReason && data.dedicationReason.trim() !== "");

    // If any project field is filled, require all required fields
    if (hasAnyProjectField) {
      if (!data.coverImage) {
        errors.push("Cover image is required when uploading a project");
      }
      if (!data.projectName || data.projectName.trim() === "") {
        errors.push("Project title is required when uploading a project");
      } else if (data.projectName.trim().length < 3) {
        errors.push("Project title must be at least 3 characters");
      }
      if (!data.projectDescription || data.projectDescription.trim() === "") {
        errors.push("Project caption is required when uploading a project");
      } else if (data.projectDescription.trim().length < 10) {
        errors.push("Project caption must be at least 10 characters");
      }
    }

    return errors;
  };

  const validateCurrentStep = (): { isValid: boolean; errors: string[] } => {
    const errors: string[] = [];

    switch (currentStep) {
      case 1:
        errors.push(...validateStep1(formData));
        break;
      case 2:
        errors.push(...validateStep2(formData));
        break;
      case 3:
        errors.push(...validateStep3(formData));
        break;
    }

    if (errors.length > 0) {
      setStepErrors((prev) => ({ ...prev, [currentStep]: errors }));
      return { isValid: false, errors };
    } else {
      setStepErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[currentStep];
        return newErrors;
      });
      return { isValid: true, errors: [] };
    }
  };

  const nextStep = (maxSteps: number) => {
    if (currentStep < maxSteps) {
      // Validate current step before proceeding
      const validation = validateCurrentStep();
      if (validation.isValid) {
        updateStep(currentStep + 1);
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      updateStep(currentStep - 1);
    }
  };

  const handleFileUpload = (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture"
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData(field, file);
    }
  };

  const submitOnboarding = async () => {
    isSubmittingTransition(async () => {
      setSubmitError(null);

      // Validate current step before submitting
      const validation = validateCurrentStep();
      if (!validation.isValid) {
        console.log(
          "❌ [FRONTEND] Validation failed, cannot submit",
          validation.errors
        );
        if (validation.errors.length > 0) {
          toast.error("Please fix the errors before submitting", {
            description: validation.errors.join(", "),
          });
        }
        return;
      }

      try {
        // Create FormData for file uploads
        const formDataToSubmit = new FormData();

        // Add all form fields
        Object.entries(formData).forEach(([key, value]) => {
          if (value instanceof File) {
            formDataToSubmit.append(key, value);
          } else if (Array.isArray(value) && key === "projectMedia") {
            // Handle projectMedia array
            value.forEach((file) => {
              if (file instanceof File) {
                formDataToSubmit.append("projectMedia", file);
              }
            });
          } else if (key === "coverImage" && value instanceof File) {
            // Handle coverImage file
            formDataToSubmit.append("coverImage", value);
          } else if (value !== null && value !== "" && !Array.isArray(value)) {
            formDataToSubmit.append(key, String(value));
          }
        });

        // Log out all the entries in the FormData
        for (const [key, value] of formDataToSubmit.entries()) {
          console.log("FormData entry:", key, value);
        }

        // Make API call to submit onboarding data
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_SERVER_URL}/onboarding`,
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${session?.user?.accessToken}`,
            },
            body: formDataToSubmit,
          }
        ).catch((networkError) => {
          console.error("❌ [FRONTEND] Network error:", networkError);
          throw new Error(
            "Network error: Unable to connect to server. Please check your internet connection."
          );
        });

        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
            console.error(
              "❌ [FRONTEND] Error response from server:",
              errorData
            );
          } catch (parseError) {
            console.error(
              "❌ [FRONTEND] Failed to parse error response:",
              parseError
            );
            errorData = { error: "Unknown error occurred" };
          }

          const errorMessage =
            errorData?.details ||
            errorData?.error ||
            "Failed to submit onboarding data";
          const errorCode = errorData?.code || "UNKNOWN_ERROR";

          throw new Error(
            `Server error (${response.status}): ${errorMessage} [${errorCode}]`
          );
        }

        const result = await response.json();

        console.log("Onboarding submitted successfully:", result);
        toast.success("Successfully completed onboarding!", {
          description: "Redirecting to dashboard...",
          className: "bg-green-500 text-white",
        });

        // Update session and redirect immediately
        try {
          console.log("🔄 Updating session...");
          await updateSession();
          console.log("✅ Session updated, redirecting to dashboard...");

          // Use replace instead of push to prevent back navigation
          router.replace("/dashboard");
        } catch (sessionError) {
          console.error(
            "Session update failed, but continuing with redirect:",
            sessionError
          );
          router.replace("/dashboard");
        }
      } catch (error) {
        console.error("Error submitting onboarding:", error);

        // Extract error message and code from the error
        const errorMessage =
          error instanceof Error ? error.message : "An error occurred";
        const errorCode = errorMessage.includes("[")
          ? errorMessage.split("[")[1]?.replace("]", "")
          : "UNKNOWN_ERROR";

        // Determine user-friendly error message based on error code
        let userFriendlyMessage = "Error submitting form";
        let userFriendlyDescription = "Please try again later";

        if (errorCode === "VALIDATION_ERROR") {
          userFriendlyMessage = "Validation Error";
          userFriendlyDescription = "Please check your form data and try again";
        } else if (errorCode === "ALL_OR_NOTHING_VALIDATION_ERROR") {
          userFriendlyMessage = "Incomplete Project Data";
          userFriendlyDescription =
            "If you start filling any project field, all required fields (cover image, title, and caption) must be completed";
        } else if (errorCode === "AUTH_ERROR") {
          userFriendlyMessage = "Authentication Error";
          userFriendlyDescription = "Please log in again and try again";
        } else if (
          errorCode === "PROFILE_PICTURE_UPLOAD_FAILED" ||
          errorCode === "PROFILE_PICTURE_UPLOAD_ERROR"
        ) {
          userFriendlyMessage = "Profile Picture Upload Failed";
          userFriendlyDescription =
            "Please try uploading your profile picture again";
        } else if (errorCode === "PROJECT_MEDIA_UPLOAD_ERROR") {
          userFriendlyMessage = "Project Media Upload Failed";
          userFriendlyDescription =
            "Please try uploading your project media again";
        } else if (errorCode === "USER_UPDATE_ERROR") {
          userFriendlyMessage = "Profile Update Failed";
          userFriendlyDescription = "Please try again or contact support";
        } else if (errorCode === "PROJECT_CREATION_ERROR") {
          userFriendlyMessage = "Project Creation Failed";
          userFriendlyDescription =
            "Your profile was updated but project creation failed";
        } else if (errorCode === "INTERNAL_ERROR") {
          userFriendlyMessage = "Server Error";
          userFriendlyDescription =
            "Something went wrong on our end. Please try again";
        } else if (errorMessage.includes("Network error")) {
          userFriendlyMessage = "Connection Error";
          userFriendlyDescription =
            "Unable to connect to server. Please check your internet connection and try again";
        }

        toast.error(userFriendlyMessage, {
          description: userFriendlyDescription,
        });

        setSubmitError(errorMessage);
      }
    });
  };

  const resetForm = () => {
    setFormData(initialFormData);
    updateStep(1);
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
