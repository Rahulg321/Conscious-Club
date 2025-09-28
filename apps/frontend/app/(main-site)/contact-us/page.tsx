import React from "react";
import { ContactUsForm } from "@/components/forms/contact-us-form";

export const metadata = {
  title: "Contact Us",
  description: "Contact Us",
};

const page = () => {
  return (
    <div className="block-space narrow-container">
      <ContactUsForm />
    </div>
  );
};

export default page;
