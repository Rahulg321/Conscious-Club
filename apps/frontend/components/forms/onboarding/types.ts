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

export type UserRole = "explorer" | "creator" | "organizer";
