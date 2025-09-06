import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { DISCIPLINES } from "../../config";
import { OnboardingFormData } from "../../types";

interface DisciplineRoleStepProps {
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => void;
}

export const DisciplineRoleStep = ({
  formData,
  updateFormData,
}: DisciplineRoleStepProps) => {
  return (
    <div className="space-y-6">
      {/* Discipline Selection */}
      <div className="space-y-4">
        <Label className="text-base font-semibold">Discipline</Label>
        <div className="flex flex-wrap gap-3">
          {DISCIPLINES.map((discipline) => (
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
          Enter your specific role or job title within your chosen discipline
        </p>
      </div>
    </div>
  );
};
