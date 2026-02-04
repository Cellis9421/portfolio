'use client';

import { LinkedInIcon } from '@/app/icons/LinkedInIcon';
import { Octocat } from '@/app/icons/Octocat';
import ProjectCard from '@/components/Cards/ProjectCard';
import CTASection from '@/components/CTASection/CTASection';
import Header from '@/components/Header/Header';
import HeroBackground from '@/components/HeroBackground/HeroBackground';
import HTMLText from '@/components/HTMLText/HTMLText';
import { LetsConnectWidget } from '@/components/LetsConnectWidget/LetsConnectWidget';
import PaperBlock from '@/components/PaperBlock/PaperBlock';
import SectionDescription from '@/components/SectionDescription/SectionDescription';
import SectionHeader from '@/components/SectionHeader/SectionHeader';
import SkillChips from '@/components/SkillChips/SkillChips';
import { ROLES } from '@/configs/constants';
import EDUCATION from '@/configs/EDUCATION';
import PROJECTS from '@/configs/PROJECTS';
import WORK_HISTORY from '@/configs/WORK_HISTORY';
import { ArrowRightIcon, BookOpenIcon, DocumentTextIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { TypeAnimation } from 'react-type-animation';

const ABOUT_LINES = [
  <span className="group" key="welcome">
    Hi there! 👋
  </span>,
  ' ',
  "I'm Calvin Ellis, a Software Engineer and technical leader with over 15 years of experience, currently specializing in agentic solutions—helping teams ship faster and smarter with AI-augmented workflows.",
  ' ',
  "My experience spans cybersecurity education (Principal at Cybrary), high-growth e-commerce (Lead at Stove & Grill Parts), and contract work with SMBs. I've led engineering strategy, mentored engineers at every level, and run company-wide AI Enablement training so teams can leverage GenTech and agentic coding tools in their day-to-day.",
  ' ',
  "I care a lot about developer experience and velocity: I've run 1:1 agentic coding sessions, documented hundreds of workflows and systems for better agentic understanding of our codebases, and helped engineers find where AI can meaningfully improve how they build. I also love mentoring—from interns to senior folks—and designing systems that scale.",
  ' ',
  "Tech-wise, I work across the stack: Next.js, React, TypeScript, Go, Python, Java, and a long list of cloud and DevOps tools. I'm based near Boston and always up for talking shop.",
  ' ',
  "Let's build something great.",
  ' ',
  <Link
    href="https://github.com/Cellis9421"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-stone-700 underline hover:text-stone-900 rounded focus-ring"
    title="Calvin's GitHub Profile"
    key="gh-link"
  >
    <Octocat className="w-4" />
    <span>cellis9421</span>
  </Link>,
  ' ',
  <Link
    href="https://www.linkedin.com/in/calvin-ellis-ma"
    target="_blank"
    rel="noopener noreferrer"
    className="inline-flex items-center gap-1 text-stone-700 underline hover:text-stone-900 rounded focus-ring"
    title="Calvin's LinkedIn Profile"
    key="linkedin-link"
  >
    <LinkedInIcon className="w-4" />
    <span>linkedin.com/in/calvin-ellis-ma</span>
  </Link>,
  ' ',
];

/* Spacing scale: 16, 24, 32, 48, 64 (Tailwind 4–16). Section rhythm: pt-8 pb-16 md:pt-12 md:pb-24 (half top padding). */
const SECTION_CLASS = 'w-full pt-8 pb-16 md:pt-12 md:pb-24';

const ABOUT_CHIPS = [
  'AI',
  'Next.js',
  'TypeScript',
  'Go',
  'Python',
  'Java',
  'Tailwind',
  'Kubernetes',
  'GraphQL',
  'Cursor',
  'Hugging Face',
  'Cybersecurity',
  'E-commerce',
  'Mentoring',
];

// Extract unique tags from all projects for Skills section
const allProjectTags = Array.from(new Set(PROJECTS.flatMap((project) => project.tags ?? [])));

export default function Home() {
  return (
    <>
      {/* Hero: single focal point; particle background behind name and role */}
      <section className="relative flex flex-col items-center justify-center w-full min-h-[50vh] gap-6 overflow-hidden bg-transparent px-4">
        <HeroBackground />
        <div className="relative z-10 flex flex-col items-center gap-6">
          <Header as="h1" className="text-white text-center">
            Calvin Ellis
          </Header>
          <HTMLText componentName="CalvinEllis" propertyNameValuePairs={{ role: ROLES }} className="text-xl hidden md:text-3xl sm:flex text-center text-editor.propertyValue" />
          <TypeAnimation sequence={ROLES} wrapper="p" speed={15} style={{}} repeat={Infinity} className="text-xl sm:hidden text-editor.propertyValue text-center" />
        </div>
      </section>

      {/* About */}
      <section id="about" className={`${SECTION_CLASS} bg-section-dark border-t-2 border-editor.component`} aria-labelledby="about-heading">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 px-4">
          <SectionHeader id="about-heading">About me</SectionHeader>
          <div className="flex flex-col lg:flex-row items-start justify-between w-full gap-12 lg:gap-16">
            <div className="w-full lg:max-w-sm flex flex-col items-center lg:items-start gap-8">
              <div className="flex flex-col gap-1">
                <Header as="h3" className="text-center lg:text-left text-xl font-bold text-white">
                  Principal Software Engineer
                </Header>
                <p className="text-sm text-editor.tag text-center lg:text-left">Full Stack</p>
              </div>
              <LetsConnectWidget />
              <div className="flex flex-col gap-1 pt-4 border-t border-editor.backgroundLight/50 w-full">
                {[
                  '15+ YOE in Software Engineering',
                  'Full Stack SWE: FE / BE / DevOps',
                  'AI Enablement & Agentic Workflow Specialist',
                  'Greater Boston · Open to Opportunities',
                  'Hobbies: Hiking, Gaming, and Building PCs',
                ].map((text) => (
                  <div key={text} className="flex items-center gap-3 py-2 px-3 border-l-2 border-editor.component bg-editor.backgroundLight/20 text-white text-sm">
                    <span className="flex-1">{text}</span>
                  </div>
                ))}
              </div>
            </div>
            <PaperBlock linesOfText={ABOUT_LINES} className="flex-1 min-w-0" />
          </div>
        </div>
      </section>

      {/* Skills – all technologies from projects */}
      <section id="skills" className={`${SECTION_CLASS} bg-section-gradient`} aria-labelledby="skills-heading">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-8 px-4">
          <SectionHeader id="skills-heading">Skills</SectionHeader>
          <SectionDescription>Technologies, frameworks, and tools I work with across all my projects.</SectionDescription>
          <SkillChips tags={allProjectTags} />
        </div>
      </section>

      {/* Work History */}
      <section id="work-history" className={`${SECTION_CLASS} bg-section-light`} aria-labelledby="work-history-heading">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 px-4">
          <SectionHeader id="work-history-heading">Work History</SectionHeader>
          <SectionDescription>Roles and impact over the last 15+ years.</SectionDescription>
          <div className="flex flex-col w-full max-w-3xl mx-auto">
            {WORK_HISTORY.map((role, index) => (
              <article key={`${role.company}-${index}`} className={index > 0 ? 'pt-10 mt-10 border-t border-white/10' : ''}>
                <Header as="h3" className="text-xl">
                  {role.title}
                </Header>
                <p className="text-editor.tag text-sm mt-0.5">{role.company}</p>
                <p className="text-sm text-editor.component mt-1 tabular-nums">
                  {role.dates}
                  {role.location ? ` | ${role.location}` : ''}
                </p>
                <ul className="flex flex-col gap-2 mt-4 list-none pl-0">
                  {role.bullets.map((bullet, i) => (
                    <li key={i} className="flex items-center gap-3 text-sm text-white/90 leading-relaxed">
                      <span className="text-editor.component shrink-0" aria-hidden>
                        —
                      </span>
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        id="agentic-guide"
        title="My Philosophy on Agentic Development"
        description="A practical guide to software development enablement with AI and agentic workflows."
        buttonText="Read my guide"
        buttonHref="https://www.notion.so/Agentic-Software-Development-Enablement-Guide-2c7965a5986780edb657fa92aab449fc?source=copy_link"
        buttonTitle="Read the Agentic Software Development Enablement Guide"
        icon={BookOpenIcon}
        backgroundClass="bg-section-gradient"
        target="_blank"
        rel="noopener noreferrer"
        sectionClassName={SECTION_CLASS}
      />

      {/* Projects */}
      <section id="projects" className={`${SECTION_CLASS} bg-section-dark`} aria-labelledby="projects-heading">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 px-4">
          <SectionHeader id="projects-heading">Projects</SectionHeader>
          <SectionDescription>Examples of my personal and professional work.</SectionDescription>
          <p className="text-center text-sm text-white/90 max-w-2xl mx-auto">
            Interested in working together?{' '}
            <Link href="/#about" className="text-white underline hover:text-editor.component transition-colors duration-normal focus-ring rounded px-1 -mx-1" title="Contact me">
              Let&apos;s connect
            </Link>
          </p>
          <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {PROJECTS.slice(0, 9).map((project, index) => (
              <ProjectCard key={index} project={project} index={index} />
            ))}
          </div>
          <div className="max-w-2xl mx-auto text-center flex flex-col gap-4">
            <Header as="h3" className="text-xl md:text-2xl">
              More projects
            </Header>
            <p className="text-white/90">Explore all my case studies and side projects.</p>
            <Link
              href="/projects"
              className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 px-10 py-5 text-white border-2 border-editor.component bg-editor.component/20 hover:bg-editor.component/40 transition-colors duration-normal focus-ring min-h-[56px] group"
              title="View all projects"
            >
              <ArrowRightIcon className="w-8 h-8 shrink-0 group-hover:translate-x-1 transition-transform duration-normal motion-reduce:transition-none" />
              <span className="font-bold text-lg">View all projects</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Education – solid section background */}
      <section id="education" className={`${SECTION_CLASS} bg-section-light`} aria-labelledby="education-heading">
        <div className="w-full max-w-6xl mx-auto flex flex-col gap-12 px-4">
          <SectionHeader id="education-heading">Education</SectionHeader>
          <SectionDescription>Academic background.</SectionDescription>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-3xl mx-auto">
            {EDUCATION.map((entry, index) => (
              <article key={`${entry.institution}-${index}`} className="flex flex-col gap-2 py-4 border-l-2 border-editor.component pl-5">
                <p className="text-lg font-bold text-white">{entry.institution}</p>
                <p className="text-editor.tag text-sm italic">{entry.location}</p>
                <ul className="flex flex-col gap-0.5 mt-1 list-none pl-0">
                  {entry.fields.map((field, i) => (
                    <li key={i} className="text-sm text-white/90">
                      {field}
                    </li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>

      <CTASection
        title="Read My Blog"
        description="Thoughts on engineering, AI, and building in public."
        buttonText="Visit my blog"
        buttonHref="https://blog.calvinellis.io/"
        buttonTitle="Read my blog"
        icon={DocumentTextIcon}
        backgroundClass="bg-section-gradient"
        target="_blank"
        rel="noopener noreferrer"
        sectionClassName={SECTION_CLASS}
      />
    </>
  );
}
