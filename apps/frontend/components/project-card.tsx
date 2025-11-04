import Link from "next/link";
import { Button } from "./ui/button";
import DeleteProjectAlert from "./buttons/delete-project-alert";
import Image from "next/image";
import { Sparkles, Eye, ExternalLink, Edit } from "lucide-react";

export default function ProjectCard({
  project,
  creatorName,
  collaboratorName,
  isOwnProfile = false,
}: {
  project: any;
  creatorName?: string;
  collaboratorName?: string;
  isOwnProfile?: boolean;
}) {
  // Use coverImage if available, otherwise fall back to first media item
  const coverImage = project.coverImage || (project.media && project.media.length > 0 ? project.media[0] : null);
  const isMashup = project.isMashup && creatorName && collaboratorName;

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

          {isMashup && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-medium">
                {creatorName} <span className="text-purple-500 mx-1">×</span>{" "}
                {collaboratorName}
              </span>
            </div>
          )}

          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {project.description}
          </p>

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
