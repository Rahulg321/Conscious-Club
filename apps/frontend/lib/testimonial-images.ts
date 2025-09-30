import { UserRole } from "@/components/forms/onboarding/types";

export const TESTIMONIAL_IMAGES: Record<UserRole, string> = {
  explorer: "/onboarding/CC_Onboarding_Explorer.png",
  creator: "/onboarding/CC_Onboarding_Creator.png",
  organizer: "/onboarding/CC_Onboarding_Organiser.png",
};

export const getTestimonialImage = (
  userRole: UserRole,
  step: number
): string => {
  if (!userRole || step === 1) {
    return "/onboarding/CC_Onboarding_Register.png"; // Default image
  }
  return TESTIMONIAL_IMAGES[userRole];
};
