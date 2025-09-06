import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const userSession = await auth();

  if (!userSession) {
    redirect("/login");
  } else {
    redirect(`/profile/${userSession.user.id}`);
  }
};

export default page;
