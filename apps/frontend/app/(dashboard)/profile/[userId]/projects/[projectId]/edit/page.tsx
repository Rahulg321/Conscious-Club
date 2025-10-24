import React from "react";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { getProjectByIdWithStats } from "@/lib/queries";
import ProjectEditForm from "@/components/forms/project-edit-form";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";

interface PageProps {
  params: Promise<{
    userId: string;
    projectId: string;
  }>;
}

export async function generateMetadata({ params }: PageProps) {
  const { userId, projectId } = await params;
  return {
    title: `Edit Project - ${projectId}`,
    description: "Edit your project",
  };
}

async function EditProjectPage({ params }: PageProps) {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const { userId, projectId } = await params;

  if (userSession.user.id !== userId) {
    redirect("/");
  }

  const project = await getProjectByIdWithStats(projectId);

  if (!project) {
    notFound();
  }

  if (project.userId !== userId) {
    return notFound();
  }

  return (
    <div className="px-4 md:px-8 py-6 max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center gap-4 mb-4">
          <Button variant="outline" size="sm" asChild>
            <Link href={`/profile/${userId}/projects/${projectId}`}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Project
            </Link>
          </Button>
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Edit Project</h1>
        <p className="text-gray-600 mt-1">
          Update your project details and media
        </p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <ProjectEditForm project={project} userSession={userSession} />
      </div>
    </div>
  );
}

export default EditProjectPage;
