import { auth } from "@/auth";
import { redirect } from "next/navigation";
import React from "react";

const PlaygroundPage = async () => {
  const userSession = await auth();

  console.log("userSession", userSession);

  if (!userSession) redirect("/login");

  return <div>PlaygroundPage</div>;
};

export default PlaygroundPage;
