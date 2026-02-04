'use client';

import ProjectCard from '@/components/Cards/ProjectCard';
import Header from '@/components/Header/Header';
import SkillChips from '@/components/SkillChips/SkillChips';
import PROJECTS from '@/configs/PROJECTS';
import { ArrowLeftIcon, XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

const SECTION_CLASS = 'w-full py-16 md:py-24';

// Extract unique tags from all projects
const allTags = Array.from(new Set(PROJECTS.flatMap((project) => project.tags ?? [])));

export default function ProjectsPage() {
  const searchParams = useSearchParams();
  const selectedTag = searchParams.get('tag');

  const filteredProjects = selectedTag ? PROJECTS.filter((project) => project.tags?.some((tag) => tag === selectedTag)) : PROJECTS;

  return (
    <section id="projects" className={`${SECTION_CLASS} bg-section-dark px-4`} aria-labelledby="projects-heading">
      <div className="w-full max-w-6xl mx-auto flex flex-col gap-12">
        <div className="text-center">
          <Header as="h2" id="projects-heading" className="inline-block pb-2 border-b-2 border-editor.component">
            Projects
          </Header>
        </div>
        <p className="text-center text-white/90 text-lg max-w-2xl mx-auto">Examples of my personal and professional work.</p>
        {/* Tag roll-up: all unique tags from projects (clickable filters) */}
        <SkillChips tags={allTags} selectedTag={selectedTag} />
        {selectedTag && (
          <div className="flex flex-col items-center gap-2 py-4">
            <p className="text-center text-white/90 text-sm">
              Showing projects with <span className="text-editor.component font-semibold">{selectedTag}</span>
            </p>
            <Link
              href="/projects"
              className="inline-flex items-center gap-2 text-sm text-white/90 hover:text-editor.component transition-colors duration-normal focus-ring rounded px-2 py-1"
            >
              <XMarkIcon className="w-4 h-4" />
              <span>Clear filter</span>
            </Link>
          </div>
        )}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredProjects.length > 0 ? (
            filteredProjects.map((project, index) => <ProjectCard key={index} project={project} index={index} />)
          ) : (
            <div className="col-span-full text-center py-12">
              <p className="text-white/90 text-lg mb-4">
                No projects found with the tag <span className="text-editor.component font-semibold">{selectedTag}</span>
              </p>
              <Link href="/projects" className="text-white underline hover:text-editor.component transition-colors focus-ring rounded px-1">
                View all projects
              </Link>
            </div>
          )}
        </div>
        <p className="text-center text-sm text-white/90 max-w-2xl mx-auto">
          Interested in working together?{' '}
          <Link href="/#about" className="text-white underline hover:text-editor.component transition-colors duration-normal focus-ring rounded px-1 -mx-1" title="Contact me">
            Let&apos;s connect
          </Link>
        </p>
        <Link
          href="/"
          className="flex flex-col sm:flex-row items-center justify-center gap-6 rounded-xl border border-editor.backgroundLight bg-editor.backgroundLight/40 px-8 py-6 text-white hover:bg-editor.backgroundLight/60 transition-colors duration-normal focus-ring min-h-[44px] group max-w-sm mx-auto"
          title="Back to home"
        >
          <ArrowLeftIcon className="w-6 h-6 shrink-0 group-hover:-translate-x-1 transition-transform duration-normal motion-reduce:transition-none" />
          <span className="font-bold">Back to home</span>
        </Link>
      </div>
    </section>
  );
}
