"use client";
import NAVIGATION from "@/configs/NAVIGATION";
import { useNavigationCtx } from "@/contexts/NavigationCtx";
import { Bars3Icon as MenuIcon, XCircleIcon } from "@heroicons/react/24/solid";
import { useMemo } from "react";
import { twMerge } from "tailwind-merge";
import NavigationItem from "./NavigationItem";

/**
 * A sticky header navigation that shows:
 * On Desktop: four icons fixed to the top left of the screen
 * On Mobile: a hamburger menu that opens a modal with the four icons
 */

function Navigation() {
  // Sidebar state
  const { isOpen, setIsOpen } = useNavigationCtx();

  // Sidebar styles
  const sidebarStyles = useMemo(
    () =>
      twMerge(
        "fixed top-0 left-0 z-50 bg-editor.background w-full h-full lg:hidden transition-transform duration-normal ease-in-out motion-reduce:transition-none",
        isOpen ? "translate-x-0" : "-translate-x-full"
      ),
    [isOpen]
  );

  return (
    <div>
      {/** Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 mx-auto bg-section-light shadow-current border-b-2 border-editor.component" aria-label="Main">
        <div className="hidden lg:flex gap-8 xl:gap-16 px-4 w-full justify-evenly">
          {NAVIGATION.items.map((navigationItem, index) => (
            <NavigationItem key={index} navigationItem={navigationItem} />
          ))}
        </div>
        <button
          type="button"
          className="lg:hidden h-12 w-12 min-h-[44px] min-w-[44px] shrink-0 text-editor.tag hover:text-white transition-colors duration-normal focus-ring rounded"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          <MenuIcon className="h-12 w-12" />
        </button>
      </nav>
      {/** Sidebar */}
      <div className={sidebarStyles}>
        {/** Sidebar Header */}
        <div className="flex justify-between items-center gap-4 p-8 bg-editor.background text-white shadow-md">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">Calvin Ellis</h2>
            <p className="text-lg md:text-xl text-editor.propertyValue">Software Engineer</p>
          </div>
          <button
            type="button"
            className="h-12 w-12 min-h-[44px] min-w-[44px] shrink-0 text-editor.tag hover:text-white transition-colors duration-normal focus-ring rounded"
            onClick={() => setIsOpen(!isOpen)}
            aria-label="Close menu"
          >
            <XCircleIcon className="h-12 w-12" />
          </button>
        </div>
        {/** Sidebar Main */}
        <div className="flex flex-col gap-12 h-full p-8 bg-editor.background">
          {NAVIGATION.items.map((navigationItem, index) => (
            <NavigationItem
              key={index}
              navigationItem={navigationItem}
              className="w-full"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Navigation;
