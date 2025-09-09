// Project Card Component

export default function DiscoverProjectCard({
  projectCoverImage,
  projectName,
  projectDescription,
  tagName,
}: {
  projectCoverImage: string;
  projectName: string;
  projectDescription: string;
  tagName: string;
}) {
  return (
    <div className="group bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow duration-200 flex-shrink-0 w-80">
      <div className="aspect-video bg-gray-100 overflow-hidden">
        <img
          src={projectCoverImage}
          alt={projectName}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
      </div>
      <div className="p-4">
        <h4 className="font-medium text-[#171c21] mb-2 line-clamp-1">
          {projectName}
        </h4>
        <div className="mb-2">
          <span className="inline-block px-2 py-1 text-xs font-medium text-blue-700 bg-blue-100 rounded-full">
            {tagName}
          </span>
        </div>
        <p className="text-sm text-[#667085] line-clamp-2">
          {projectDescription}
        </p>
      </div>
    </div>
  );
}
