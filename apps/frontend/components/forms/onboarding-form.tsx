"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ChevronLeft, ChevronRight, Check } from "lucide-react";

const STEPS = [
  { id: 1, title: "Personal Info", description: "Tell us about yourself" },
  { id: 2, title: "Preferences", description: "Customize your experience" },
  { id: 3, title: "Goals", description: "What do you want to achieve?" },
  { id: 4, title: "Complete", description: "You're all set!" },
];

export function OnboardingForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    company: "",
    role: "",
    experience: "",
    goals: "",
    notifications: true,
    newsletter: false,
  });

  const updateFormData = (field: string, value: string | boolean) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const currentStepData = STEPS.find((step) => step.id === currentStep);

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
        {STEPS.map((step, index) => (
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
            {index < STEPS.length - 1 && (
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
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name</Label>
                <Input
                  id="firstName"
                  value={formData.firstName}
                  onChange={(e) => updateFormData("firstName", e.target.value)}
                  placeholder="Enter your first name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input
                  id="lastName"
                  value={formData.lastName}
                  onChange={(e) => updateFormData("lastName", e.target.value)}
                  placeholder="Enter your last name"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="company">Company</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => updateFormData("company", e.target.value)}
                placeholder="Enter your company name"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="role">Role</Label>
              <Input
                id="role"
                value={formData.role}
                onChange={(e) => updateFormData("role", e.target.value)}
                placeholder="Enter your job title"
              />
            </div>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="experience">Experience Level</Label>
              <select
                id="experience"
                value={formData.experience}
                onChange={(e) => updateFormData("experience", e.target.value)}
                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <option value="">Select your experience level</option>
                <option value="beginner">Beginner (0-2 years)</option>
                <option value="intermediate">Intermediate (2-5 years)</option>
                <option value="advanced">Advanced (5+ years)</option>
              </select>
            </div>
            <div className="space-y-3">
              <Label>Notification Preferences</Label>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.notifications}
                    onChange={(e) =>
                      updateFormData("notifications", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Email notifications</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.newsletter}
                    onChange={(e) =>
                      updateFormData("newsletter", e.target.checked)
                    }
                    className="rounded border-gray-300"
                  />
                  <span className="text-sm">Newsletter updates</span>
                </label>
              </div>
            </div>
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="goals">What are your main goals?</Label>
              <textarea
                id="goals"
                value={formData.goals}
                onChange={(e) => updateFormData("goals", e.target.value)}
                placeholder="Tell us what you want to achieve..."
                rows={4}
                className="flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              />
            </div>
          </div>
        )}

        {currentStep === 4 && (
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">
                Welcome aboard, {formData.firstName}!
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                Your account is ready. Let's get started!
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

        {currentStep < STEPS.length ? (
          <Button onClick={nextStep} className="flex items-center gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
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
