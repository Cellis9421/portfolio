"use client";
import HTMLText from "@/components/HTMLText/HTMLText";
import Header from "@/components/Header/Header";
import { TypeAnimation } from "react-type-animation";

const ROLES = [
  "Software Engineer",
  5000,
  "Father",
  2000,
  "Problem Solver",
  2000,
  "Innovator",
  2000,
  "Mentor",
  2000,
  "Lifelong Learner",
  2000,
  "Team Player",
  2000,
  "Software Engineer",
  5000,
  "Collaborator",
  2000,
  "Leader",
  2000,
  "Designer",
  2000,
  "Architect",
  2000,
  "Researcher",
  2000,
];

export default function Home() {
  return (
    <>
      <Header as="h1" className="text-white pb-4">
        Calvin Ellis
      </Header>
      <HTMLText
        componentName="CalvinEllis"
        propertyNameValuePairs={{
          role: ROLES,
        }}
        className="text-3xl hidden md:flex"
      />
      <TypeAnimation
        sequence={ROLES}
        wrapper="p"
        speed={15}
        style={{  }}
        repeat={Infinity}
        className="text-3xl md:hidden text-editor.propertyValue"
      />
    </>
  );
}
