"use client";

import { useTheme } from "next-themes";
import { Toaster as Sonner, ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <>
      <style dangerouslySetInnerHTML={{
        __html: `
          [data-sonner-toast] {
            --normal-bg: var(--popover);
            --normal-border: var(--border);
          }
          
          [data-sonner-toast] [data-title],
          [data-sonner-toast] [data-description] {
            color: black !important;
          }
          
          [data-sonner-toast] {
            color: black !important;
          }
          
          [data-sonner-toast] * {
            color: black !important;
          }
          
          [data-sonner-toast] [data-icon] {
            color: black !important;
          }
          
          .sonner-toast[data-sonner-toast] [data-title],
          .sonner-toast[data-sonner-toast] [data-description] {
            color: black !important;
          }
        `
      }} />
      <Sonner
        theme={theme as ToasterProps["theme"]}
        className="toaster group"
        style={
          {
            "--normal-bg": "var(--popover)",
            "--normal-text": "black",
            "--normal-border": "var(--border)",
          } as React.CSSProperties
        }
        toastOptions={{
          classNames: {
            toast: "!text-black [&>div]:!text-black [&_*]:!text-black",
            title: "!text-black",
            description: "!text-black",
            actionButton: "!text-black",
            cancelButton: "!text-black",
          },
          style: {
            color: "black",
          },
        }}
        {...props}
      />
    </>
  );
};

export { Toaster };
