import { useState, useTransition, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useSession } from "next-auth/react";
import { OnboardingFormData } from "../types";
import { toast } from "sonner";

const STORAGE_KEY = "onboarding_form_data";

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

// Helper to serialize form data (excluding File objects)
const serializeFormData = (data: OnboardingFormData): string => {
  const serializable: Partial<Record<keyof OnboardingFormData, any>> = {};

  Object.keys(data).forEach((key) => {
    const typedKey = key as keyof OnboardingFormData;
    const value = data[typedKey];

    // Skip File objects and File arrays
    if (value instanceof File) {
      return; // Don't store File objects
    }
    if (Array.isArray(value) && value.length > 0 && value[0] instanceof File) {
      return; // Don't store File arrays
    }

    // Store everything else
    serializable[typedKey] = value;
  });

  return JSON.stringify(serializable);
};

// Helper to deserialize form data
const deserializeFormData = (
  json: string | null
): Partial<OnboardingFormData> => {
  if (!json) return {};

  try {
    const parsed = JSON.parse(json);
    return parsed as Partial<OnboardingFormData>;
  } catch (error) {
    console.error("Failed to deserialize form data:", error);
    return {};
  }
};

// Helper to map backend field errors to step errors
const mapBackendErrorsToSteps = (
  fieldErrors: Array<{
    path: (string | number)[];
    message: string;
    code?: string;
  }>,
  formData: OnboardingFormData
): Record<number, string[]> | undefined => {
  if (!fieldErrors || fieldErrors.length === 0) {
    return undefined;
  }

  const stepErrors: Record<number, string[]> = {};

  // Field to step mapping
  const fieldToStepMap: Record<string, number> = {
    name: 1,
    gender: 1,
    city: 1,
    country: 1,
    dateOfBirth: 1,
    profilePicture: 1,
    discipline: 2,
    role: 2,
    projectName: 3,
    projectDescription: 3,
    projectMedia: 3,
    coverImage: 3,
    projectLink: 3,
    dedicatedToPerson: 3,
    dedicatedToBrand: 3,
    dedicatedToCause: 3,
    dedicationReason: 3,
  };

  fieldErrors.forEach((error) => {
    // Get the first element of the path array (the field name)
    // Handle nested paths like ["projectMedia", 0] -> "projectMedia"
    const fieldPath =
      Array.isArray(error.path) && error.path.length > 0
        ? String(error.path[0])
        : "";

    if (!fieldPath) return;

    const step = fieldToStepMap[fieldPath];

    // If we can't map the field to a step, skip it
    if (!step) return;

    if (!stepErrors[step]) {
      stepErrors[step] = [];
    }

    // Use the error message from backend, or create a user-friendly one
    let errorMessage = error.message || "Invalid value";

    // Handle custom validation errors (like "all or nothing")
    if (
      error.code === "custom" &&
      error.message?.includes("If any project field is filled")
    ) {
      errorMessage =
        "If you start filling any project field, all required fields (cover image and title) must be completed";
    } else {
      // Map specific field errors to user-friendly messages
      switch (fieldPath) {
        case "name":
          if (
            errorMessage.includes("at least 2") ||
            errorMessage.includes("minimum")
          ) {
            errorMessage = "Name must be at least 2 characters";
          } else if (
            errorMessage.includes("required") ||
            errorMessage.includes("Required")
          ) {
            errorMessage = "Name is required";
          }
          break;
        case "gender":
          errorMessage = "Please select your gender";
          break;
        case "city":
          if (
            errorMessage.includes("at least 2") ||
            errorMessage.includes("minimum")
          ) {
            errorMessage = "City must be at least 2 characters";
          } else if (
            errorMessage.includes("required") ||
            errorMessage.includes("Required")
          ) {
            errorMessage = "City is required";
          }
          break;
        case "country":
          if (
            errorMessage.includes("at least 2") ||
            errorMessage.includes("minimum")
          ) {
            errorMessage = "Country must be at least 2 characters";
          } else if (
            errorMessage.includes("required") ||
            errorMessage.includes("Required")
          ) {
            errorMessage = "Country is required";
          }
          break;
        case "dateOfBirth":
          if (
            errorMessage.includes("13 years") ||
            errorMessage.includes("14 years")
          ) {
            errorMessage = "You must be at least 13 years old";
          } else if (
            errorMessage.includes("required") ||
            errorMessage.includes("Required")
          ) {
            errorMessage = "Date of birth is required";
          }
          break;
        case "discipline":
          errorMessage = "Discipline is required for creators";
          break;
        case "role":
          errorMessage = "Role is required for creators";
          break;
        case "profilePicture":
          if (errorMessage.includes("image") || errorMessage.includes("file")) {
            errorMessage =
              "Profile picture must be a valid image file (JPEG, PNG, WebP)";
          } else {
            errorMessage = "Profile picture is required";
          }
          break;
        case "projectName":
          if (
            errorMessage.includes("at least 3") ||
            errorMessage.includes("minimum")
          ) {
            errorMessage = "Project title must be at least 3 characters";
          } else if (
            errorMessage.includes("required") ||
            errorMessage.includes("Required")
          ) {
            errorMessage = "Project title is required";
          }
          break;
        case "coverImage":
          errorMessage = "Cover image is required when uploading a project";
          break;
        case "projectMedia":
          if (
            errorMessage.includes("image") ||
            errorMessage.includes("video") ||
            errorMessage.includes("file")
          ) {
            errorMessage = "Project media files must be valid images or videos";
          } else {
            errorMessage = "Project media is required";
          }
          break;
        case "projectDescription":
          if (
            errorMessage.includes("at least 10") ||
            errorMessage.includes("minimum")
          ) {
            errorMessage =
              "Project description must be at least 10 characters if provided";
          }
          break;
      }
    }

    // Avoid duplicate errors
    if (stepErrors[step] && !stepErrors[step]!.includes(errorMessage)) {
      stepErrors[step]!.push(errorMessage);
    }
    return stepErrors;
  });
};

export const useOnboardingFormWithURL = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, update: updateSession } = useSession();

  const currentStep = parseInt(searchParams.get("step") || "1", 10);

  // Load persisted form data on mount
  const loadPersistedData = useCallback((): OnboardingFormData => {
    if (typeof window === "undefined") return initialFormData;

    const persisted = localStorage.getItem(STORAGE_KEY);
    if (!persisted) return initialFormData;

    const persistedData = deserializeFormData(persisted);

    // Merge with initial data, keeping File objects as null (can't persist them)
    return {
      ...initialFormData,
      ...persistedData,
      profilePicture: null, // Files can't be persisted
      coverImage: null, // Files can't be persisted
      projectMedia: [], // File arrays can't be persisted
    };
  }, []);

  const [formData, setFormData] =
    useState<OnboardingFormData>(loadPersistedData);
  const [isSubmitting, isSubmittingTransition] = useTransition();
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [stepErrors, setStepErrors] = useState<Record<number, string[]>>({});

  // Persist form data to localStorage whenever it changes (debounced)
  useEffect(() => {
    if (typeof window === "undefined") return;

    const timeoutId = setTimeout(() => {
      try {
        const serialized = serializeFormData(formData);
        localStorage.setItem(STORAGE_KEY, serialized);
      } catch (error) {
        console.error("Failed to persist form data:", error);
      }
    }, 300); // Debounce by 300ms

    return () => clearTimeout(timeoutId);
  }, [formData]);

  // Load persisted data on mount
  useEffect(() => {
    const persisted = loadPersistedData();
    if (persisted !== initialFormData) {
      setFormData(persisted);
    }
  }, [loadPersistedData]);

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
      errors.push("Please select your style");
    }
    if (!data.role.trim()) {
      errors.push("Please select your artform");
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
      // Project description (caption) is optional - no validation needed
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

          // Parse backend field errors and map them to steps
          if (errorData?.fieldErrors && Array.isArray(errorData.fieldErrors)) {
            const mappedStepErrors = mapBackendErrorsToSteps(
              errorData.fieldErrors,
              formData
            );

            // Update step errors state
            setStepErrors((prev) => ({
              ...prev,
              ...mappedStepErrors,
            }));

            // Navigate to the first step with errors
            const errorSteps = mappedStepErrors
              ? Object.keys(mappedStepErrors)
                  .map(Number)
                  .sort((a, b) => a - b)
              : [];
            if (errorSteps.length > 0) {
              const firstErrorStep = errorSteps[0];
              if (firstErrorStep) {
                updateStep(firstErrorStep);
              }

              // Scroll to top to show errors
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }

          throw new Error(
            `Server error (${response.status}): ${errorMessage} [${errorCode}]`
          );
        }

        const result = await response.json();

        console.log("Onboarding submitted successfully:", result);

        // Clear persisted form data on successful submission
        if (typeof window !== "undefined") {
          localStorage.removeItem(STORAGE_KEY);
        }

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
            "If you start filling any project field, all required fields (cover image and title) must be completed";
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
    setStepErrors({});

    // Clear persisted form data
    if (typeof window !== "undefined") {
      localStorage.removeItem(STORAGE_KEY);
    }
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
