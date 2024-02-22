"use client";
import { CWindowAboutMe } from "@/components/CWindows/CWindows";
import Header from "@/components/Header/Header";

export default function About() {
  return (
    <>
      <Header as="h1">About Calvin Ellis</Header>
      <CWindowAboutMe defaultOpen />
    </>
  );
}
