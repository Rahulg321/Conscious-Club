import { auth } from "@/auth";
import {
  getAllTags,
  getUserFollowCounts,
  getUserProjects,
  getUserMashupProjects,
} from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Button } from "@/components/ui/button";
import { Loader2, Plus, Sparkles, MapPin, Shuffle } from "lucide-react";
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
import MashupDialog from "@/components/dialogs/mashup-dialog";
import {
  disciplineColor,
  DisciplineType,
} from "@/components/forms/onboarding/config";
// import { FloatingPaths } from "@/components/profile-info-card";
import {
  Tabs,
  TabsContent,
  // TabsContents,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";

export async function generateMetadata({
  params,
  searchParams,
}: Props): Promise<Metadata> {
  const { userId } = await params;

  const profileUser = await getCachedUserById(userId);

  return {
    title: `Profile ${profileUser?.name || "User"}`,
    description: `${profileUser?.name} ${profileUser?.role} ${profileUser?.discipline} ${profileUser?.city || ""} ${profileUser?.country || ""}`,
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

  const isValidDiscipline = (d: unknown): d is DisciplineType =>
    typeof d === "string" &&
    ["Digital", "Visuals", "Writing", "Performance", "Motion"].includes(
      d as DisciplineType
    );

  const disciplineKey: DisciplineType = isValidDiscipline(
    currentUser.discipline
  )
    ? (currentUser.discipline as DisciplineType)
    : "Digital";
  return (
    <div>
      <div className="relative px-4 md:px-8 pb-2 md:py-2">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-2 gap-4">
          <div className="flex flex-col  md:items-start gap-4 md:gap-2 w-full rounded-lg pb-4 md:px-4 pt-2 relative  border border-gray-100/50 ">
            {/* <FloatingPaths
              color={disciplineColor[disciplineKey as DisciplineType].stroke}
              position={1}
            />
            <FloatingPaths
              color={disciplineColor[disciplineKey as DisciplineType].stroke}
              position={-1}
            /> */}
            <div className="flex items-center justify-end w-full">
              {isOwnProfile ? (
                <ProfileEditDialog
                  userId={userId}
                  name={currentUser.name || ""}
                  bio={currentUser.bio || ""}
                  city={currentUser.city || ""}
                  country={currentUser.country || ""}
                />
              ) : (
                <div className="flex items-center gap-2">
                  <FollowButton
                    userId={userId}
                    isFollowing={isUserFollowing}
                    className="flex items-center gap-2 bg-indigo-500 text-white"
                  />
                  <MashupDialog
                    collaboratorId={userId}
                    collaboratorName={currentUser.name || undefined}
                    userSession={userSession}
                  />
                </div>
              )}
            </div>
            <div className="flex flex-row  justify-center items-start gap-4 md:gap-8 w-max rounded-lg border border-gray-100/40 bg-white/80 md:px-8 z-50">
              <div className="relative self-center  ">
                <div className="w-36 h-36 md:w-56 md:h-56 rounded-full border-4 border-gray-100 shadow-lg relative">
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

              <div className="md:text-left my-auto w-full flex flex-col items-start justify-center">
                <h2 className="text-xl md:text-4xl font-semibold text-[#171c21] mb-1 flex items-center justify-start">
                  {currentUser.name || ""}
                </h2>
                <div className="text-[#666a6e] mb-2 flex items-center justify-start">
                  <MapPin className="w-4 h-4" />{" "}
                  {[currentUser.city, currentUser.country]
                    .filter(Boolean)
                    .join(", ") || ""}
                </div>
                <div className="flex flex-wrap gap-2 justify-center md:justify-start md:mb-4 mb-2">
                  <span className="md:px-3 px-1 py-1 flex items-center justify-center bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full">
                    {followers} followers
                  </span>
                  <span className="md:px-3 px-1 py-1 flex items-center justify-center bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full">
                    {following} following
                  </span>
                </div>

                <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                  <span
                    className={`px-3  py-1 flex items-center justify-center ${disciplineColor[disciplineKey as DisciplineType].color} text-sm font-medium rounded-full `}
                  >
                    {currentUser.discipline || "Digital"}
                  </span>
                  {currentUser.role && (
                    <span
                      className={`px-3 py-1 flex items-center justify-center border-2 ${disciplineColor[disciplineKey as DisciplineType].border} ${disciplineColor[disciplineKey as DisciplineType].text} text-sm font-medium rounded-full`}
                    >
                      {currentUser.role}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#171c21]">About</h3>

          {currentUser.bio ? (
            <p>{currentUser.bio}</p>
          ) : (
            <p>Bio Not Available Yet</p>
          )}
        </div>
        <div className="w-full px-4">
          <Tabs defaultValue="creations">
            <TabsList className="w-full">
              <TabsTrigger value="creations">Creations</TabsTrigger>
              <TabsTrigger value="mashups">Mashups</TabsTrigger>
            </TabsList>
            <TabsContent value="creations">
              <div className="w-full">
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
            </TabsContent>
            <TabsContent value="mashups">
              <div className="w-full">
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
            </TabsContent>
          </Tabs>
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
  const profileUser = await getCachedUserById(profileUserId);

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
              creatorName={profileUser?.name || undefined}
              creatorInfo={{
                id: profileUser?.id,
                name: profileUser?.name || undefined,
                discipline: profileUser?.discipline || null,
                role: profileUser?.role || null,
              }}
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
          <Shuffle className="w-5 h-5 text-purple-600" />
          Mashups
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
              creatorInfo={{
                id: mashup.creatorId || undefined,
                name: creatorName,
                discipline: mashup.creatorDiscipline,
                role: mashup.creatorRole,
              }}
              collaboratorInfo={{
                id: mashup.collaboratorId || undefined,
                name: collaboratorName,
                discipline: mashup.collaboratorDiscipline,
                role: mashup.collaboratorRole,
              }}
              isOwnProfile={isOwnProfile}
            />
          );
        })}
      </div>
    </div>
  );
}
