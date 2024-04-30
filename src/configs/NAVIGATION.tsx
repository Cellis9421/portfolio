import {
  DocumentIcon,
  EnvelopeIcon,
  FolderIcon,
  HomeIcon,
  IdentificationIcon,
  NewspaperIcon,
  PowerIcon,
  UserCircleIcon,
} from "@heroicons/react/24/outline";
import INavigation from "../../@types/INavigation";

const NAVIGATION: INavigation = {
  items: [
    {
      icon: <PowerIcon className="h-16 w-16 md:h-12 md:w-12" />,
      label: "Home",
      href: "/",
    },
    {
      icon: <UserCircleIcon className="h-16 w-16 md:h-12 md:w-12" />,
      label: "About",
      href: "/about",
    },
    {
      icon: <FolderIcon className="h-16 w-16 md:h-12 md:w-12" />,
      label: "Projects",
      href: "/projects",
    },
    {
      icon: <NewspaperIcon className="h-16 w-16 md:h-12 md:w-12" />,
      label: "Blog",
      href: "/blog",
    },
    {
      icon: <IdentificationIcon className="h-16 w-16 md:h-12 md:w-12" />,
      label: "Contact",
      href: "/contact",
    },
  ],
};

export default NAVIGATION;
