import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { DISCIPLINES, DISCIPLINE_TO_ROLES } from "../../config";
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
              onClick={() => {
                updateFormData("discipline", discipline);
                // Reset role when discipline changes
                updateFormData("role", "");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                formData.discipline === discipline
                  ? "bg-[#877DFE] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {discipline}
            </button>
          ))}
        </div>
      </div>

      {/* Role Select */}
      <div className="space-y-2">
        <Label htmlFor="role" className="text-base font-semibold">
          Role
        </Label>
        <Select
          value={formData.role}
          onValueChange={(value) => updateFormData("role", value)}
          disabled={!formData.discipline}
        >
          <SelectTrigger id="role" className="w-full">
            <SelectValue
              placeholder={
                formData.discipline
                  ? "Select a role"
                  : "Select a discipline first"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {(DISCIPLINE_TO_ROLES[formData.discipline] ?? []).map((role) => (
              <SelectItem key={role} value={role}>
                {role}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <p className="text-sm text-muted-foreground">
          {formData.discipline
            ? "Choose a role that best matches your discipline"
            : "Pick a discipline to see role options"}
        </p>
      </div>
    </div>
  );
};
