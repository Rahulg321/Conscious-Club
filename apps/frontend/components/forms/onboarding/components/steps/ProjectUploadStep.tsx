import { Upload } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormData } from "../../types";

interface ProjectUploadStepProps {
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

export const ProjectUploadStep = ({
  formData,
  updateFormData,
  handleFileUpload,
}: ProjectUploadStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <p className="text-sm text-muted-foreground mb-6">
          This step is optional. You can skip it and add projects later from
          your profile.
        </p>
      </div>

      {/* Project Name */}
      <div className="space-y-2">
        <Label htmlFor="projectName">Project Name</Label>
        <Input
          id="projectName"
          value={formData.projectName}
          onChange={(e) => updateFormData("projectName", e.target.value)}
          placeholder="Enter your project name"
        />
      </div>

      {/* Project Description */}
      <div className="space-y-2">
        <Label htmlFor="projectDescription">Project Description</Label>
        <textarea
          id="projectDescription"
          value={formData.projectDescription}
          onChange={(e) => updateFormData("projectDescription", e.target.value)}
          placeholder="Describe your project, what it does, and what makes it special..."
          rows={4}
          className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        />
      </div>

      {/* Project Cover Image Upload */}
      <div className="space-y-4">
        <Label>Project Cover Image</Label>
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <div className="h-32 w-full max-w-xs rounded-lg border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
              {formData.projectCoverImage ? (
                <img
                  src={URL.createObjectURL(formData.projectCoverImage)}
                  alt="Project cover preview"
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="text-center">
                  <Upload className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">No image selected</p>
                </div>
              )}
            </div>
            <label
              htmlFor="projectCoverImage"
              className="absolute -bottom-2 -right-2 bg-indigo-600 text-white rounded-full p-2 cursor-pointer hover:bg-indigo-700 transition-colors"
            >
              <Upload className="h-4 w-4" />
              <input
                id="projectCoverImage"
                type="file"
                accept="image/*"
                onChange={(e) => handleFileUpload(e, "projectCoverImage")}
                className="hidden"
              />
            </label>
          </div>
          <p className="text-sm text-muted-foreground text-center">
            Click the upload button to add a cover image for your project
          </p>
        </div>
      </div>

      {/* Project Link */}
      <div className="space-y-2">
        <Label htmlFor="projectLink">Project Link (Optional)</Label>
        <Input
          id="projectLink"
          value={formData.projectLink}
          onChange={(e) => updateFormData("projectLink", e.target.value)}
          placeholder="https://your-project.com or https://github.com/username/project"
        />
        <p className="text-sm text-muted-foreground">
          Add a link to your project website, GitHub repository, or demo
        </p>
      </div>
    </div>
  );
};
