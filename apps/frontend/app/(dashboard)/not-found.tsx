import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";

export default async function NotFound() {
  const userSession = await auth();

  if (!userSession?.user?.id) {
    redirect("/login");
  }

  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href={`/profile/${userSession?.user?.id}`}>Go to Profile</Link>
    </div>
  );
}
