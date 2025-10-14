import { OnboardingStep, UserRole } from "./types";

export const getStepsForRole = (userRole: UserRole): OnboardingStep[] => {
  if (userRole === "explorer") {
    return [
      {
        id: 1,
        title: "Tell us who you are",
        description: "Choose your role in our community",
      },
      {
        id: 2,
        title: "Complete Your Profile",
        description: "Tell us about yourself",
      },
      {
        id: 3,
        title: "Choose your fun",
        description: "What interests you most?",
      },
    ];
  } else {
    return [
      {
        id: 1,
        title: "Tell us who you are",
        description: "Choose your role in our community",
      },
      {
        id: 2,
        title: "Complete Your Profile",
        description: "Tell us about yourself",
      },
      {
        id: 3,
        title: "Choose your role",
        description: "Pick the main discipline that best represents your work",
      },
      {
        id: 4,
        title: "Add Creation",
        description: "Bring your magic to the playground⭐️",
      },
    ];
  }
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
    value: "explorer" as UserRole,
    title: "Explorer",
    description:
      "Discover new experiences, events, and opportunities in our community",
  },
  {
    value: "creator" as UserRole,
    title: "Creator",
    description:
      "Share your content, projects, and creative work with the community",
  },
] as const;
