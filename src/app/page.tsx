"use client";

import { LinkedInIcon } from "@/app/icons/LinkedInIcon";
import { Octocat } from "@/app/icons/Octocat";
import ProjectCard from "@/components/Cards/ProjectCard";
import Header from "@/components/Header/Header";
import HTMLText from "@/components/HTMLText/HTMLText";
import { LetsConnectWidget } from "@/components/LetsConnectWidget/LetsConnectWidget";
import PaperBlock from "@/components/PaperBlock/PaperBlock";
import { ROLES } from "@/configs/constants";
import PROJECTS from "@/configs/PROJECTS";
import { ArrowRightIcon, DocumentTextIcon } from "@heroicons/react/24/outline";
import Link from "next/link";
import { TypeAnimation } from "react-type-animation";

const ABOUT_LINES = [
  <span className="group" key="welcome">
    Hi there! 👋
  </span>,
  " ",
  "I'm Calvin Ellis, a Software Engineer and technical leader with over 10 years of experience, currently specializing in agentic solutions—helping teams ship faster and smarter with AI-augmented workflows.",
  " ",
  "My experience spans cybersecurity education (Principal at Cybrary), high-growth e-commerce (Lead at Stove & Grill Parts), and contract work with SMBs. I've led engineering strategy, mentored engineers at every level, and run company-wide AI Enablement training so teams can leverage GenTech and agentic coding tools in their day-to-day.",
  " ",
  "I care a lot about developer experience and velocity: I've run 1:1 agentic coding sessions, documented hundreds of workflows and systems for better agentic understanding of our codebases, and helped engineers find where AI can meaningfully improve how they build. I also love mentoring—from interns to senior folks—and designing systems that scale.",
  " ",
  "Tech-wise, I work across the stack: Next.js, React, TypeScript, Go, Python, Java, and a long list of cloud and DevOps tools. I'm based near Boston and always up for talking shop.",
  " ",
  "Let's build something great.",
  " ",
  <Link
    href="https://github.com/Cellis9421"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-stone-700 underline hover:text-stone-900"
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
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-stone-700 underline hover:text-stone-900"
    title="Calvin's LinkedIn Profile"
    key="linkedin-link"
  >
    <LinkedInIcon className="w-4" />
    <span>linkedin.com/in/calvin-ellis-ma</span>
  </Link>,
  " ",
];

const SECTION_CLASS = "w-full px-4 py-16 md:py-24";

const ABOUT_CHIPS = [
  "AI",
  "Next.js",
  "React",
  "TypeScript",
  "Go",
  "Python",
  "Java",
  "Tailwind",
  "Kubernetes",
  "GraphQL",
  "Cursor",
  "Hugging Face",
  "Cybersecurity",
  "E-commerce",
  "Mentoring",
];

export default function Home() {
  return (
    <>
      {/* Hero: ~1 viewport height */}
      <section className="flex flex-col items-center justify-center w-full mt-8">
        <Header as="h1" className="text-white pb-4">
          Calvin Ellis
        </Header>
        <HTMLText
          componentName="CalvinEllis"
          propertyNameValuePairs={{ role: ROLES }}
          className="text-xl hidden md:text-3xl sm:flex"
        />
        <TypeAnimation
          sequence={ROLES}
          wrapper="p"
          speed={15}
          style={{}}
          repeat={Infinity}
          className="text-xl sm:hidden text-editor.propertyValue"
        />
      </section>

      {/* About */}
      <section id="about" className={SECTION_CLASS}>
        <div className="flex flex-col lg:flex-row items-start justify-evenly w-full max-w-screen-xl mx-auto lg:px-4">
          <div className="mb-8 lg:mb-0 lg:pr-4 mt-8">
            <Header as="h2" className="mb-4 text-center">
              Principal Software Engineer
            </Header>
            <LetsConnectWidget />
            <div className="flex flex-wrap justify-center gap-2 pt-8">
              {ABOUT_CHIPS.map((label) => (
                <span
                  key={label}
                  className="rounded-full px-3 py-1 text-sm font-medium bg-gradient-to-r from-editor.backgroundLight to-editor.backgroundMedium text-white border border-editor.backgroundLight"
                >
                  {label}
                </span>
              ))}
            </div>
          </div>
          <PaperBlock linesOfText={ABOUT_LINES} />
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className={SECTION_CLASS}>
        <div className="w-full max-w-screen-2xl mx-auto">
          <Header as="h2" className="text-5xl font-black pb-4 text-center">
            Projects
          </Header>
          <div className="text-white text-center mb-10">
            <p className="text-lg mb-4">
              Here are some examples of my personal and professional work.
            </p>
            <p className="text-sm mb-2">
              Interested in working with me?{" "}
              <Link
                href="/#contact"
                className="text-white underline hover:text-editor.propertyValue transition-colors"
                title="Contact me"
              >
                Lets connect!
              </Link>
            </p>
          </div>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 p-4 gap-y-12">
            {PROJECTS.slice(0, 8).map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
          <Link
            href="/#projects"
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 rounded-xl border border-editor.backgroundLight bg-editor.backgroundLight/40 px-8 py-6 text-white hover:bg-editor.backgroundLight/60 transition-colors duration-300 group"
            title="View all projects"
          >
            <ArrowRightIcon className="w-6 h-6 shrink-0 group-hover:translate-x-1 transition-transform" />
            <div className="text-center sm:text-left">
              <span className="font-bold block">View all projects</span>
              <span className="text-sm text-white/90">
                See more case studies and side projects.
              </span>
            </div>
          </Link>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className={SECTION_CLASS}>
        <div className="text-center px-4">
          <Header as="h2">Lets Connect</Header>
        </div>
        <LetsConnectWidget />
      </section>

      {/* Footer CTA: blog */}
      <footer className={`${SECTION_CLASS} border-t border-editor.backgroundLight`}>
        <Link
          href="https://blog.calvinellis.io/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex flex-col sm:flex-row items-center justify-center gap-6 rounded-xl border border-editor.backgroundLight bg-editor.backgroundLight/40 px-8 py-6 text-white hover:bg-editor.backgroundLight/60 transition-colors duration-300 group max-w-xl mx-auto"
          title="Read my blog"
        >
          <DocumentTextIcon className="w-6 h-6 shrink-0" />
          <div className="text-center sm:text-left">
            <span className="font-bold block">Read my blog</span>
            <span className="text-sm text-white/90">
              Thoughts on engineering, AI, and building in public.
            </span>
          </div>
        </Link>
      </footer>
    </>
  );
}
