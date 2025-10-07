import { auth } from "@/auth";
import {
  getAllTags,
  getUserFollowCounts,
  getUserProjects,
} from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Button } from "@/components/ui/button";
import { Edit, Heart, Loader2, Share, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";
import BannerUploadDialog from "@/components/dialogs/banner-upload-dialog";
import ProfilePicUploadDialog from "@/components/dialogs/profile-pic-upload-dialog";
import ProjectCard from "@/components/project-card";
import { Metadata } from "next";
import { getCachedUserById } from "@/lib/cached-queries";
import Link from "next/link";
import ProfileEditDialog from "@/components/dialogs/profile-edit-dialog";

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
  if (!userId) redirect("/");
  const userSession = await auth();
  if (!userSession) redirect("/login");
  if (userSession.user.id !== userId) redirect("/");
  const currentUser = await getCachedUserById(userId);
  if (!currentUser) redirect("/");

  const { followers, following } = await getUserFollowCounts(userId);

  return (
    <div>
      <div className="relative h-32 md:h-48 bg-gradient-to-r from-[#4d83c9] to-[#42354a] overflow-hidden">
        {currentUser.bannerImage && (
          <Image
            src={currentUser.bannerImage}
            fill
            alt="Profile banner"
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute top-2 md:top-4 right-2 md:right-4">
          <BannerUploadDialog />
        </div>
      </div>

      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            <div className="relative self-center md:self-start">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full border-4 border-white shadow-lg -mt-8 md:-mt-12 relative">
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
                <span className="px-3 py-1 bg-[#cdff98] text-[#42354a] text-sm font-medium rounded-full">
                  {currentUser.role || "No Role Yet"}
                </span>
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

            <Button variant="outline" className="">
              <Share /> Share
            </Button>
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
            <DisplayUserProjectWork currentUserId={userSession.user.id} />
          </Suspense>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;

async function DisplayUserProjectWork({
  currentUserId,
}: {
  currentUserId: string;
}) {
  const [projects, allTags] = await Promise.all([
    getUserProjects(currentUserId),
    getAllTags(),
  ]);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div>
          <h4>View Your Work</h4>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/profile/${currentUserId}/projects`}>View All</Link>
          </Button>

          <ProjectUploadDialog allTags={allTags || []} />
        </div>
      </div>

      {!projects || projects.length === 0 ? (
        <div className="text-center py-12 px-4">
          <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
          <h4 className="text-lg font-medium text-[#171c21] mb-2">
            No projects yet
          </h4>
          <p className="text-[#667085] mb-4">
            Upload your first project to showcase your work
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <div className="flex gap-6 pb-4 min-w-max">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
