"use client";
import React from "react";
import Image from "next/image";
import { Bars3Icon as MenuIcon } from "@heroicons/react/24/solid";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { HomeIcon } from "@heroicons/react/24/solid";
import { UserIcon } from "@heroicons/react/24/solid";
import { BriefcaseIcon } from "@heroicons/react/24/solid";
import { EnvelopeIcon } from "@heroicons/react/24/solid";

/**
 * A sticky header navigation that shows:
 * On Desktop: four icons fixed to the top left of the screen
 * On Mobile: a hamburger menu that opens a modal with the four icons
 */

function Navigation() {
  // Sidebar state
  const [isOpen, setIsOpen] = React.useState(false);

  return (
    <div>
      {/** Navigation Items */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-transparent p-8">
        <div className="hidden md:flex space-x-8 px-8">
          <HomeIcon className="h-12 w-12" />
          <UserIcon className="h-12 w-12" />
          <BriefcaseIcon className="h-12 w-12" />
          <EnvelopeIcon className="h-12 w-12" />
        </div>
        <MenuIcon className="md:hidden h-12 w-12" onClick={() => setIsOpen(!isOpen)} />
      </nav>
      {/** Sidebar */}
      <div
        className={`fixed top-0 left-0 right-0 z-50 bg-white p-8 w-4/5 h-full ${
          isOpen ? "block" : "hidden"
        }`}
      >
        <div className="flex justify-between mb-4">
          <h2 className="text-3xl font-bold">Calvin Ellis</h2>
          <XCircleIcon className="h-12 w-12" onClick={() => setIsOpen(!isOpen)} />
        </div>
        <div className="flex flex-col space-y-8">
          <HomeIcon className="h-12 w-12" />
          <UserIcon className="h-12 w-12" />
          <BriefcaseIcon className="h-12 w-12" />
          <EnvelopeIcon className="h-12 w-12" />
        </div>
      </div>
    </div>
  );
}

export default Navigation;
