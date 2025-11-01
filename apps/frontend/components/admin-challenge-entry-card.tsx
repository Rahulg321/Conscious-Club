import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import { User } from "lucide-react";
import Link from "next/link";

interface ChallengeEntryWithUser {
  id: string;
  caption: string;
  media: string[];
  createdAt: Date;
  userId: string;
  userName: string | null;
  userImage: string | null;
}

export default function AdminChallengeEntryCard({
  entry,
}: {
  entry: ChallengeEntryWithUser;
}) {
  return (
    <Card>
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* User Avatar */}
          <Link href={`/profile/${entry.userId}`}>
            <Avatar className="w-12 h-12 cursor-pointer hover:ring-2 ring-primary transition-all">
              <AvatarImage src={entry.userImage || undefined} alt={entry.userName || "User"} />
              <AvatarFallback>
                {entry.userName ? (
                  entry.userName.charAt(0).toUpperCase()
                ) : (
                  <User className="h-6 w-6" />
                )}
              </AvatarFallback>
            </Avatar>
          </Link>

          {/* Entry Content */}
          <div className="flex-1 min-w-0 space-y-3">
            {/* User Info */}
            <div className="flex items-center gap-2">
              <Link
                href={`/profile/${entry.userId}`}
                className="font-semibold hover:underline"
              >
                {entry.userName || "Anonymous User"}
              </Link>
              <span className="text-xs text-muted-foreground">
                {formatDistanceToNow(new Date(entry.createdAt), {
                  addSuffix: true,
                })}
              </span>
            </div>

            {/* Caption */}
            {entry.caption && (
              <p className="text-sm text-foreground whitespace-pre-wrap break-words">
                {entry.caption}
              </p>
            )}

            {/* Media */}
            {entry.media && entry.media.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                {entry.media.map((mediaUrl, index) => (
                  <div
                    key={index}
                    className="relative aspect-video w-full rounded-lg overflow-hidden bg-muted"
                  >
                    <Image
                      src={mediaUrl}
                      alt={`Entry media ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 640px) 100vw, 50vw"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

