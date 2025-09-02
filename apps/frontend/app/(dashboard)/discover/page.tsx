import { Search, Heart, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

const categories = [
  "Visual Arts & Design",
  "Video & Motion Media",
  "Writing & Storytelling",
  "Performance & Audio",
  "Tech & Digital Media",
];

const projects = [
  {
    id: 1,
    title: "Minimal UI",
    creator: "My best creation",
    category: "Illustration & Graphic Design",
    categoryColor: "bg-green-100 text-green-800",
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1754851539824-5a87c5c7cb86?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 2,
    title: "Zoroto",
    creator: "Best UI Design",
    category: "Video Creation",
    categoryColor: "bg-purple-100 text-purple-800",
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1753695115211-12629cb8d4e9?q=80&w=1400&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 3,
    title: "Final Arc",
    creator: "Best UI Design",
    category: "AI Art",
    categoryColor: "bg-blue-100 text-blue-800",
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1748367138805-c2e3acedc384?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 4,
    title: "Zoroto",
    creator: "Best UI Design",
    category: "Music",
    categoryColor: "bg-orange-100 text-orange-800",
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1754851335870-1c92f9b91022?q=80&w=1932&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 5,
    title: "Zoroto",
    creator: "Best UI Design",
    category: "Copywriting",
    categoryColor: "bg-green-100 text-green-800",
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1755024324097-64832c4d2334?q=80&w=2060&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    id: 6,
    title: "Zoroto",
    creator: "Best UI Design",
    category: "Animation",
    categoryColor: "bg-purple-100 text-purple-800",
    likes: 112,
    image:
      "https://images.unsplash.com/photo-1753074070993-50b8f7f7526d?q=80&w=1332&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

export default function DiscoverPage() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search Creators"
              className="pl-10 bg-gray-50 border-gray-200"
            />
          </div>

          {/* Navigation */}
          <div className="flex items-center space-x-6">
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Projects
            </Button>
            <Button
              variant="ghost"
              className="text-gray-600 hover:text-gray-900"
            >
              Profiles
            </Button>
          </div>
        </div>
      </header>

      {/* Filter Bar */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="max-w-7xl mx-auto flex items-center space-x-6">
          <Button
            variant="ghost"
            size="sm"
            className="text-gray-600 hover:text-gray-900"
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
          </Button>
          {categories.map((category) => (
            <Button
              key={category}
              variant="ghost"
              size="sm"
              className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-semibold text-gray-900">
            Explore Projects
          </h1>
          <span className="text-gray-500">194 projects</span>
        </div>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <Card
              key={project.id}
              className="group hover:shadow-lg transition-shadow duration-200 bg-white border border-gray-200"
            >
              <CardContent className="p-0">
                {/* Project Image */}
                <div className="relative overflow-hidden rounded-t-lg">
                  <img
                    src={project.image || "/placeholder.svg"}
                    alt={project.title}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                </div>

                {/* Project Info */}
                <div className="p-4">
                  <div className="flex items-start justify-between mb-3">
                    <Badge
                      variant="secondary"
                      className={`${project.categoryColor} text-xs font-medium`}
                    >
                      {project.category}
                    </Badge>
                    <div className="flex items-center space-x-1 text-gray-500">
                      <Heart className="h-4 w-4" />
                      <span className="text-sm">{project.likes}</span>
                    </div>
                  </div>

                  <h3 className="font-semibold text-gray-900 mb-1">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500">{project.creator}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}
