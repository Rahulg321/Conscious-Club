import Link from "next/link";
import { Button } from "./ui/button";
import DeleteProjectAlert from "./buttons/delete-project-alert";
import Image from "next/image";
import { getPreviewMedia } from "@/lib/utils";
import { isVideo } from "@/lib/utils";
import { Sparkles, Eye } from "lucide-react";

export default function ProjectCard({
  project,
  creatorName,
  collaboratorName,
}: {
  project: any;
  creatorName?: string;
  collaboratorName?: string;
}) {
  const previewMedia = getPreviewMedia(project.media);
  const isPreviewVideo = previewMedia ? isVideo(previewMedia) : false;
  const isMashup = project.isMashup && creatorName && collaboratorName;

  return (
    <div className="group w-full">
      <div className="h-full bg-white rounded-2xl border border-gray-200 overflow-hidden">
        {/* Media Container */}
        <div className="aspect-video relative bg-gradient-to-br from-gray-50 to-gray-100 overflow-hidden">
          {previewMedia && !isPreviewVideo ? (
            <Image
              src={previewMedia}
              alt={project.name}
              fill
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
            />
          ) : previewMedia ? (
            <video
              src={previewMedia}
              className="w-full h-full object-cover"
              muted
              loop
              playsInline
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

          {/* Mashup Badge */}
          {isMashup && (
            <div className="absolute top-3 left-3">
              <div className="bg-purple-500/90 backdrop-blur-sm text-white px-2 py-1 rounded-lg flex items-center gap-1 text-xs font-medium">
                <Sparkles className="w-3 h-3" />
                Mashup
              </div>
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-6 space-y-4">
          {/* Title */}
          <h4 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {project.name}
          </h4>

          {/* Mashup Collaborators */}
          {isMashup && (
            <div className="flex items-center gap-2 text-sm text-gray-600 bg-purple-50 px-3 py-2 rounded-lg">
              <Sparkles className="w-4 h-4 text-purple-500" />
              <span className="font-medium">
                {creatorName} <span className="text-purple-500 mx-1">×</span>{" "}
                {collaboratorName}
              </span>
            </div>
          )}

          {/* Description */}
          <p className="text-sm text-gray-600 line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {project.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <Button
              variant="outline"
              asChild
              className="flex-1 border-gray-200"
            >
              <Link href={`/profile/${project.userId}/projects/${project.id}`}>
                View Project
              </Link>
            </Button>
            <DeleteProjectAlert projectId={project.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
