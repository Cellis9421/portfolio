"use client";
import { CWindowAboutMe } from "@/components/CWindow/AboutMe/CWindowAboutMe";
import Header from "@/components/Header/Header";
import { LetsConnectWidget } from "@/components/LetsConnectWidget/LetsConnectWidget";

export default function About() {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-between w-full max-w-screen-xl">
        <div className="mb-8 lg:mb-0">
          <Header as="h1" className="mb-4">
            About Calvin Ellis
          </Header>
          <LetsConnectWidget />
        </div>
        <CWindowAboutMe />
      </div>
    </>
  );
}
