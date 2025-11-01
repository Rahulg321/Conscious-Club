import AddChallengeForm from "@/components/forms/add-challenge-form";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { requireAdmin } from "@/lib/queries";
import React from "react";

export const metadata = {
  title: "Add Challenge",
  description: "Add Challenge page",
};

const AddChallengePage = async () => {
  const session = await requireAdmin();
  return (
    <div className="block-space big-container">
      <div>
        <Button asChild>
          <Link href="/admin/challenges">Back to Challenges</Link>
        </Button>
      </div>

      <AddChallengeForm />
    </div>
  );
};

export default AddChallengePage;

