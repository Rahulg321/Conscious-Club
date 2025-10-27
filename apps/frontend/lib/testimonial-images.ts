import { UserRole } from "@/components/forms/onboarding/types";

export const TESTIMONIAL_IMAGES: Record<UserRole, string> = {
  creator: "/onboarding/CC_Onboarding_Creator.png",
};

export const getTestimonialImage = (
  userRole: UserRole,
  step: number
): string => {
  // Since we removed role selection step, all steps now show creator testimonial
  return TESTIMONIAL_IMAGES[userRole];
};
