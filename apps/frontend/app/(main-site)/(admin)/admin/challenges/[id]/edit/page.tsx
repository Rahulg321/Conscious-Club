import EditChallengeForm from "@/components/forms/edit-challenge-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin, getChallengeById } from "@/lib/queries";
import { notFound } from "next/navigation";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Edit Challenge",
  description: "Edit Challenge page",
};

const EditChallengePage = ({
  params,
}: {
  params: Promise<{ id: string }>;
}) => {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <EditChallengeContent params={params} />
      </Suspense>
    </div>
  );
};

async function EditChallengeContent({
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

  return (
    <>
      <div>
        <Button asChild variant="outline">
          <Link href={`/admin/challenges/${id}`}>Back to Challenge</Link>
        </Button>
      </div>

      <EditChallengeForm challenge={challenge} />
    </>
  );
}

export default EditChallengePage;

