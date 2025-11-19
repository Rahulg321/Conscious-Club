"use client";

import Image from "next/image";
import { useTransition } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";
import { adminDeleteChallenge } from "@/lib/actions/admin-delete-challenge";
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
import { Trash, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function AdminChallengeCard({
  id,
  name,
  slug,
  bannerImage,
  deadline,
  isActive,
  isCompleted,
  participantsCount,
}: {
  id: string;
  name: string;
  slug: string;
  bannerImage: string;
  deadline: Date;
  isActive: boolean;
  isCompleted?: boolean;
  participantsCount: number;
}) {
  const deadlineDate = new Date(deadline);
  const isExpired = deadlineDate < new Date();
  // Calculate time remaining - will use suppressHydrationWarning on render
  const timeRemaining = formatDistanceToNow(deadlineDate, { addSuffix: true });

  return (
    <div className="overflow-hidden rounded-lg border bg-white shadow-sm">
      <div className="relative h-36 w-full bg-muted">
        {bannerImage ? (
          <Image
            src={bannerImage}
            alt={name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted-foreground">
            No banner
          </div>
        )}
        <div className="absolute top-2 right-2 flex gap-2">
          {isCompleted ? (
            <Badge variant="default" className="bg-blue-500">
              Completed
            </Badge>
          ) : isActive ? (
            <Badge variant="default" className="bg-green-500">
              Active
            </Badge>
          ) : (
            <Badge variant="secondary">Inactive</Badge>
          )}
          {isExpired && !isCompleted && (
            <Badge variant="destructive">Expired</Badge>
          )}
        </div>
      </div>
      <div className="p-3 space-y-2">
        <div>
          <div className="text-sm font-semibold leading-tight">{name}</div>
          <div className="text-xs text-muted-foreground">/{slug}</div>
        </div>
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <span>{participantsCount} participants</span>
          <span suppressHydrationWarning>{isExpired ? "Expired" : timeRemaining}</span>
        </div>
        <div className="flex items-center gap-2 pt-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/admin/challenges/${id}`}>View</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/admin/challenges/${id}/edit`}>Edit</Link>
          </Button>
          <ChallengeDeleteAlertDialog id={id} name={name} />
        </div>
      </div>
    </div>
  );
}

const ChallengeDeleteAlertDialog = ({
  id,
  name,
}: {
  id: string;
  name: string;
}) => {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  return (
    <AlertDialog>
      <AlertDialogTrigger asChild>
        <Button variant="destructive" size="sm" disabled={isPending}>
          {isPending ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Trash className="h-4 w-4" />
          )}
        </Button>
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the
            challenge &quot;{name}&quot; and all associated entries. All
            participant submissions will be lost.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            onClick={() => {
              if (!id) return;
              startTransition(async () => {
                const response = await adminDeleteChallenge(id);
                if (response.success) {
                  toast.success("Challenge deleted successfully");
                  router.refresh();
                } else {
                  toast.error(response.message || "Failed to delete challenge");
                }
              });
            }}
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Deleting...
              </>
            ) : (
              "Delete"
            )}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
