import { requireAdmin } from "@/lib/queries";
import AddBravoForm from "@/components/forms/add-bravo-form";

export const metadata = {
  title: "Admin",
  description: "Admin page",
};

export default async function AdminPage() {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  const session = await requireAdmin();

  return (
    <div className="block-space big-container">
      <AddBravoForm />
    </div>
  );
}
