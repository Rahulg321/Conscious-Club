import React from "react";
// import { getAllChallenges, getCompletedChallenges } from "@/lib/queries";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
// import { ChallengeCard } from "@/components/challenge-card";
// import { Separator } from "@/components/ui/separator";
// import { AuroraText } from "@/components/aura-text";
import { SparklesText } from "@/components/ui/sparkles-text";

export const metadata = {
  title: "Challenges",
  description:
    "Participate in exciting challenges, showcase your creativity, and compete for amazing rewards on ConsciousClub.",
};

const page = async () => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  }

  // const challenges = await getAllChallenges();
  // const completedChallenges = await getCompletedChallenges();

  return (
    <div className="bg-[url(/bg-cs.jpeg)] bg-cover bg-center h-screen bg-blur-3xl flex items-center justify-center">
      <div className="text-9xl md:text-[200px] font-bold p-8 font-caveat bg-white w-full h-full m-16 flex items-center justify-center">
        <SparklesText className="text-center">Coming Soon</SparklesText>
      </div>

      {/* <p className="text-gray-600">
          Participate in exciting challenges, showcase your creativity, and
          compete for amazing rewards. Submit your entries and join the
          community!
        </p> */}

      {/* Active Challenges Section */}
      {/* <div className="mb-12">
        <h2 className="text-2xl font-bold mb-6">Active Challenges</h2>
        {!challenges || challenges.length === 0 ? (
          <div className="text-center py-12 border rounded-lg">
            <p className="text-muted-foreground">
              No active challenges at the moment. Check back soon for new
              challenges!
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {challenges.map((challenge) => (
              <ChallengeCard
                key={challenge.id}
                id={challenge.id}
                slug={challenge.slug}
                name={challenge.name}
                bannerImage={challenge.bannerImage}
                description={challenge.description}
                deadline={challenge.deadline}
                participantsCount={challenge.participantsCount}
                prizePool={challenge.prizePool}
                reward={challenge.reward}
                isCompleted={false}
              />
            ))}
          </div>
        )}
      </div> */}

      {/* Completed Challenges History Section */}
      {/* {completedChallenges && completedChallenges.length > 0 && (
        <>
          <Separator className="my-12" />
          <div>
            <h2 className="text-2xl font-bold mb-6">Challenge History</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedChallenges.map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  id={challenge.id}
                  slug={challenge.slug}
                  name={challenge.name}
                  bannerImage={challenge.bannerImage}
                  description={challenge.description}
                  deadline={challenge.deadline}
                  participantsCount={challenge.participantsCount}
                  prizePool={challenge.prizePool}
                  reward={challenge.reward}
                  isCompleted={true}
                />
              ))}
            </div>
          </div>
        </>
      )} */}
    </div>
  );
};

export default page;
