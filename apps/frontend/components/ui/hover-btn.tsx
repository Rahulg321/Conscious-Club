"use client";
import React, { useState } from "react";

import { motion } from "motion/react";
import { cn } from "../../lib/utils";

// type Direction = "TOP" | "LEFT" | "BOTTOM" | "RIGHT";

export default function HoverBorder({
  children,
  containerClassName,
  className,
  as: Tag = "button",
  duration = 1,
  // clockwise = true,
  highlightColor,
  ...props
}: React.PropsWithChildren<
  {
    as?: React.ElementType;
    containerClassName?: string;
    className?: string;
    duration?: number;
    // clockwise?: boolean;
    highlightColor?: string;
  } & React.HTMLAttributes<HTMLElement>
>) {
  const [hovered, setHovered] = useState<boolean>(false);

  const movingMap: string = "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%,  rgba(255, 255, 255, 0) 100%)";

  const highlight = `radial-gradient(75% 181.15942028985506% at 50% 50%, ${
    highlightColor ? highlightColor : "#3275F8"
  } 0%, rgba(255, 255, 255, 0) 100%)`;

  return (
    <Tag
      onMouseEnter={() => {
        setHovered(true);
      }}
      onMouseLeave={() => setHovered(false)}
      className={cn(
        "relative flex rounded-full border border-zinc-400 content-center  hover:bg-blue-500/10 transition duration-500 dark:bg-white/20 items-center flex-col flex-nowrap gap-10 h-min justify-center overflow-visible p-px decoration-clone w-fit",
        containerClassName
      )}
      {...props}
    >
      <div className={cn("w-auto z-10 p-1 rounded-[inherit] text-sm", className)}>{children}</div>
      <motion.div
        className={cn("flex-none inset-0 overflow-hidden absolute z-0 rounded-[inherit]")}
        style={{
          filter: "blur(2px)",
          position: "absolute",
          width: "100%",
          height: "100%",
        }}
        animate={{
          background: hovered ? [movingMap, highlight] : "radial-gradient(20.7% 50% at 50% 0%, hsl(0, 0%, 100%) 0%,  rgba(255, 255, 255, 0) 100%)",
        }}
        transition={{ ease: "linear", duration: duration ?? 1 }}
      />
      <div className="bg-blue-400/10 hover:bg-none absolute z-1 flex-none inset-[2px] rounded-[100px]" />
    </Tag>
  );
}
