import { auth } from "@/auth";
import Link from "next/link";
import { redirect } from "next/navigation";
import React from "react";

const NotFoundPage = () => {
  console.log("Not Found Page");
  console.log("Not Found Page");
  console.log("Not Found Page");
  console.log("Not Found Page");
  console.log("Not Found Page");

  return (
    <div>
      <h2>Not Found</h2>
      <p>Could not find requested resource</p>
      <Link href="/">Return Home</Link>
    </div>
  );
};

export default NotFoundPage;
