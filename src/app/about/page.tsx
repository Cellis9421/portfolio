"use client";
import { CWindowAboutMe } from "@/components/CWindow/AboutMe/CWindowAboutMe";
import Header from "@/components/Header/Header";
import { LetsConnectWidget } from "@/components/LetsConnectWidget/LetsConnectWidget";
import Link from "next/link";
import { Octocat } from "@/app/icons/Octocat";
import { LinkedInIcon } from "@/app/icons/LinkedInIcon";
import JSComments from "@/components/JSComments/JSComments";

export default function About() {
  return (
    <>
      <div className="flex flex-col lg:flex-row items-center justify-evenly w-full max-w-screen-xl lg:px-4">
        <div className="mb-8 lg:mb-0 lg:pr-4">
          <Header as="h1" className="mb-4 text-center">
            About Calvin Ellis
          </Header>
          <LetsConnectWidget onlyPhoto />
          <p className="pt-4 text-white text-center text-lg">
            Principal Software Engineer @ Cybrary
          </p>
        </div>
        <div className="max-w-2xl">
          <JSComments
            color="white"
            linesOfText={[
              <span className="group" key="welcome">
                Hi there! 👋
              </span>,
              " ",
              "I'm a Software Engineer from Boston, Massachusetts with over 10 years professional experience working in tech and a lifetime of passion for it.",
              " ",
              "I specialize in cybersecurity education and high-volume e-commerce, but am always looking to branch out and try new things! I deeply enjoy solving puzzles through code and infrastructure, and designing systems that stand the test of time and scale.",
              " ",
              "In my tech stack, you'll find favorites like TypeScript/React, Java, and Python, alongside a plethora of other tools and languages. Whether it's front or back-end brawn, I love making tech work smarter, not harder.",
              " ",
              "Let's make something awesome together!",
              " ",
              // "I am a Software Engineer with over 10 years experience building",
              // "full-stack solutions in the cybersecurity/e-commerce domains.",
              // "I have a passion for problem-solving and creating efficient,",
              // "scalable solutions through code and infrastructure.",
              // "I enjoy collaborating with teams on difficult problems,",
              // "learning new technologies, and staying up-to-date with trends.",
              // " ",
              // "Some of my favorite tech I've worked with professionally includes:",
              // "Typescript, React, Java, Next.js, TailwindCSS, PHP, Python,",
              // "Node.js, PostgreSQL, Kubernetes, GCP, and Firebase.",
              // " ",
              // "- Calvin Ellis",
              // " ",
              <Link
                href="https://github.com/Cellis9421"
                target="_blank"
                className="flex group space-x-1"
                title="Calvin's GitHub Profile"
                key="gh-link"
              >
                <Octocat className="w-4" />
                <span>cellis9421</span>
              </Link>,
              " ",
              <Link
                href="https://www.linkedin.com/in/calvin-ellis-ma"
                target="_blank"
                className="flex group space-x-1"
                title="Calvin's LinkedIn Profile"
                key="linkedin-link"
              >
                <LinkedInIcon className="w-4" />
                <span>linkedin.com/in/calvin-ellis-ma</span>
              </Link>,
              " ",
            ]}
          />
        </div>
      </div>
    </>
  );
}
