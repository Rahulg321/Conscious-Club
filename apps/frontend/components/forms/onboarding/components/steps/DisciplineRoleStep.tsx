import { Label } from "@/components/ui/label";
import { DISCIPLINES, DISCIPLINE_TO_ROLES } from "../../config";
import { OnboardingFormData } from "../../types";
import { disciplineColor, DisciplineType } from "../../config";

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
        <Label className="text-base ">
          Pick your <span className="text-indigo-500 font-bold">style</span>
        </Label>
        <div className="flex flex-wrap gap-3">
          {DISCIPLINES.map((discipline: DisciplineType) => (
            <button
              key={discipline}
              type="button"
              onClick={() => {
                updateFormData("discipline", discipline);
                // Reset role when discipline changes
                updateFormData("role", "");
              }}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer ${
                formData.discipline === discipline
                  ? `${disciplineColor[discipline as DisciplineType].color}`
                  : `${disciplineColor[discipline as DisciplineType].border} bg-stone-100/80 text-gray-700 hover:bg-neutral-100`
              }`}
            >
              {discipline}
            </button>
          ))}
        </div>
      </div>
      {formData.discipline && (
        <div className="space-y-4">
          <Label className="text-base">
            Choose your{" "}
            <span className="text-indigo-500 font-bold">artform</span>
          </Label>
          <div className="flex flex-wrap gap-3">
            {(DISCIPLINE_TO_ROLES[formData.discipline] ?? []).map(
              (role: any) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => {
                    updateFormData("role", role);
                  }}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-all cursor-pointer border-2 ${
                    formData.role === role
                      ? `${disciplineColor[formData.discipline as DisciplineType].border} `
                      : ` border-gray-100  hover:border-gray-200`
                  }`}
                >
                  {role}
                </button>
              )
            )}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">
              {formData.discipline
                ? "Choose an artform that best matches your style"
                : "Pick a style to see artform options"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
