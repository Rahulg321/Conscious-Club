import AddChallengeForm from "@/components/forms/add-challenge-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";
import React, { Suspense } from "react";
import { Loader2 } from "lucide-react";

export const metadata = {
  title: "Add Challenge",
  description: "Add Challenge page",
};

const AddChallengePage = () => {
  return (
    <div className="block-space big-container">
      <Suspense
        fallback={
          <div className="flex items-center justify-center py-12">
            <Loader2 className="size-10 animate-spin" />
          </div>
        }
      >
        <AddChallengeContent />
      </Suspense>
    </div>
  );
};

async function AddChallengeContent() {
  const session = await requireAdmin();
  return (
    <>
      <div>
        <Button asChild>
          <Link href="/admin/challenges">Back to Challenges</Link>
        </Button>
      </div>

      <AddChallengeForm />
    </>
  );
}

export default AddChallengePage;

