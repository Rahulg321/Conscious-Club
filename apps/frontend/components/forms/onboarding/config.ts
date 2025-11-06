import { OnboardingStep, UserRole } from "./types";
import { type FilterFieldConfig } from "@/components/ui/filters";

export const getStepsForRole = (userRole: UserRole): OnboardingStep[] => {
  return [
    {
      id: 1,
      title: "Complete your profile",
      description: "Tell us about yourself",
    },
    {
      id: 2,
      title: "Define your craft",
      description: "Pick the main discipline that best represents your work",
    },
    {
      id: 3,
      title: "Add your first creation",
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

export type DisciplineType =
  | "Digital"
  | "Visuals"
  | "Writing"
  | "Performance"
  | "Motion";
export const disciplineColor: Record<
  DisciplineType,
  { color: string; border: string; text: string }
> = {
  Digital: {
    color: "bg-blue-300",
    border: "border-blue-300",
    text: "text-blue-500",
  },
  Visuals: {
    color: "bg-[#cdff98]",
    border: "border-[#cdff98]",
    text: "text-[#42354a]",
  },
  Writing: {
    color: "bg-yellow-200",
    border: "border-yellow-400",
    text: "text-yellow-600",
  },
  Performance: {
    color: "bg-orange-200",
    border: "border-orange-200",
    text: "text-orange-500",
  },
  Motion: {
    color: "bg-purple-300",
    border: "border-purple-300",
    text: "text-purple-500",
  },
};

export const DISCIPLINE_TO_ROLES: Record<string, string[]> = {
  Visuals: ["Art & Mixed Media", "Illustration & Graphics", "Photography"],
  Motion: ["Reels", "Vlogging", "Animation", "Filmmaking"],
  Writing: ["Copywriting", "Blogging", "Storytelling"],
  Performance: [
    "Dance",
    "Music & Singing",
    "Spoken Word",
    "Theatre",
    "Fitness",
    "Culinary Arts",
  ],
  Digital: ["AI Art & Generative Content", "Creative Coding", "3D Modelling"],
};

export const GENDER_OPTIONS = [
  { value: "male", label: "Male" },
  { value: "female", label: "Female" },
  { value: "non-binary", label: "Non-binary" },
  { value: "other", label: "Other" },
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

export const fields: FilterFieldConfig[] = [
  {
    group: "Tags",
    fields: [
      {
        key: "visuals",
        label: "Visuals",
        icon: "🎨",
        type: "multiselect",
        searchable: false,
        className: "w-[200px]",
        options: [
          {
            value: "Art & Mixed Media",
            label: "Art & Mixed Media",
            icon: "",
          },
          {
            value: "Illustration & Graphics",
            label: "Illustration & Graphics",
            icon: "",
          },
          {
            value: "Photography",
            label: "Photography",
            icon: "",
          },
        ],
      },
      {
        key: "motion",
        label: "Motion",
        icon: "🎬",
        type: "multiselect",
        searchable: false,
        className: "w-[200px]",
        options: [
          {
            value: "Reels",
            label: "Reels",
            icon: "",
          },
          {
            value: "Vlogging",
            label: "Vlogging",
            icon: "",
          },
          {
            value: "Animation",
            label: "Animation",
            icon: "",
          },
          {
            value: "Filmmaking",
            label: "Filmmaking",
            icon: "",
          },
        ],
      },
      {
        key: "writing",
        label: "Writing",
        icon: "📝",
        type: "multiselect",
        searchable: false,
        className: "w-[200px]",
        options: [
          {
            value: "Copywriting",
            label: "Copywriting",
            icon: "",
          },
          {
            value: "Blogging",
            label: "Blogging",
            icon: "",
          },
          {
            value: "Storytelling",
            label: "Storytelling",
            icon: "",
          },
        ],
      },
      {
        key: "performance",
        label: "Performance",
        icon: "🎭",
        type: "multiselect",
        searchable: false,
        className: "w-[200px]",
        options: [
          {
            value: "Dance",
            label: "Dance",
            icon: "",
          },
          {
            value: "Music & Singing",
            label: "Music & Singing",
            icon: "",
          },
          {
            value: "Spoken Word",
            label: "Spoken Word",
            icon: "",
          },
          {
            value: "Theatre",
            label: "Theatre",
            icon: "",
          },
          {
            value: "Fitness",
            label: "Fitness",
            icon: "",
          },
          {
            value: "Culinary Arts",
            label: "Culinary Arts",
            icon: "",
          },
        ],
      },
      {
        key: "digital",
        label: "Digital",
        icon: "💻",
        type: "multiselect",
        searchable: false,
        className: "w-[200px]",
        options: [
          {
            value: "AI Art & Generative Content",
            label: "AI Art & Generative Content",
            icon: "",
          },
          {
            value: "Creative Coding",
            label: "Creative Coding",
            icon: "",
          },
          {
            value: "3D Modelling",
            label: "3D Modelling",
            icon: "",
          },
        ],
      },
    ],
  },
];

export const filterMaping = [
  { name: "visuals", value: "Art & Mixed Media" },
  { name: "visuals", value: "Illustration & Graphics" },
  { name: "visuals", value: "Photography" },
  { name: "motion", value: "Reels" },
  { name: "motion", value: "Vlogging" },
  { name: "motion", value: "Animation" },
  { name: "motion", value: "Filmmaking" },
  { name: "writing", value: "Copywriting" },
  { name: "writing", value: "Blogging" },
  { name: "writing", value: "Storytelling" },
  { name: "performance", value: "Dance" },
  { name: "performance", value: "Music & Singing" },
  { name: "performance", value: "Spoken Word" },
  { name: "performance", value: "Theatre" },
  { name: "performance", value: "Fitness" },
  { name: "performance", value: "Culinary Arts" },
  { name: "digital", value: "AI Art & Generative Content" },
  { name: "digital", value: "Creative Coding" },
  { name: "digital", value: "3D Modelling" },
];
