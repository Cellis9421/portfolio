"use client";
import { CWindowAboutMe } from "@/components/CWindow/AboutMe/CWindowAboutMe";
import Header from "@/components/Header/Header";

export default function About() {
  return (
    <>
      <Header as="h1" className="mb-4">
        About Calvin Ellis
      </Header>
      <CWindowAboutMe />
    </>
  );
}
