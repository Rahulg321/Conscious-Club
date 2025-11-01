import EditChallengeForm from "@/components/forms/edit-challenge-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin, getChallengeById } from "@/lib/queries";
import { notFound } from "next/navigation";
import React from "react";

export const metadata = {
  title: "Edit Challenge",
  description: "Edit Challenge page",
};

const EditChallengePage = async ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  const session = await requireAdmin();
  const { id } = await params;
  const challenge = await getChallengeById(id);

  if (!challenge) {
    notFound();
  }

  return (
    <div className="block-space big-container">
      <div>
        <Button asChild variant="outline">
          <Link href={`/admin/challenges/${id}`}>Back to Challenge</Link>
        </Button>
      </div>

      <EditChallengeForm challenge={challenge} />
    </div>
  );
};

export default EditChallengePage;

