import { auth } from "@/auth";
import {
  getUserFollowCounts,
  getUserProjects,
  getUserMashupProjects,
} from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Loader2, Plus, Sparkles, Shuffle } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import ProjectCard from "@/components/project-card";
import { Metadata } from "next";
import { getCachedUserById } from "@/lib/cached-queries";
import { Session } from "next-auth";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/animate-ui/components/radix/tabs";

export const metadata: Metadata = {
  title: "Creative",
  description: "Your creative workspace",
};

const CreativePage = async () => {
  const userSession = await auth();
  if (!userSession) redirect("/login");

  const currentUser = await getCachedUserById(userSession.user.id);
  if (!currentUser) redirect("/");

  // Ensure onboarding is completed
  if (!currentUser.onboardingCompleted) redirect("/onboarding");

  return (
    <div>
      <div className="relative pl-4 md:pl-8 pb-2 md:pb-2">
        {/* Removed top profile section - profile picture, name, bio, etc. */}

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
                    profileUserId={userSession.user.id}
                    currentUserId={userSession.user.id}
                    userSession={userSession}
                    isOwnProfile={true}
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
                    profileUserId={userSession.user.id}
                    currentUserId={userSession.user.id}
                    isOwnProfile={true}
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

export default CreativePage;

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
