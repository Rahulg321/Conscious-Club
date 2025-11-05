import Link from "next/link";
import { Button } from "./ui/button";
import DeleteProjectAlert from "./buttons/delete-project-alert";
import Image from "next/image";
import { Sparkles, Eye, ExternalLink, Edit, User, Heart, Building2, Flag, MessageSquare } from "lucide-react";

type UserInfo = {
  id?: string;
  name?: string;
  discipline?: string | null;
  role?: string | null;
};

export default function ProjectCard({
  project,
  creatorName,
  collaboratorName,
  creatorInfo,
  collaboratorInfo,
  isOwnProfile = false,
}: {
  project: any;
  creatorName?: string;
  collaboratorName?: string;
  creatorInfo?: UserInfo;
  collaboratorInfo?: UserInfo;
  isOwnProfile?: boolean;
}) {
  // Use coverImage if available, otherwise fall back to first media item
  const coverImage =
    project.coverImage ||
    (project.media && project.media.length > 0 ? project.media[0] : null);
  const isMashup = project.isMashup && creatorName && collaboratorName;

  // Discipline color mapping (matching the profile page)
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

  const getDisciplineColor = (discipline: string | null | undefined) => {
    const key: Discipline = isValidDiscipline(discipline)
      ? (discipline as Discipline)
      : "Digital";
    return disciplineColor[key];
  };

  return (
    <div className="group w-full">
      <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
        <div className="aspect-video relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400 bg-gradient-to-br from-gray-50 to-gray-100">
              <div className="text-center">
                <div className="w-12 h-12 mx-auto mb-2 bg-gray-200 rounded-lg flex items-center justify-center">
                  <Eye className="w-6 h-6 text-gray-400" />
                </div>
                <span className="text-sm font-medium">No media</span>
              </div>
            </div>
          )}

          {isMashup && (
            <div className="absolute top-3 left-3">
              <div className="bg-purple-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Mashup
              </div>
            </div>
          )}
        </div>

        <div className="p-6 space-y-4">
          <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {project.name}
          </h4>

          {/* User Information Section */}
          {isMashup && creatorInfo && collaboratorInfo ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
                <Sparkles className="w-4 h-4 text-purple-500 flex-shrink-0" />
                <span className="font-medium text-xs">Collaboration</span>
              </div>

              {/* Creator Info */}
              <div className="space-y-2">
                <Link
                  href={`/profile/${creatorInfo.id || project.userId}`}
                  className="block hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold text-sm text-gray-900">
                      {creatorName || "Creator"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-5">
                    {creatorInfo.discipline && (
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDisciplineColor(creatorInfo.discipline).color}`}
                      >
                        {creatorInfo.discipline}
                      </span>
                    )}
                    {creatorInfo.role && (
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border-2 ${getDisciplineColor(creatorInfo.discipline).border} ${getDisciplineColor(creatorInfo.discipline).text}`}
                      >
                        {creatorInfo.role}
                      </span>
                    )}
                  </div>
                </Link>
              </div>

              {/* Collaborator Info */}
              <div className="space-y-2">
                <Link
                  href={`/profile/${collaboratorInfo.id || project.collaboratorId}`}
                  className="block hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1.5">
                    <User className="w-3.5 h-3.5 text-gray-400" />
                    <span className="font-semibold text-sm text-gray-900">
                      {collaboratorName || "Collaborator"}
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-1.5 ml-5">
                    {collaboratorInfo.discipline && (
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDisciplineColor(collaboratorInfo.discipline).color}`}
                      >
                        {collaboratorInfo.discipline}
                      </span>
                    )}
                    {collaboratorInfo.role && (
                      <span
                        className={`px-2 py-0.5 text-xs font-medium rounded-full border-2 ${getDisciplineColor(collaboratorInfo.discipline).border} ${getDisciplineColor(collaboratorInfo.discipline).text}`}
                      >
                        {collaboratorInfo.role}
                      </span>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ) : creatorInfo && !isMashup ? (
            <div className="space-y-2">
              <Link
                href={`/profile/${creatorInfo.id || project.userId}`}
                className="block hover:bg-gray-50 -mx-2 px-2 py-1.5 rounded-lg transition-colors"
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <User className="w-3.5 h-3.5 text-gray-400" />
                  <span className="font-semibold text-sm text-gray-900">
                    {creatorName || "Creator"}
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 ml-5">
                  {creatorInfo.discipline && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDisciplineColor(creatorInfo.discipline).color}`}
                    >
                      {creatorInfo.discipline}
                    </span>
                  )}
                  {creatorInfo.role && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border-2 ${getDisciplineColor(creatorInfo.discipline).border} ${getDisciplineColor(creatorInfo.discipline).text}`}
                    >
                      {creatorInfo.role}
                    </span>
                  )}
                </div>
              </Link>
            </div>
          ) : null}

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {project.description}
          </p>

          {/* Dedication Section */}
          {(project.dedicatedToPerson ||
            project.dedicatedToBrand ||
            project.dedicatedToCause ||
            project.dedicationReason) && (
            <div className="pt-2 border-t border-gray-100 space-y-2">
              <div className="text-xs font-medium text-gray-500 mb-2">
                Dedicated To
              </div>
              <div className="space-y-1.5">
                {project.dedicatedToPerson && (
                  <div className="flex items-start gap-2 text-xs">
                    <Heart className="w-3.5 h-3.5 text-pink-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-500">Person: </span>
                      <span className="text-gray-900 font-medium">
                        {project.dedicatedToPerson}
                      </span>
                    </div>
                  </div>
                )}
                {project.dedicatedToBrand && (
                  <div className="flex items-start gap-2 text-xs">
                    <Building2 className="w-3.5 h-3.5 text-blue-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-500">Brand: </span>
                      <span className="text-gray-900 font-medium">
                        {project.dedicatedToBrand}
                      </span>
                    </div>
                  </div>
                )}
                {project.dedicatedToCause && (
                  <div className="flex items-start gap-2 text-xs">
                    <Flag className="w-3.5 h-3.5 text-green-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-500">Cause: </span>
                      <span className="text-gray-900 font-medium">
                        {project.dedicatedToCause}
                      </span>
                    </div>
                  </div>
                )}
                {project.dedicationReason && (
                  <div className="flex items-start gap-2 text-xs pt-1">
                    <MessageSquare className="w-3.5 h-3.5 text-purple-500 mt-0.5 flex-shrink-0" />
                    <div className="flex-1">
                      <span className="text-gray-500">Reason: </span>
                      <span className="text-gray-700 italic">
                        {project.dedicationReason}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          <div className="flex items-center justify-end gap-2 pt-2">
            <Button
              variant="outline"
              size="icon"
              asChild
              className="h-9 w-9 border-gray-200 hover:bg-gray-50"
            >
              <Link href={`/profile/${project.userId}/projects/${project.id}`}>
                <ExternalLink className="h-4 w-4" />
              </Link>
            </Button>
            {isOwnProfile && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  className="h-9 w-9 border-gray-200 hover:bg-gray-50"
                  asChild
                >
                  <Link
                    href={`/profile/${project.userId}/projects/${project.id}/edit`}
                  >
                    <Edit className="h-4 w-4" />
                  </Link>
                </Button>
                <DeleteProjectAlert projectId={project.id} />
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
