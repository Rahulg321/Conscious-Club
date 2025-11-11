import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const ProfilePage = async () => {
  const userSession = await auth();
  if (!userSession) redirect("/login");
  return redirect(`/profile/${userSession.user.id}`);
};

export default ProfilePage;
