import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { OnboardingFormData } from "../../types";

interface InterestsStepProps {
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => void;
}

export const InterestsStep = ({
  formData,
  updateFormData,
}: InterestsStepProps) => {
  return (
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
          Tell us what you enjoy doing in your free time or what hobbies you're
          passionate about
        </p>
      </div>
    </div>
  );
};
