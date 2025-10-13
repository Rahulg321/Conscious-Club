export interface OnboardingFormData {
  userRole: string;
  profilePicture: File | null;
  name: string;
  gender: string;
  location: string;
  socialMediaUrl: string;
  dateOfBirth: string;
  discipline: string;
  role: string;
  fun: string;
  projectName: string;
  projectDescription: string;
  projectCoverImage: File | null;
  projectLink: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

export type UserRole = "explorer" | "creator";

// Type definitions for getFilteredUserProfiles
export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bannerImage: string | null;
  type: "explorer" | "creator" | null;
  location: string | null;
  discipline: string | null;
  role: string | null;
  createdAt: Date;
  projects: ProjectProfile[];
  followersCount?: number;
  followingCount?: number;
  isFollowing?: boolean;
};

export type ProjectProfile = {
  id: string;
  name: string;
  link: string;
  description: string;
  media: string[];
  logoImage: string | null;
  createdAt: Date;
};
