"use client";
import React, { useMemo } from "react";
import { ComputerDesktopIcon, Bars3Icon as MenuIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";
import NavigationItem from "./NavigationItem";
import { twMerge } from "tailwind-merge";
import { useNavigationCtx } from "@/contexts/NavigationCtx";
import NAVIGATION from "@/configs/NAVIGATION";

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
        "fixed top-0 left-0 z-50 bg-white w-full h-full md:hidden transition-all duration-300 ease-in-out",
        isOpen ? "translate-x-0" : "-translate-x-full"
      ),
    [isOpen]
  );

  return (
    <div>
      {/** Navigation Bar */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-4 mx-auto bg-editor.background/95 shadow-current rounded-b-2xl">
        <div className="hidden md:flex space-x-8 lg:space-x-16 px-4 w-full justify-evenly">
          {NAVIGATION.items.map((navigationItem, index) => (
            <NavigationItem key={index} navigationItem={navigationItem} />
          ))}
        </div>
        <MenuIcon
          className="md:hidden h-16 w-16 shrink-0 text-editor.tag"
          onClick={() => setIsOpen(!isOpen)}
        />
      </nav>
      {/** Sidebar */}
      <div className={sidebarStyles}>
        {/** Sidebar Header */}
        <div className="flex justify-between p-8 bg-editor.background text-white shadow-md">
          <div>
            <h2 className="text-[2.5rem] font-bold">Calvin Ellis</h2>
            <p className="text-2xl">Software Engineer</p>
          </div>
          <XCircleIcon
            className="h-16 w-16 shrink-0"
            onClick={() => setIsOpen(!isOpen)}
          />
        </div>
        {/** Sidebar Main */}
        <div className="flex flex-col space-y-16 h-full p-8 bg-editor.background">
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
