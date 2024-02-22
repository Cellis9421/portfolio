/**
 * @name NavigationItem
 * @description A single item in the navigation consisting of an icon, label, and href
 * @example <NavigationItem icon={<HomeIcon className="h-12 w-12" />} label="Home" href="#" />
 */

import { twMerge } from "tailwind-merge";
import INavigationItem from "../../../@types/INavigationItem";
import { useMemo } from "react";
import Link from "next/link";
import HTMLText from "../HTMLText/HTMLText";
import { usePathname } from "next/navigation";

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
        "flex md:flex-col items-center space-x-8 space-y-2 md:space-x-0 group text-editor.tag",
        className
      ),
    [className]
  );
  const pathname = usePathname();
  const isActive = pathname === href;
  const iconClasses = useMemo(
    () =>
      twMerge(
        "shrink-0 group-hover:text-white",
        isActive ? "text-white" : "text-editor.text",
        "transition-colors duration-300"
      ),
    [isActive]
  );
  return (
    <Link href={href || "#"} className={classes}>
      <span className={iconClasses}>{icon}</span>
      <span className="font-bold text-[2rem] md:text-xl group-hover:border-b-2 border-dotted border-editor.propertyValue/0 transition-all duraton-500">
        <HTMLText componentName={label} />
      </span>
      {/* Add hover:underline class */}
    </Link>
  );
}
