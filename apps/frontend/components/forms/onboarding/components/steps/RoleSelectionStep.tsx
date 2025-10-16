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
        <h3 className="text-lg font-medium mb-4">Welcome, Creator!</h3>
        <p className="text-sm text-muted-foreground mb-6">
          You're joining as a creator to share your content, projects, and
          creative work with our community
        </p>
      </div>

      <div className="grid gap-4">
        {USER_ROLES.map((role) => (
          <div key={role.value} className="relative">
            <div className="p-6 border-2 rounded-lg border-indigo-600 bg-indigo-50">
              <div className="flex items-center space-x-4">
                <div className="w-4 h-4 rounded-full border-2 border-indigo-600 bg-indigo-600">
                  <div className="w-2 h-2 bg-white rounded-full m-0.5"></div>
                </div>
                <div>
                  <h4 className="font-medium text-lg">{role.title}</h4>
                  <p className="text-sm text-muted-foreground">
                    {role.description}
                  </p>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
