import { Upload, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GENDER_OPTIONS } from "../../config";
import { OnboardingFormData } from "../../types";

interface ProfileCompletionStepProps {
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture" | "projectCoverImage"
  ) => void;
}

export const ProfileCompletionStep = ({
  formData,
  updateFormData,
  handleFileUpload,
}: ProfileCompletionStepProps) => {
  return (
    <div className="space-y-6">
      {/* Profile Picture Upload */}
      <div className="flex flex-col items-center space-y-4">
        <div className="relative">
          <div className="h-24 w-24 rounded-full border-4 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {formData.profilePicture ? (
              <img
                src={URL.createObjectURL(formData.profilePicture)}
                alt="Profile preview"
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}
          </div>
          <label
            htmlFor="profilePicture"
            className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors"
          >
            <Upload className="h-4 w-4" />
            <input
              id="profilePicture"
              type="file"
              accept="image/*"
              onChange={(e) => handleFileUpload(e, "profilePicture")}
              className="hidden"
            />
          </label>
        </div>
        <p className="text-sm text-muted-foreground text-center">
          Click the upload button to add your profile picture
        </p>
      </div>

      {/* Name Field */}
      <div className="space-y-2">
        <Label htmlFor="name">Full Name</Label>
        <Input
          id="name"
          value={formData.name}
          onChange={(e) => updateFormData("name", e.target.value)}
          placeholder="Enter your full name"
        />
      </div>

      {/* Gender Selection */}
      <div className="space-y-3">
        <Label>Gender</Label>
        <div className="space-y-2">
          {GENDER_OPTIONS.map((option) => (
            <label key={option.value} className="flex items-center space-x-2">
              <input
                type="radio"
                name="gender"
                value={option.value}
                checked={formData.gender === option.value}
                onChange={(e) => updateFormData("gender", e.target.value)}
                className="text-indigo-600 focus:ring-indigo-500"
              />
              <span className="text-sm">{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Location Field */}
      <div className="space-y-2">
        <Label htmlFor="location">Location</Label>
        <Input
          id="location"
          value={formData.location}
          onChange={(e) => updateFormData("location", e.target.value)}
          placeholder="Enter your location (city, country)"
        />
      </div>

      {/* Social Media URL Field */}
      <div className="space-y-2">
        <Label htmlFor="socialMediaUrl">Social Media URL (Optional)</Label>
        <Input
          id="socialMediaUrl"
          value={formData.socialMediaUrl}
          onChange={(e) => updateFormData("socialMediaUrl", e.target.value)}
          placeholder="https://linkedin.com/in/yourprofile"
        />
      </div>

      {/* Date of Birth */}
      <div className="space-y-2">
        <Label htmlFor="dateOfBirth">Date of Birth</Label>
        <Input
          id="dateOfBirth"
          type="date"
          value={formData.dateOfBirth}
          onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
          className="w-full"
        />
      </div>
    </div>
  );
};
