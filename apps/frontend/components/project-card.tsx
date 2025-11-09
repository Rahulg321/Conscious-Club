import Link from "next/link";
import { Button } from "./ui/button";
import DeleteProjectAlert from "./buttons/delete-project-alert";
import Image from "next/image";
import {
  // Sparkles,
  Eye,
  ExternalLink,
  Edit,
  User,
  // Heart,
  // Building2,
  // Flag,
  // MessageSquare,
  Shuffle,
} from "lucide-react";
import { filterMaping } from "./forms/onboarding/config";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { BorderBeam } from "@/components/ui/border-beam";

type UserInfo = {
  id?: string | null;
  name?: string | null;
  discipline?: string | null;
  role?: string | null;
  image?: string | null;
};

type CollaboratorInfo = {
  id?: string | null;
  name?: string | null;
  image?: string | null;
  role?: string | null;
  discipline?: string | null;
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
  collaboratorInfo?: CollaboratorInfo;
  isOwnProfile?: boolean;
}) {
  // Use coverImage if available, otherwise fall back to first media item
  const coverImage =
    project?.coverImage ||
    (project?.media && project?.media?.length > 0 ? project?.media[0] : null);
  const isMashup = project?.isMashup && creatorName && collaboratorName;
  const color = filterMaping.find(
    (item) => item.value === project?.tag || ""
  )?.color;

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
    <div className="group w-full ">
      <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden pb-4 relative">
        <div className="aspect-video relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden px-4 py-2 rounded-lg">
          {coverImage ? (
            <Image
              src={coverImage}
              alt={project?.name || ""}
              fill
              className="object-contain bg-white pt-4 rounded-lg"
              // sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
            <div className="absolute top-3 right-3">
              <div className="bg-purple-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
                <Shuffle className="w-3 h-3" />
              </div>
            </div>
          )}
        </div>

        <div className="px-4 py-2 mb-2">
          <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {project?.name || ""}
          </h4>
          <div className="text-sm text-gray-600 line-clamp leading-relaxed">
            {project?.description || ""}
          </div>

          {/* User Information Section */}
          {isMashup && creatorInfo && collaboratorInfo ? (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pt-4">
                <Link
                  href={`/profile/${creatorInfo?.id || ""}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0"
                >
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage
                      src={creatorInfo?.image || "/designer-headshot.png"}
                      alt={creatorInfo?.name || "Creator"}
                    />
                    <AvatarFallback
                      className={`border-2 text-xs ${filterMaping.find((item) => item.value === creatorInfo?.role)?.border}`}
                    >
                      {(creatorInfo?.name || "C").slice(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-card-foreground truncate">
                      {creatorInfo?.name || "Creator"}
                    </div>
                    {creatorInfo?.role && (
                      <div
                        className={`text-xs ${filterMaping.find((item) => item.value === creatorInfo?.role)?.text}`}
                      >
                        {creatorInfo?.role}
                      </div>
                    )}
                  </div>
                </Link>
                <Shuffle className="w-4 h-4 text-purple-500" />
                <Link
                  href={`/profile/${collaboratorInfo?.id || ""}`}
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity flex-1 min-w-0"
                >
                  <Avatar className="w-6 h-6 flex-shrink-0">
                    <AvatarImage
                      src={collaboratorInfo?.image || "/designer-headshot.png"}
                      alt={collaboratorInfo?.name || "Collaborator"}
                    />
                    <AvatarFallback className="text-xs">
                      {(collaboratorInfo?.name || "C")
                        .slice(0, 2)
                        .toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-medium text-card-foreground truncate">
                      {collaboratorInfo?.name || "Collaborator"}
                    </div>
                    {collaboratorInfo?.role && (
                      <div
                        className={`text-xs  ${filterMaping.find((item) => item.value === collaboratorInfo?.role)?.text}`}
                      >
                        {collaboratorInfo?.role}
                      </div>
                    )}
                  </div>
                </Link>
              </div>
            </div>
          ) : creatorInfo && !isMashup ? (
            <div className="space-y-2">
              {/* <Link
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
                  {creatorInfo?.discipline && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full ${getDisciplineColor(creatorInfo?.discipline).color}`}
                    >
                      {creatorInfo?.discipline}
                    </span>
                  )}
                  {creatorInfo?.role && (
                    <span
                      className={`px-2 py-0.5 text-xs font-medium rounded-full border-2 ${getDisciplineColor(creatorInfo?.discipline).border} ${getDisciplineColor(creatorInfo?.discipline).text}`}
                    >
                      {creatorInfo?.role}
                    </span>
                  )}
                </div>
              </Link> */}
            </div>
          ) : null}
        </div>
        <div className="flex items-center justify-end gap-2 px-4">
          <Button
            variant="outline"
            size="icon"
            asChild
            className="h-9 w-9 border-gray-200 hover:bg-gray-50"
          >
            <Link href={`/profile/${project?.userId}/projects/${project?.id}`}>
              <ExternalLink className="h-4 w-4" />
            </Link>
          </Button>
          {isOwnProfile && (
            <>
              <Button
                variant="outline"
                size="icon"
                className="h-9 w-9 hover:bg-gray-50 text-blue-500 border-blue-500"
                asChild
              >
                <Link
                  href={`/profile/${project?.userId}/projects/${project?.id}/edit`}
                >
                  <Edit className="h-4 w-4" />
                </Link>
              </Button>
              <DeleteProjectAlert projectId={project?.id || ""} />
            </>
          )}
        </div>
        {isMashup ? (
          <BorderBeam duration={6} size={400} />
        ) : (
          <BorderBeam duration={6} size={400} className={color} />
        )}
      </div>
    </div>
  );
}
