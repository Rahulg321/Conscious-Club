import React, { Suspense } from "react";
import { requireAdmin, getAllChallengesAdmin } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import AdminChallengeCard from "@/components/admin-challenge-card";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Admin Challenges",
  description: "Admin challenges page",
};

export default function AdminChallengesPage() {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <AdminChallengesContent />
      </Suspense>
    </div>
  );
}

async function AdminChallengesContent() {
  const session = await requireAdmin();
  const challenges = (await getAllChallengesAdmin()) ?? [];

  return (
    <>
      <div className="mb-4 flex flex-wrap items-center gap-2">
        <Button asChild>
          <Link href="/admin">Admin</Link>
        </Button>

        <Button asChild>
          <Link href="/admin/challenges/add">Add Challenge</Link>
        </Button>
      </div>

      <div className="mb-6">
        <h1 className="text-3xl font-bold">All Challenges</h1>
        <p className="text-muted-foreground mt-2">
          Manage and view all challenges in the system
        </p>
      </div>

      {challenges.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">
            No challenges yet. Create your first challenge!
          </p>
          <Button asChild>
            <Link href="/admin/challenges/add">Add Challenge</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 ">
          {challenges.map((challenge) => (
            <AdminChallengeCard
              key={challenge.id}
              id={challenge.id}
              name={challenge.name}
              slug={challenge.slug}
              bannerImage={challenge.bannerImage}
              deadline={challenge.deadline}
              isActive={challenge.isActive}
              isCompleted={challenge.isCompleted || false}
              participantsCount={challenge.participantsCount}
            />
          ))}
        </div>
      )}
    </>
  );
}
