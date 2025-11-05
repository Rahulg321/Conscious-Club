import { auth } from "@/auth";
import {
  getAllTags,
  getUserFollowCounts,
  getUserProjects,
  getUserMashupProjects,
} from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Sparkles, MapPin } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import ProfilePicUploadDialog from "@/components/dialogs/profile-pic-upload-dialog";
import ProjectCard from "@/components/project-card";
import { Metadata } from "next";
import { getCachedUserById } from "@/lib/cached-queries";
import Link from "next/link";
import ProfileEditDialog from "@/components/dialogs/profile-edit-dialog";
import { Session } from "next-auth";
import { isFollowing } from "@/lib/actions/follow-action";
import FollowButton from "@/components/buttons/follow-button";

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { userId } = await params;

  const profileUser = await getCachedUserById(userId);

  return {
    title: `Profile ${profileUser?.name || "User"}`,
    description: `${profileUser?.name} ${profileUser?.role} ${profileUser?.discipline} ${profileUser?.location}`,
  };
}

type Props = {
  params: Promise<{ userId: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
};

const ProfilePage = async ({ params }: Props) => {
  const { userId } = await params;
  const userSession = await auth();
  if (!userSession) redirect("/login");

  const currentUser = await getCachedUserById(userId);
  if (!currentUser) redirect("/");

  // Check if viewing own profile
  const isOwnProfile = userSession.user.id === userId;

  // If viewing own profile, ensure onboarding is completed
  if (isOwnProfile && !currentUser.onboardingCompleted) redirect("/onboarding");

  const { followers, following } = await getUserFollowCounts(userId);

  // Get follow status if viewing someone else's profile
  const isUserFollowing = isOwnProfile ? false : await isFollowing(userId);

  type Discipline =
    | "Digital"
    | "Visuals"
    | "Writing"
    | "Performance"
    | "Motion";
  const disciplineColor: Record<
    Discipline,
    { color: string; border: string; text: string }
  > = {
    Digital: {
      color: "bg-blue-300",
      border: "border-blue-300",
      text: "text-blue-500",
    },
    Visuals: {
      color: "bg-[#cdff98]",
      border: "border-[#cdff98]",
      text: "text-[#42354a]",
    },
    Writing: {
      color: "bg-yellow-200",
      border: "border-yellow-200",
      text: "text-yellow-500",
    },
    Performance: {
      color: "bg-orange-200",
      border: "border-orange-200",
      text: "text-orange-500",
    },
    Motion: {
      color: "bg-purple-300",
      border: "border-purple-300",
      text: "text-purple-500",
    },
  };

  const isValidDiscipline = (d: unknown): d is Discipline =>
    typeof d === "string" &&
    ["Digital", "Visuals", "Writing", "Performance", "Motion"].includes(
      d as Discipline
    );

  const disciplineKey: Discipline = isValidDiscipline(currentUser.discipline)
    ? (currentUser.discipline as Discipline)
    : "Digital";
  return (
    <div>
      <div className="px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div className="flex flex-col  md:items-start gap-4 md:gap-2 w-full border rounded-lg pb-4 px-4 pt-2">
            <div className="flex items-center justify-end w-full">
              {isOwnProfile ? (
                <ProfileEditDialog
                  userId={userId}
                  name={currentUser.name || ""}
                  bio={currentUser.bio || ""}
                  location={currentUser.location || ""}
                />
              ) : (
                <FollowButton
                  userId={userId}
                  isFollowing={isUserFollowing}
                  className="flex items-center gap-2"
                />
              )}
            </div>
            <div className="relative self-center ">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-100 shadow-lg relative">
                <Image
                  src={currentUser.image || "/user-placeholder.png"}
                  fill
                  alt={currentUser.name || "User"}
                  className="object-cover rounded-full"
                />
                {isOwnProfile && (
                  <div className="absolute bottom-1 -right-2">
                    <ProfilePicUploadDialog />
                  </div>
                )}
              </div>
            </div>

            <div className="text-center md:text-left w-full flex flex-col items-center justify-center">
              <h2 className="text-xl md:text-2xl font-semibold text-[#171c21] mb-1 flex items-center justify-center">
                {currentUser.name || ""}
              </h2>
              <div className="text-[#666a6e] mb-2 flex items-center justify-center">
                <MapPin className="w-4 h-4" /> {currentUser.location || ""}
              </div>
              <div className="flex flex-wrap gap-2 justify-center md:justify-start mb-4">
                <span className="px-3 py-1 flex items-center justify-center bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full">
                  {followers} followers
                </span>
                <span className="px-3 py-1 flex items-center justify-center bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full">
                  {following} following
                </span>
              </div>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                <span
                  className={`px-3 py-1 flex items-center justify-center ${disciplineColor[disciplineKey].color} text-sm font-medium rounded-full `}
                >
                  {currentUser.discipline || "Digital"}
                </span>
                {currentUser.role && (
                  <span
                    className={`px-3 py-1 flex items-center justify-center border-2 ${disciplineColor[disciplineKey].border} ${disciplineColor[disciplineKey].text} text-sm font-medium rounded-full`}
                  >
                    {currentUser.role}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#171c21] mb-3">About</h3>

          {currentUser.bio ? (
            <p>{currentUser.bio}</p>
          ) : (
            <p>Bio Not Available Yet</p>
          )}
        </div>
        <div className="text-center">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-10 animate-spin" />
              </div>
            }
          >
            <DisplayUserProjectWork
              profileUserId={userId}
              currentUserId={userSession.user.id}
              userSession={userSession}
              isOwnProfile={isOwnProfile}
            />
          </Suspense>
        </div>

        <div className="text-center mt-12">
          <Suspense
            fallback={
              <div className="flex items-center justify-center py-12">
                <Loader2 className="size-10 animate-spin" />
              </div>
            }
          >
            <DisplayUserMashupProjects
              profileUserId={userId}
              currentUserId={userSession.user.id}
              isOwnProfile={isOwnProfile}
            />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

async function DisplayUserProjectWork({
  profileUserId,
  currentUserId,
  userSession,
  isOwnProfile,
}: {
  profileUserId: string;
  currentUserId: string;
  userSession: Session;
  isOwnProfile: boolean;
}) {
  const projects = await getUserProjects(profileUserId);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/profile/${profileUserId}/projects`}>View All</Link>
          </Button>

          {isOwnProfile && <ProjectUploadDialog userSession={userSession} />}
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <Plus className="w-8 h-8 text-gray-400" />
          </div>
          <h4 className="text-lg font-medium text-[#171c21] mb-2">
            No Creations yet
          </h4>
          <p className="text-[#667085] mb-4">
            Upload your first project to showcase your work
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

async function DisplayUserMashupProjects({
  profileUserId,
  currentUserId,
  isOwnProfile,
}: {
  profileUserId: string;
  currentUserId: string;
  isOwnProfile: boolean;
}) {
  const mashupProjects = await getUserMashupProjects(profileUserId);

  if (!mashupProjects || mashupProjects.length === 0) {
    return (
      <div className="mt-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
          <h3 className="text-xl font-semibold text-[#171c21]">Mashups</h3>
        </div>
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gradient-to-br from-purple-100 to-pink-100 rounded-full flex items-center justify-center">
            <Sparkles className="w-8 h-8 text-purple-600" />
          </div>
          <h4 className="text-lg font-medium text-[#171c21] mb-2">
            No Mashups yet
          </h4>
          <p className="text-[#667085] mb-4">
            Collaborate with other users to create amazing Mashups
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-xl font-semibold text-[#171c21] flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-purple-600" />
          Mashup Projects
        </h3>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mashupProjects.map((mashup) => {
          const project = mashup.project;

          // Show both creator and collaborator names
          const creatorName = mashup.creatorName || "Unknown";
          const collaboratorName = mashup.collaboratorName || "Unknown";

          return (
            <ProjectCard
              key={project.id}
              project={project}
              creatorName={creatorName}
              collaboratorName={collaboratorName}
              isOwnProfile={isOwnProfile}
            />
          );
        })}
      </div>
    </div>
  );
}
