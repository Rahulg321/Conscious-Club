import React, { Suspense } from "react";
import {
  requireAdmin,
  getChallengeById,
  getChallengeEntries,
} from "@/lib/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { notFound } from "next/navigation";
import Image from "next/image";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, Users, Trophy, Clock, Loader2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import AdminChallengeEntryCard from "@/components/admin-challenge-entry-card";
import { Separator } from "@/components/ui/separator";
import AdminCompleteChallengeButton from "@/components/admin-complete-challenge-button";

export const metadata = {
  title: "Challenge Details",
  description: "View challenge details",
};

export default function ChallengeDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <ChallengeDetailContent params={params} />
      </Suspense>
    </div>
  );
}

async function ChallengeDetailContent({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await requireAdmin();
  const { id } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  const entries = await getChallengeEntries(id);

  const deadline = new Date(challenge.deadline);
  const isDeadlinePassed = deadline < new Date();
  const timeRemaining = formatDistanceToNow(deadline, { addSuffix: true });

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button asChild variant="outline">
          <Link href="/admin/challenges">Back to Challenges</Link>
        </Button>
        <Button asChild>
          <Link href={`/admin/challenges/${id}/edit`}>Edit Challenge</Link>
        </Button>
        <AdminCompleteChallengeButton
          challengeId={id}
          challengeName={challenge.name}
          isCompleted={challenge.isCompleted || false}
        />
      </div>

      <div className="max-w-4xl mx-auto space-y-6">
        {/* Challenge Banner */}
        <div className="relative aspect-video w-full rounded-lg overflow-hidden">
          <Image
            src={challenge.bannerImage}
            alt={challenge.name}
            fill
            className="object-cover"
          />
        </div>

        {/* Challenge Info */}
        <div className="space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-4xl font-bold">{challenge.name}</h1>
              {challenge.isCompleted ? (
                <Badge variant="default" className="bg-blue-500">
                  Completed
                </Badge>
              ) : challenge.isActive ? (
                <Badge variant="default" className="bg-green-500">
                  Active
                </Badge>
              ) : (
                <Badge variant="secondary">Inactive</Badge>
              )}
              {isDeadlinePassed && !challenge.isCompleted && (
                <Badge variant="destructive">Expired</Badge>
              )}
            </div>
            {challenge.description && (
              <p className="text-muted-foreground mt-2 text-lg">
                {challenge.description}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Deadline
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {isDeadlinePassed ? (
                    <span className="text-destructive">Expired</span>
                  ) : (
                    <span>{timeRemaining}</span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {deadline.toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Participants
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {challenge.participantsCount}
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {challenge.participantsCount === 1
                    ? "participant"
                    : "participants"}
                </p>
              </CardContent>
            </Card>

            {(challenge.prizePool && challenge.prizePool > 0) ||
            challenge.reward ? (
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Trophy className="h-4 w-4" />
                    Reward
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {challenge.prizePool && challenge.prizePool > 0
                      ? `$${challenge.prizePool.toLocaleString()}`
                      : challenge.reward}
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">
                    Prize pool
                  </p>
                </CardContent>
              </Card>
            ) : null}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Challenge Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div>
                <span className="font-semibold">Slug:</span>{" "}
                <code className="text-sm bg-muted px-2 py-1 rounded">
                  {challenge.slug}
                </code>
              </div>
              <div>
                <span className="font-semibold">Created:</span>{" "}
                {new Date(challenge.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              <div>
                <span className="font-semibold">Last Updated:</span>{" "}
                {new Date(challenge.updatedAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </div>
              {challenge.isCompleted && challenge.completedAt && (
                <div>
                  <span className="font-semibold">Completed:</span>{" "}
                  {new Date(challenge.completedAt).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Challenge Entries Section */}
          <Card>
            <CardHeader>
              <CardTitle>Challenge Entries</CardTitle>
              <CardDescription>
                {entries.length === 0
                  ? "No entries submitted yet"
                  : `${entries.length} ${entries.length === 1 ? "entry" : "entries"} submitted`}
              </CardDescription>
            </CardHeader>
            <CardContent>
              {entries.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Users className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p>No entries have been submitted for this challenge yet.</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {entries.map((entry, index) => (
                    <div key={entry.id}>
                      <AdminChallengeEntryCard entry={entry} />
                      {index < entries.length - 1 && (
                        <Separator className="mt-4" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
