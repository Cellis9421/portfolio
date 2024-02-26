"use client";
import { CWindowAboutMe } from "@/components/CWindow/AboutMe/CWindowAboutMe";
import Header from "@/components/Header/Header";
import { LetsConnectWidget } from "@/components/LetsConnectWidget/LetsConnectWidget";

export default function About() {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-full max-w-screen-xl lg:px-4">
        <div className="mb-8 lg:mb-0 lg:pr-4">
          <Header as="h1" className="mb-4 text-center">
            About Calvin Ellis
          </Header>
          <LetsConnectWidget />
        </div>
        <CWindowAboutMe />
      </div>
    </>
  );
}
