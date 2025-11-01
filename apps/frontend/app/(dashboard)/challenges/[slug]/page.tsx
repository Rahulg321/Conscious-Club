import {
  getChallengeBySlug,
  getUserChallengeEntry,
  getChallengeEntries,
} from "@/lib/queries";
import { auth } from "@/auth";
import { redirect, notFound } from "next/navigation";
import { Metadata } from "next";
import Image from "next/image";
import { ChallengeEntryDialog } from "@/components/dialogs/challenge-entry-dialog";
import { ChallengeEntryCard } from "@/components/challenge-entry-card";
import { Calendar, Users, Trophy, Clock, CheckCircle2 } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    return {
      title: "Challenge Not Found",
      description: "The requested challenge could not be found.",
    };
  }

  return {
    title: `${challenge.name} | ConsciousClub`,
    description:
      challenge.description ||
      `Participate in ${challenge.name} challenge on ConsciousClub`,
    openGraph: {
      title: challenge.name,
      description:
        challenge.description ||
        `Participate in ${challenge.name} challenge on ConsciousClub`,
      images: challenge.bannerImage ? [{ url: challenge.bannerImage }] : [],
    },
  };
}

const page = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  const challenge = await getChallengeBySlug(slug);

  if (!challenge) {
    notFound();
  }

  const userEntry = await getUserChallengeEntry(
    challenge.id,
    userSession.user.id
  );
  const entries = await getChallengeEntries(challenge.id);
  const deadline = new Date(challenge.deadline);
  const isDeadlinePassed = deadline < new Date();
  const timeRemaining = formatDistanceToNow(deadline, { addSuffix: true });

  return (
    <div className="block-space-mini big-container">
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
            <h1 className="text-4xl font-bold">{challenge.name}</h1>
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

          <Separator />

          {/* Submit Entry Button */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">Entries</h2>
              <p className="text-muted-foreground mt-1">
                {entries.length} {entries.length === 1 ? "entry" : "entries"}
              </p>
            </div>
            {userEntry ? (
              <Alert className="flex-1 max-w-md">
                <CheckCircle2 className="h-4 w-4" />
                <AlertTitle>Entry Submitted</AlertTitle>
                <AlertDescription>
                  You have already submitted an entry for this challenge.
                </AlertDescription>
              </Alert>
            ) : challenge.isCompleted ? (
              <Alert
                variant="default"
                className="flex-1 max-w-md bg-blue-50 border-blue-200"
              >
                <CheckCircle2 className="h-4 w-4 text-blue-600" />
                <AlertTitle className="text-blue-900">
                  Challenge Completed
                </AlertTitle>
                <AlertDescription className="text-blue-700">
                  This challenge has been completed by the admin. Entries are
                  now closed.
                </AlertDescription>
              </Alert>
            ) : isDeadlinePassed ? (
              <Alert variant="destructive" className="flex-1 max-w-md">
                <Clock className="h-4 w-4" />
                <AlertTitle>Challenge Closed</AlertTitle>
                <AlertDescription>
                  The deadline for this challenge has passed.
                </AlertDescription>
              </Alert>
            ) : !challenge.isActive ? (
              <Alert variant="destructive" className="flex-1 max-w-md">
                <Clock className="h-4 w-4" />
                <AlertTitle>Challenge Inactive</AlertTitle>
                <AlertDescription>
                  This challenge is currently inactive.
                </AlertDescription>
              </Alert>
            ) : (
              <ChallengeEntryDialog
                challengeId={challenge.id}
                userHasEntry={!!userEntry}
                isDeadlinePassed={isDeadlinePassed}
                isChallengeActive={challenge.isActive}
              />
            )}
          </div>

          {/* Entries Grid */}
          {entries.length === 0 ? (
            <div className="text-center py-12 border rounded-lg">
              <p className="text-muted-foreground">
                No entries yet. Be the first to submit!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {entries.map((entry) => (
                <ChallengeEntryCard
                  key={entry.id}
                  id={entry.id}
                  caption={entry.caption}
                  media={entry.media}
                  createdAt={entry.createdAt}
                  userName={entry.userName}
                  userImage={entry.userImage}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default page;
