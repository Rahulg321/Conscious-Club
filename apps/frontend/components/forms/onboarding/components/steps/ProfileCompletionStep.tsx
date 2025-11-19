import { Upload, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { GENDER_OPTIONS } from "../../config";
import { OnboardingFormData } from "../../types";
import CountryCityInput from "@/components/country-city-input";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/animate-ui/components/radix/radio-group";

interface ProfileCompletionStepProps {
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | File[] | null
  ) => void;
  handleFileUpload: (
    event: React.ChangeEvent<HTMLInputElement>,
    field: "profilePicture"
  ) => void;
}

export const ProfileCompletionStep = ({
  formData,
  updateFormData,
  handleFileUpload,
}: ProfileCompletionStepProps) => {
  return (
    <div className="space-y-5">
      <div className="flex items-center space-x-4">
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
      <div className="space-y-3 flex flex-col ">
        <Label>Gender</Label>
        <div className="flex gap-4 items-center ">
          <RadioGroup className="flex gap-2" value={formData.gender}>
            {GENDER_OPTIONS.map((option) => (
              <Label className="flex items-center gap-x-3" key={option.value}>
                <RadioGroupItem
                  className="text-indigo-200 focus:ring-indigo-400 focus:ring-1"
                  value={option.value}
                  checked={formData.gender === option.value}
                  onClick={(e) =>
                    updateFormData("gender", e.currentTarget.value)
                  }
                />
                {option.label}
              </Label>
            ))}
          </RadioGroup>
        </div>
      </div>

      <CountryCityInput
        countryValue={formData.country}
        cityValue={formData.city}
        onCountryChange={(value) => updateFormData("country", value)}
        onCityChange={(value) => updateFormData("city", value)}
        placeholder="Enter city and country (e.g., Paris, France)"
        id="city-country"
      />

      <div className="flex justify-between gap-4">
        <div className="w-full">
          <Label htmlFor="dateOfBirth" className="mb-2">
            Date of Birth
          </Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={formData.dateOfBirth}
            onChange={(e) => updateFormData("dateOfBirth", e.target.value)}
            max={(() => {
              const today = new Date();
              const maxDate = new Date(
                today.getFullYear() - 13,
                today.getMonth(),
                today.getDate()
              );
              return maxDate.toISOString().split("T")[0];
            })()}
            className="w-full"
          />
          <p className="text-xs text-muted-foreground">
            You must be at least 13 years old
          </p>
        </div>

        <div className="space-y-2 w-full">
          <Label htmlFor="socialMediaUrl">Social Media URL (Optional)</Label>
          <Input
            id="socialMediaUrl"
            value={formData.socialMediaUrl}
            onChange={(e) => updateFormData("socialMediaUrl", e.target.value)}
            placeholder="https://linkedin.com/in/yourprofile"
          />
        </div>
      </div>
    </div>
  );
};
