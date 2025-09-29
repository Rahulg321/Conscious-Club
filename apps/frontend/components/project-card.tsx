import Link from "next/link";
import { Button } from "./ui/button";
import DeleteProjectAlert from "./buttons/delete-project-alert";
import Image from "next/image";

export default function ProjectCard({ project }: { project: any }) {
  return (
    <div
      className="group bg-[var(--color-card)] rounded-lg border border-[var(--color-border)] overflow-hidden hover:shadow-md transition-shadow duration-200 flex-shrink-0 w-80"
      style={{
        background: "var(--color-card)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="aspect-video relative bg-[var(--color-muted)] overflow-hidden">
        <Image
          src={project.coverImage}
          alt={project.name}
          fill
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <h4
          className="font-medium mb-2 line-clamp-1"
          style={{ color: "var(--color-card-foreground)" }}
        >
          {project.name}
        </h4>
        <p
          className="text-sm line-clamp-2 mb-4"
          style={{ color: "var(--color-muted-foreground)" }}
        >
          {project.description}
        </p>
        <div className="flex items-center gap-2">
          <Button variant="outline" asChild>
            <Link href={`/profile/${project.userId}/projects/${project.id}`}>
              View
            </Link>
          </Button>
          <DeleteProjectAlert projectId={project.id} />
        </div>
      </div>
    </div>
  );
}
