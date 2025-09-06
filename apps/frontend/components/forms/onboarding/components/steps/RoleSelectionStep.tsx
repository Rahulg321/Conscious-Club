import { USER_ROLES } from "../../config";
import { OnboardingFormData, UserRole } from "../../types";

interface RoleSelectionStepProps {
  formData: OnboardingFormData;
  updateFormData: (
    field: keyof OnboardingFormData,
    value: string | boolean | File | null
  ) => void;
}

export const RoleSelectionStep = ({
  formData,
  updateFormData,
}: RoleSelectionStepProps) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h3 className="text-lg font-medium mb-4">Choose your role</h3>
        <p className="text-sm text-muted-foreground mb-6">
          Select the role that best describes you in our community
        </p>
      </div>

      <div className="grid gap-4">
        {USER_ROLES.map((role) => (
          <label key={role.value} className="relative">
            <input
              type="radio"
              name="userRole"
              value={role.value}
              checked={formData.userRole === role.value}
              onChange={(e) => updateFormData("userRole", e.target.value)}
              className="sr-only"
            />
            <div
              className={`p-6 border-2 rounded-lg cursor-pointer transition-all ${
                formData.userRole === role.value
                  ? "border-indigo-600 bg-indigo-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              <div className="flex items-center space-x-4">
                <div
                  className={`w-4 h-4 rounded-full border-2 ${
                    formData.userRole === role.value
                      ? "border-indigo-600 bg-indigo-600"
                      : "border-gray-300"
                  }`}
                >
                  {formData.userRole === role.value && (
                    <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                  )}
                </div>
                <div>
                  <h4 className="font-medium text-lg">{role.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          </label>
        ))}
      </div>
    </div>
  );
};
