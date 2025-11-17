import { auth } from "@/auth";
import {
  getUserFollowCounts,
  getUserProjects,
  getUserMashupProjects,
} from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Loader2, Plus, Sparkles, MapPin, Shuffle } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import ProfilePicUploadDialog from "@/components/dialogs/profile-pic-upload-dialog";
import ProjectCard from "@/components/project-card";
import { Metadata } from "next";
import { getCachedUserById } from "@/lib/cached-queries";
import ProfileEditDialog from "@/components/dialogs/profile-edit-dialog";
import { isFollowing } from "@/lib/actions/follow-action";
import FollowButton from "@/components/buttons/follow-button";
import MashupDialog from "@/components/dialogs/mashup-dialog";
import {
  disciplineColor,
  DisciplineType,
} from "@/components/forms/onboarding/config";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";
import { notFound } from "next/navigation";
import ProfileSectionSkeleton from "@/components/skeletons/profile-section-skeleton";

type Props = {
  params: Promise<{ userId: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { userId } = await params;

  const profileUser = await getCachedUserById(userId);

  return {
    title: `Profile ${profileUser?.name || "User"}`,
    description: `${profileUser?.name} ${profileUser?.role} ${profileUser?.discipline} ${profileUser?.city || ""} ${profileUser?.country || ""}`,
  };
}

const ProfilePage = async ({ params }: Props) => {
  return (
    <div>
      <Suspense fallback={<ProfileSectionSkeleton />}>
        <DisplayUserProfileSection params={params} />
      </Suspense>
      <div className="relative pl-4 md:pl-8 pb-2 md:pb-2">
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
                  <DisplayUserProjectWork params={params} />
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
                  <DisplayUserMashupProjects params={params} />
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

async function DisplayUserProfileSection({ params }: Props) {
  const { userId } = await params;
  const userSession = await auth();
  if (!userSession) redirect("/login");

  const isOwnProfile = userSession.user.id === userId;

  const currentUser = await getCachedUserById(userId);
  if (isOwnProfile && !currentUser?.onboardingCompleted)
    redirect("/onboarding");

  if (!currentUser) {
    console.log("User not found");
    return notFound();
  }

  const { followers, following } = await getUserFollowCounts(userId);

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
      <div className="flex flex-col md:flex-row md:items-start md:justify-start mb-2 gap-4 mr-auto">
        <div className="flex flex-col  md:items-start gap-4 md:gap-2 w-full rounded-lg pb-4 md:px-4 pt-2   mr-auto">
          <div className="flex flex-row  justify-center items-start gap-4 md:gap-8 w-max rounded-lg md:px-8 mr-auto">
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
              <h2 className="text-xl md:text-4xl font-semibold text-[#171c21] mb-2 w-full">
                <div className="truncate w-full">{currentUser.name || ""}</div>
              </h2>
              <div className="flex items-center gap-2 mb-2 w-full">
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
                      className="flex items-center gap-2 bg-indigo-500 text-white hover:bg-indigo-600"
                    />
                    <MashupDialog
                      isIcon={true}
                      collaboratorId={userId}
                      collaboratorName={currentUser.name || undefined}
                      userSession={userSession}
                    />
                  </div>
                )}
              </div>
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
      <div className="my-4 px-4 md:px-8 lg:px-16">
        <h3 className="text-lg font-semibold text-[#171c21]">About</h3>

        {currentUser.bio ? (
          <div className="!font-caveat text-3xl">{currentUser.bio}</div>
        ) : (
          <div className="!font-caveat text-3xl">Bio Not Available Yet</div>
        )}
      </div>
    </div>
  );
}

async function DisplayUserProjectWork({ params }: Props) {
  const { userId } = await params;
  const userSession = await auth();
  if (!userSession) redirect("/login");
  const isOwnProfile = userSession.user.id === userId;

  const [projects, profileUser] = await Promise.all([
    getUserProjects(userId),
    getCachedUserById(userId),
  ]);

  return (
    <div className="mt-8">
      <div className="flex items-center justify-end w-full mb-6 gap-4">
        {isOwnProfile && <ProjectUploadDialog userSession={userSession} />}
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
                id: profileUser?.id || null,
                name: profileUser?.name || null,
                discipline: profileUser?.discipline || null,
                role: profileUser?.role || null,
                image: profileUser?.image || null,
              }}
              isOwnProfile={isOwnProfile}
            />
          ))}
        </div>
      )}
    </div>
  );
}

async function DisplayUserMashupProjects({ params }: Props) {
  const { userId } = await params;
  const userSession = await auth();
  if (!userSession) redirect("/login");
  const isOwnProfile = userSession.user.id === userId;

  const mashupProjects = await getUserMashupProjects(userId);

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
                id: mashup.creatorId,
                name: creatorName,
                discipline: mashup.creatorDiscipline || null,
                role: mashup.creatorRole,
                image: mashup.creatorImage,
              }}
              collaboratorInfo={{
                id: mashup.collaboratorId || null,
                name: collaboratorName,
                discipline: mashup.collaboratorDiscipline,
                role: mashup.collaboratorRole,
                image: mashup.collaboratorImage,
              }}
              isOwnProfile={isOwnProfile}
            />
          );
        })}
      </div>
    </div>
  );
}
