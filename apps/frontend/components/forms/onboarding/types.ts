export interface OnboardingFormData {
  userRole: string;
  profilePicture: File | null;
  name: string;
  gender: string;
  city: string;
  country: string;
  socialMediaUrl: string;
  dateOfBirth: string;
  discipline: string;
  role: string;
  fun: string;
  projectName: string;
  projectDescription: string;
  projectMedia: File[];
  projectLink: string;
  coverImage: File | null;
  dedicatedToPerson: string;
  dedicatedToBrand: string;
  dedicatedToCause: string;
  dedicationReason: string;
}

export interface OnboardingStep {
  id: number;
  title: string;
  description: string;
}

export type UserRole = "creator";

// Type definitions for getFilteredUserProfiles
export type UserProfile = {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  bannerImage: string | null;
  type: "creator" | null;
  city: string | null;
  country: string | null;
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
