"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Check, Upload, User } from "lucide-react";

const getStepsForRole = (userRole: string) => {
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
        title: "Upload Project (Optional)",
        description: "Share a project to showcase your work",
      },
    ];
  }
};

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    userRole: "",
    profilePicture: null as File | null,
    name: "",
    gender: "",
    location: "",
    socialMediaUrl: "",
    dateOfBirth: "",
    discipline: "",
    role: "",
    fun: "",
    projectName: "",
    projectDescription: "",
    projectCoverImage: null as File | null,
    projectLink: "",
  });

  const updateFormData = (
    field: string,
    value: string | boolean | File | null
  ) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData("profilePicture", file);
    }
  };

  const handleProjectCoverUpload = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      updateFormData("projectCoverImage", file);
    }
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const steps = getStepsForRole(formData.userRole);
  const currentStepData = steps.find((step) => step.id === currentStep);

  return (
    <div className="space-y-6">
      {/* Header with progress */}
      <div className="text-center">
        <h1 className="text-balance text-2xl font-semibold tracking-tight">
          {currentStepData?.title}
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          {currentStepData?.description}
        </p>
      </div>

      {/* Progress indicator */}
      <div className="flex items-center justify-center gap-2">
        {steps.map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium ${
                step.id < currentStep
                  ? "bg-indigo-600 text-white"
                  : step.id === currentStep
                    ? "bg-indigo-600 text-white"
                    : "bg-gray-200 text-gray-600"
              }`}
            >
              {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
            </div>
            {index < steps.length - 1 && (
              <div
                className={`h-0.5 w-8 ${step.id < currentStep ? "bg-indigo-600" : "bg-gray-200"}`}
              />
            )}
          </div>
        ))}
      </div>

      <Separator />

      {/* Step content */}
      <div className="space-y-4">
        {currentStep === 1 && (
          <div className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-4">Choose your role</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Select the role that best describes you in our community
              </p>
            </div>

            <div className="grid gap-4">
              {/* Explorer Option */}
              <label className="relative">
                <input
                  type="radio"
                  name="userRole"
                  value="explorer"
                  checked={formData.userRole === "explorer"}
                  onChange={(e) => updateFormData("userRole", e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userRole === "explorer"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.userRole === "explorer"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.userRole === "explorer" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Explorer</h4>
                      <p className="text-sm text-muted-foreground">
                        Discover new experiences, events, and opportunities in
                        our community
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              {/* Creator Option */}
              <label className="relative">
                <input
                  type="radio"
                  name="userRole"
                  value="creator"
                  checked={formData.userRole === "creator"}
                  onChange={(e) => updateFormData("userRole", e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userRole === "creator"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.userRole === "creator"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.userRole === "creator" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Creator</h4>
                      <p className="text-sm text-muted-foreground">
                        Share your content, projects, and creative work with the
                        community
                      </p>
                    </div>
                  </div>
                </div>
              </label>

              {/* Organizer Option */}
              <label className="relative">
                <input
                  type="radio"
                  name="userRole"
                  value="organizer"
                  checked={formData.userRole === "organizer"}
                  onChange={(e) => updateFormData("userRole", e.target.value)}
                  className="sr-only"
                />
                <div
                  className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                    formData.userRole === "organizer"
                      ? "border-indigo-600 bg-indigo-50"
                      : "border-gray-200 hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    <div
                      className={`w-4 h-4 rounded-full border-2 ${
                        formData.userRole === "organizer"
                          ? "border-indigo-600 bg-indigo-600"
                          : "border-gray-300"
                      }`}
                    >
                      {formData.userRole === "organizer" && (
                        <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                      )}
                    </div>
                    <div>
                      <h4 className="font-medium text-lg">Organizer</h4>
                      <p className="text-sm text-muted-foreground">
                        Plan and host events, workshops, and community
                        activities
                      </p>
                    </div>
                  </div>
                </div>
              </label>
            </div>
          </div>
        )}

        {currentStep === 2 && (
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
                    onChange={handleFileUpload}
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
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="male"
                    checked={formData.gender === "male"}
                    onChange={(e) => updateFormData("gender", e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Male</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="female"
                    checked={formData.gender === "female"}
                    onChange={(e) => updateFormData("gender", e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Female</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="radio"
                    name="gender"
                    value="prefer-not-to-say"
                    checked={formData.gender === "prefer-not-to-say"}
                    onChange={(e) => updateFormData("gender", e.target.value)}
                    className="text-indigo-600 focus:ring-indigo-500"
                  />
                  <span className="text-sm">Prefer not to say</span>
                </label>
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
              <Label htmlFor="socialMediaUrl">
                Social Media URL (Optional)
              </Label>
              <Input
                id="socialMediaUrl"
                value={formData.socialMediaUrl}
                onChange={(e) =>
                  updateFormData("socialMediaUrl", e.target.value)
                }
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
        )}

        {currentStep === 3 && formData.userRole === "explorer" && (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="fun" className="text-base font-semibold">
                What interests you most?
              </Label>
              <Input
                id="fun"
                value={formData.fun}
                onChange={(e) => updateFormData("fun", e.target.value)}
                placeholder="e.g., Photography, Music, Travel, Cooking, Gaming, Art, Sports..."
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Tell us what you enjoy doing in your free time or what hobbies
                you're passionate about
              </p>
            </div>
          </div>
        )}

        {currentStep === 3 && formData.userRole !== "explorer" && (
          <div className="space-y-6">
            {/* Discipline Selection */}
            <div className="space-y-4">
              <Label className="text-base font-semibold">Discipline</Label>
              <div className="flex flex-wrap gap-3">
                {[
                  "Writing & Storytelling",
                  "Performance & Audio",
                  "Tech & Digital Creation",
                  "Visual Arts & Design",
                  "Video & Motion Media",
                ].map((discipline) => (
                  <button
                    key={discipline}
                    type="button"
                    onClick={() => updateFormData("discipline", discipline)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                      formData.discipline === discipline
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-md"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {discipline}
                  </button>
                ))}
              </div>
            </div>

            {/* Role Input */}
            <div className="space-y-2">
              <Label htmlFor="role" className="text-base font-semibold">
                Role
              </Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => updateFormData("role", e.target.value)}
                placeholder="e.g., Illustration & Graphic Design, Content Writer, Software Developer..."
                className="w-full"
              />
              <p className="text-sm text-muted-foreground">
                Enter your specific role or job title within your chosen
                discipline
              </p>
            </div>
          </div>
        )}

        {currentStep === 4 && formData.userRole !== "explorer" && (
          <div className="space-y-6">
            <div className="text-center">
              <p className="text-sm text-muted-foreground mb-6">
                This step is optional. You can skip it and add projects later
                from your profile.
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
                onChange={(e) =>
                  updateFormData("projectDescription", e.target.value)
                }
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
                        <p className="text-sm text-gray-500">
                          No image selected
                        </p>
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
                      onChange={handleProjectCoverUpload}
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
        )}
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-4">
        <Button
          variant="outline"
          onClick={prevStep}
          disabled={currentStep === 1}
          className="flex items-center gap-2 bg-transparent"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </Button>

        {currentStep < steps.length ? (
          <Button onClick={nextStep} className="flex items-center gap-2">
            {currentStep === steps.length - 1 ? "Complete Setup" : "Next"}
            {currentStep < steps.length - 1 && (
              <ChevronRight className="h-4 w-4" />
            )}
          </Button>
        ) : (
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            Get Started
          </Button>
        )}
      </div>
    </div>
  );
}
