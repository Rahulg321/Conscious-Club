// import { auth } from "@/auth";
// import ProfileCard from "@/components/profile-card";
// import { getUserProfileWithFollowInfo } from "@/lib/queries";

// /**
//  * Example component showing how to use the follow functionality
//  * This component demonstrates how to fetch a user profile with follow information
//  * and display it using the ProfileCard component
//  */
// export default async function FollowExample({ userId }: { userId: string }) {
//   const session = await auth();
//   const currentUserId = session?.user?.id;

//   // Get user profile with follow information
//   const userProfile = await getUserProfileWithFollowInfo(userId, currentUserId);

//   if (!userProfile) {
//     return <div>User not found</div>;
//   }

//   return (
//     <div className="max-w-4xl mx-auto p-6">
//       <h1 className="text-2xl font-bold mb-6">
//         User Profile with Follow Functionality
//       </h1>
//       <ProfileCard userProfile={userProfile} currentUserId={currentUserId} />
//     </div>
//   );
// }

// /**
//  * Usage examples:
//  *
//  * 1. In a page component:
//  * ```tsx
//  * export default async function UserProfilePage({ params }: { params: { id: string } }) {
//  *   return <FollowExample userId={params.id} />;
//  * }
//  * ```
//  *
//  * 2. In a component with multiple profiles:
//  * ```tsx
//  * export default async function UserList() {
//  *   const session = await auth();
//  *   const userIds = ["user1", "user2", "user3"];
//  *
//  *   return (
//  *     <div>
//  *       {userIds.map(id => (
//  *         <FollowExample key={id} userId={id} />
//  *       ))}
//  *     </div>
//  *   );
//  * }
//  * ```
//  */
