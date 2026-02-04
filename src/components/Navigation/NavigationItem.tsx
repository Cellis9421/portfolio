/**
 * @name NavigationItem
 * @description A single item in the navigation consisting of an icon (by iconKey), label, and href
 */

import {
  AcademicCapIcon,
  BriefcaseIcon,
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
  work: BriefcaseIcon,
  education: AcademicCapIcon,
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
        "flex md:flex-col items-center gap-6 md:gap-2 group text-editor.tag w-[150px] rounded focus-ring min-h-[44px] md:min-h-0 justify-center md:justify-start",
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
        "transition-colors duration-normal motion-reduce:transition-none"
      ),
    [isActive]
  );
  return (
    <Link href={href || "#"} className={classes}>
      <span className={iconClasses}>
        {IconComponent ? <IconComponent className={NAV_ICON_CLASS} /> : null}
      </span>
      <span className="font-bold text-[2rem] md:text-xl transition-all duration-500 whitespace-nowrap">
        <HTMLText componentName={label} componentNameClassNames={"group-hover:px-1 group-hover:scale-105 motion-reduce:scale-100 transition-transform duration-normal motion-reduce:transition-none"} />
      </span>
      {/* Add hover:underline class */}
    </Link>
  );
}
