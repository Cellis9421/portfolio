/**
 * @name NavigationItem
 * @description A single item in the navigation consisting of an icon (by iconKey), label, and href
 */

import {
  FolderIcon,
  IdentificationIcon,
  NewspaperIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ComponentType } from "react";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import INavigationItem from "../../../@types/INavigationItem";
import HTMLText from "../HTMLText/HTMLText";

const NAV_ICON_CLASS = "h-14 w-14 md:h-10 md:w-10 shrink-0";

const NAV_ICONS: Record<string, ComponentType<{ className?: string }>> = {
  home: PowerIcon,
  about: UserCircleIcon,
  projects: FolderIcon,
  blog: NewspaperIcon,
  contact: IdentificationIcon,
};

export default function NavigationItem({
  navigationItem,
  className,
}: {
  navigationItem: INavigationItem;
  className?: string;
}) {
  const { iconKey, label, href } = navigationItem || {};
  const IconComponent = iconKey ? NAV_ICONS[iconKey] : null;
  const classes = useMemo(
    () =>
      twMerge(
        "flex md:flex-col items-center space-x-8 space-y-2 md:space-x-0 group text-editor.tag w-[150px]",
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
      <span className={iconClasses}>
        {IconComponent ? <IconComponent className={NAV_ICON_CLASS} /> : null}
      </span>
      <span className="font-bold text-[2rem] md:text-xl transition-all duration-500 whitespace-nowrap">
        <HTMLText componentName={label} componentNameClassNames={"group-hover:px-1 group-hover:scale-105 transition-all duration-400"} />
      </span>
      {/* Add hover:underline class */}
    </Link>
  );
}
