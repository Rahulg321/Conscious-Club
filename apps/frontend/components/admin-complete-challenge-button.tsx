"use client";

import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { completeChallenge } from "@/lib/actions/complete-challenge";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { CheckCircle2, Loader2 } from "lucide-react";

export default function AdminCompleteChallengeButton({
  challengeId,
  challengeName,
  isCompleted,
}: {
  challengeId: string;
  challengeName: string;
  isCompleted: boolean;
}) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const handleComplete = () => {
    if (!challengeId) return;
    startTransition(async () => {
      const response = await completeChallenge(challengeId);
      if (response.success) {
        toast.success(response.message || "Challenge completed successfully");
        router.refresh();
      } else {
        toast.error(response.message || "Failed to complete challenge");
      }
    });
  };

  if (isCompleted) {
    return (
      <Button variant="outline" disabled>
        <CheckCircle2 className="mr-2 h-4 w-4" />
        Completed
      </Button>
    );
  }

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" disabled={isPending}>
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Completing...
            </>
          ) : (
            "Complete Challenge"
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Complete Challenge</AlertDialogTitle>
          <AlertDialogDescription>
            Are you sure you want to complete "{challengeName}"? This will:
            <ul className="list-disc list-inside mt-2 space-y-1">
              <li>Mark the challenge as completed</li>
              <li>Close entries (no new submissions will be accepted)</li>
              <li>Set the challenge as inactive</li>
            </ul>
            <p className="mt-2 text-sm font-semibold">
              This action cannot be undone.
            </p>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={handleComplete}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Completing...
              </>
            ) : (
              "Complete Challenge"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

