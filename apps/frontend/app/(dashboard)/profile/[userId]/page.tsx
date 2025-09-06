import { auth } from "@/auth";
import { getUserById, getUserProjects } from "@/lib/queries";
import ProjectUploadDialog from "@/components/dialogs/project-upload-dialog";
import { Button } from "@/components/ui/button";
import { Camera, Heart, Loader2, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";
import React, { Suspense } from "react";
import Image from "next/image";

const ProfilePage = async ({
  params,
}: {
  params: Promise<{ userId: string }>;
}) => {
  const { userId } = await params;

  const userSession = await auth();

  if (!userSession) redirect("/login");

  if (userSession.user.id !== userId) redirect("/");

  const currentUser = await getUserById(userSession.user.id);

  if (!currentUser) redirect("/");

  return (
    <div>
      <div className="relative h-32 md:h-48 bg-gradient-to-r from-[#4d83c9] to-[#42354a] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          alt="Profile banner"
          className="w-full h-full object-cover"
        />
        <div className="absolute top-2 md:top-4 right-2 md:right-4">
          <button className="w-8 h-8 md:w-10 md:h-10 bg-black/20 rounded-full flex items-center justify-center hover:bg-black/30 transition-colors">
            <Camera className="w-4 h-4 md:w-5 md:h-5 text-white" />
          </button>
        </div>
      </div>

      <div className="px-4 md:px-8 py-4 md:py-6">
        <div className="flex flex-col md:flex-row md:items-start md:justify-between mb-6 gap-4">
          <div className="flex flex-col md:flex-row md:items-start gap-4 md:gap-6">
            <div className="relative self-center md:self-start">
              <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-4 border-white shadow-lg -mt-8 md:-mt-12 relative">
                <Image
                  src={currentUser.image || "/user-placeholder.png"}
                  fill
                  alt={currentUser.name || "User"}
                  className="object-cover"
                />
              </div>
              <button className="absolute bottom-0 right-0 w-6 h-6 md:w-8 md:h-8 bg-black/60 rounded-full flex items-center justify-center">
                <Camera className="w-3 h-3 md:w-4 md:h-4 text-white" />
              </button>
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
                  {currentUser.role || ""}
                </span>
                <span className="px-3 py-1 bg-[#f9fafb] text-[#666a6e] text-sm font-medium rounded-full border border-[#e2e3e6]">
                  {currentUser.type || "Explorer"}
                </span>
              </div>
            </div>
          </div>

          <Button
            variant="outline"
            className="w-full md:w-auto px-4 py-2 text-sm font-medium bg-transparent"
          >
            Save
          </Button>
        </div>

        <div className="mb-8">
          <h3 className="text-lg font-semibold text-[#171c21] mb-3">About</h3>
          <p className="text-[#667085] leading-relaxed">
            Lorem ipsum dolor sit amet consectetur. Ullamcorper in at dolor sit
            dolor tellus viverra. Fermentum dolor dolor tincidunt senectus.
          </p>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-[#171c21] mb-6">
            Profile picture theme
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 max-w-2xl">
            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto border-2 border-[#cf5b8d]">
                  <img
                    src="https://images.unsplash.com/photo-1604382354696-e1ded9e5c2cb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Conscious Club theme"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-[#ff7497] rounded-full flex items-center justify-center">
                  <Heart className="w-2.5 h-2.5 md:w-3 md:h-3 text-white fill-current" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#ff7497] rounded-full flex items-center justify-center">
                  <Heart className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" />
                </div>
              </div>
              <div className="text-sm font-medium text-[#171c21] border-b-2 border-[#171c21] pb-1 inline-block">
                Conscious Club theme
              </div>
            </div>

            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1604382354696-e1ded9e5c2cb?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Creative theme"
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1 w-5 h-5 md:w-6 md:h-6 bg-[#7cde4c] rounded-full flex items-center justify-center">
                  <Sparkles className="w-2.5 h-2.5 md:w-3 md:h-3 text-white fill-current" />
                </div>
                <div className="absolute -bottom-1 -right-1 w-6 h-6 md:w-8 md:h-8 bg-[#8be030] rounded-full flex items-center justify-center">
                  <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-white fill-current" />
                </div>
              </div>
              <div className="text-sm text-[#a9acb4]">Creative theme</div>
            </div>

            <div className="text-center">
              <div className="relative mb-3">
                <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden mx-auto">
                  <img
                    src="https://images.unsplash.com/photo-1533473359331-0135ef168bfd?q=80&w=880&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    alt="Standard"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="text-sm text-[#a9acb4]">Standard</div>
            </div>
          </div>

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
  const projects = await getUserProjects(currentUserId);

  return (
    <div className="mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <h3 className="text-lg font-semibold text-[#171c21]">Work Sample</h3>
        <ProjectUploadDialog />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div
              key={project.id}
              className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200"
            >
              <div className="aspect-video bg-gray-100 overflow-hidden">
                <img
                  src={project.coverImage}
                  alt={project.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                />
              </div>
              <div className="p-4">
                <h4 className="font-medium text-[#171c21] mb-2 line-clamp-1">
                  {project.name}
                </h4>
                <p className="text-sm text-[#667085] line-clamp-2">
                  {project.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
