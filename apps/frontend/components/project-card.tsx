import Link from "next/link";
import { Button } from "./ui/button";
import DeleteProjectAlert from "./buttons/delete-project-alert";
import Image from "next/image";
import { getPreviewMedia } from "@/lib/utils";
import { isVideo } from "@/lib/utils";

export default function ProjectCard({ project }: { project: any }) {
  const previewMedia = getPreviewMedia(project.media);
  const isPreviewVideo = previewMedia ? isVideo(previewMedia) : false;

  return (
    <div className="group flex-shrink-0 w-80">
      <div className="h-full bg-[var(--color-card)] rounded-xl border border-[var(--color-border)] overflow-hidden hover:shadow-lg hover:border-[var(--color-primary)]/20 transition-all duration-300">
        {/* Media Container */}
        <div className="aspect-video relative bg-gradient-to-br from-[var(--color-muted)] to-[var(--color-muted)]/60 overflow-hidden">
          {previewMedia && !isPreviewVideo ? (
            <Image
              src={previewMedia}
              alt={project.name}
              fill
              className="object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : previewMedia ? (
            <video
              src={previewMedia}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 ease-out"
              muted
              loop
              playsInline
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
              No media
            </div>
          )}
        </div>

        {/* Content Container */}
        <div className="p-5 space-y-4">
          {/* Title */}
          <h4 className="font-semibold text-lg text-[var(--color-card-foreground)] line-clamp-1 group-hover:text-[var(--color-primary)] transition-colors duration-200">
            {project.name}
          </h4>

          {/* Description */}
          <p className="text-sm text-[var(--color-muted-foreground)] line-clamp-2 leading-relaxed min-h-[2.5rem]">
            {project.description}
          </p>

          {/* Actions */}
          <div className="flex items-center gap-2 pt-1">
            <Button variant="outline" asChild className="flex-1">
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
