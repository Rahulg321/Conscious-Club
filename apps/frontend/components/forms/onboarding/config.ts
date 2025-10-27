import { OnboardingStep, UserRole } from "./types";

export const getStepsForRole = (userRole: UserRole): OnboardingStep[] => {
  return [
    {
      id: 1,
      title: "Complete Your Profile",
      description: "Tell us about yourself",
    },
    {
      id: 2,
      title: "Choose your role",
      description: "Pick the main discipline that best represents your work",
    },
    {
      id: 3,
      title: "Add Creation",
      description: "Bring your magic to the playground⭐️",
    },
  ];
};

export const DISCIPLINES = [
  "Visuals",
  "Motion",
  "Writing",
  "Performance",
  "Digital",
] as const;

export const DISCIPLINE_TO_ROLES: Record<string, string[]> = {
  Visuals: ["Art & Mixed Media", "Illustration & Design", "Photography"],
  Motion: ["Reels", "Vlogging", "Animation"],
  Writing: ["Copywriting", "Blogging", "Storytelling"],
  Performance: ["Dance", "Music", "Verbal Art", "Theatre", "Fitness"],
  Digital: ["AI Art & Generative Content", "Creative Coding", "3D Modelling"],
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "prefer-not-to-say", label: "Prefer not to say" },
] as const;

export const USER_ROLES = [
  {
    value: "creator" as UserRole,
    title: "Creator",
    description:
      "Share your content, projects, and creative work with the community",
  },
] as const;
