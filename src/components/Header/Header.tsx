import React, { useMemo } from "react";
import { twMerge } from "tailwind-merge";

const defaultClasses = {
  h1: "text-4xl font-black lg:text-5xl",
  h2: "text-2xl font-black",
  h3: "text-lg font-bold",
  h4: "font-semibold",
  h5: "text-xs font-semibold",
  h6: "text-2xs font-semibold",
};

export default function Header({
  as: HTag = "h1",
  className = "",
  children,
  id,
}: {
  as?: "h1" | "h2" | "h3" | "h4" | "h5" | "h6";
  className?: string;
  children: React.ReactNode;
  id?: string;
}) {
  const classes = useMemo(
    () => twMerge("text-white", defaultClasses[HTag], className),
    [HTag, className]
  );
  return (
    <HTag id={id || ""} className={classes}>
      {children}
    </HTag>
  );
}
