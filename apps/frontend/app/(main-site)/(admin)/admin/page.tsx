import { requireAdmin } from "@/lib/queries";

export default async function AdminPage() {
  // This will redirect to login if not authenticated, or to dashboard if not admin
  const session = await requireAdmin();

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
        <p>Welcome, {session.user.name}! You have admin access.</p>
        <p className="text-sm mt-2">
          Admin status:{" "}
          {(session.user as any).isAdmin ? "✅ Admin" : "❌ Not Admin"}
        </p>
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Admin Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">User Management</h3>
            <p className="text-gray-600">Manage users and permissions</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Content Moderation</h3>
            <p className="text-gray-600">Review and moderate content</p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="font-semibold mb-2">Analytics</h3>
            <p className="text-gray-600">View detailed analytics</p>
          </div>
        </div>
      </div>
    </div>
  );
}
