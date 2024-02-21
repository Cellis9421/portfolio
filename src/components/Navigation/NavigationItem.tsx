/**
 * @name NavigationItem
 * @description A single item in the navigation consisting of an icon, label, and href
 * @example <NavigationItem icon={<HomeIcon className="h-12 w-12" />} label="Home" href="#" />
 */

import { twMerge } from "tailwind-merge";
import INavigationItem from "../../../@types/INavigationItem";
import { useMemo } from "react";
import Link from "next/link";

export default function NavigationItem({
  navigationItem,
  className,
}: {
  navigationItem: INavigationItem;
  className?: string;
}) {
  const { icon, label, href } = navigationItem || {};
  const classes = useMemo(
    () =>
      twMerge(
        "flex md:flex-col items-center space-x-8 space-y-2 md:space-x-0 group",
        className
      ),
    [className]
  );
  return (
    <Link href={href || "#"} className={classes}>
      <span className="shrink-0">{icon}</span>
      <span className="font-bold text-[2rem] md:text-xl border-b-0 border-black pb-1 group-hover:border-b-4 border-double">
        {label}
      </span>{" "}
      {/* Add hover:underline class */}
    </Link>
  );
}
