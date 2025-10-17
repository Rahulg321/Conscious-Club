import { auth } from "@/auth";
import {
  getAllTags,
  getUserFollowCounts,
  getUserProjects,
  getUserMashupProjects,
} from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Heart, Loader2, Plus, Share, Sparkles } from "lucide-react";
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
  if (userSession.user.id !== userId) redirect("/");
  const currentUser = await getCachedUserById(userId);
  if (!currentUser) redirect("/");
  if (!currentUser.onboardingCompleted) redirect("/onboarding");

  const { followers, following } = await getUserFollowCounts(userId);

  return (
    <div>
      <div className="px-4 md:px-8 py-6 md:py-8">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            <div className="relative self-center md:self-start">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-gray-100 shadow-lg relative">
                <Image
                  src={currentUser.image || "/user-placeholder.png"}
                  fill
                  alt={currentUser.name || "User"}
                  className="object-cover rounded-full"
                />
                <div className="absolute bottom-1 -right-2">
                  <ProfilePicUploadDialog />
                </div>
              </div>
            </div>

            <div className="text-center md:text-left md:pt-4">
              <h2 className="text-xl md:text-2xl font-semibold text-[#171c21] mb-1">
                {currentUser.name || ""}
              </h2>
              <p className="text-[#666a6e] mb-4">
                {currentUser.location || ""}
              </p>

              <div className="flex flex-wrap gap-2 justify-center md:justify-start">
                {currentUser.role && (
                  <span className="px-3 py-1 bg-[#cdff98] text-[#42354a] text-sm font-medium rounded-full">
                    {currentUser.role}
                  </span>
                )}
                <span className="px-3 py-1 bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full border border-[#e2e3e6]">
                  {currentUser.type || "Explorer"}
                </span>
                <span className="px-3 py-1 bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full border border-[#e2e3e6]">
                  {followers} followers
                </span>
                <span className="px-3 py-1 bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full border border-[#e2e3e6]">
                  {following} following
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <ProfileEditDialog
              userId={userId}
              name={currentUser.name || ""}
              bio={currentUser.bio || ""}
              location={currentUser.location || ""}
            />

            {/* <Button variant="outline" className="">
              <Share /> Share
            </Button>
             */}
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
              currentUserId={userSession.user.id}
              userSession={userSession}
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
            <DisplayUserMashupProjects currentUserId={userSession.user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

async function DisplayUserProjectWork({
  currentUserId,
  userSession,
}: {
  currentUserId: string;
  userSession: Session;
}) {
  const projects = await getUserProjects(currentUserId);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/profile/${currentUserId}/projects`}>View All</Link>
          </Button>

          <ProjectUploadDialog userSession={userSession} />
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
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </div>
  );
}

async function DisplayUserMashupProjects({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const mashupProjects = await getUserMashupProjects(currentUserId);

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
            />
          );
        })}
      </div>
    </div>
  );
}
