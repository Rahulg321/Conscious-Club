import Link from "next/link";
import { Button } from "./ui/button";

export default function ProjectCard({ project }: { project: any }) {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex-shrink-0 w-80">
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

        <Button variant="outline" asChild>
          <Link href={`/profile/${project.userId}/projects/${project.id}`}>
            View
          </Link>
        </Button>
      </div>
    </div>
  );
}
