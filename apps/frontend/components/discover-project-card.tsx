// Project Card Component
import Image from "next/image";
import LikeButton from "./like-button";

export default function DiscoverProjectCard({
  projectId,
  projectCoverImage,
  projectName,
  projectDescription,
  tagName,
  likeCount = 0,
  isLiked = false,
}: {
  projectId: string;
  projectCoverImage: string;
  projectName: string;
  projectDescription: string;
  tagName: string;
  likeCount?: number;
  isLiked?: boolean;
}) {
  return (
    <div className="group bg-card rounded-lg border border-border overflow-hidden hover:shadow-md transition-shadow duration-200 ">
      <div className="aspect-video bg-muted overflow-hidden relative">
        <Image
          src={projectCoverImage}
          alt={projectName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h4 className="font-medium text-card-foreground line-clamp-1 flex-1">
            {projectName}
          </h4>
          <LikeButton
            projectId={projectId}
            initialLikeCount={likeCount}
            initialIsLiked={isLiked}
          />
        </div>
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-primary bg-primary/10 rounded-full">
            {tagName}
          </span>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">
          {projectDescription}
        </p>
      </div>
    </div>
  );
}
