import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Heart, MapPin, Trophy } from "lucide-react";
import { UserProfile } from "./forms/onboarding/types";

export default function ProfileCard({
  userProfile,
}: {
  userProfile: UserProfile;
}) {
  return (
    <Card className="w-full max-w-4xl mx-auto p-6 bg-white shadow-lg">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-4">
        <div className="flex items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage
              src={userProfile.image || "/designer-headshot.png"}
              alt={userProfile.name || "User"}
            />
            <AvatarFallback>RD</AvatarFallback>
          </Avatar>
          <div>
            <div className="flex items-center gap-3 mb-1">
              <h1 className="text-2xl font-bold text-gray-900">
                {userProfile.name || "User"}
              </h1>
              <Badge className="bg-green-500 text-white hover:bg-green-600 text-xs px-2 py-1">
                {userProfile.discipline || "Discipline"}
              </Badge>
            </div>
            <div className="flex items-center gap-1 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {userProfile.location || "Location"}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {userProfile.projects.length > 0 ? (
          userProfile.projects.map((item) => (
            <div key={item.id} className="group cursor-pointer">
              <div className="relative overflow-hidden rounded-lg mb-3">
                <img
                  src={item.coverImage || "/placeholder.svg"}
                  alt={item.name}
                  className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {item.name}
                  </h3>
                  <p className="text-sm text-gray-600">{item.description}</p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div>
            <span>No Projects Found</span>
          </div>
        )}
      </div>
    </Card>
  );
}
