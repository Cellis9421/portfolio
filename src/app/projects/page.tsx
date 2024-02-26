import ProjectCard from "@/components/Cards/ProjectCard";
import Header from "@/components/Header/Header";
import PROJECTS from "@/configs/PROJECTS";
import Link from "next/link";

export default function Projects() {
  return (
    <>
      <Header as="h1">Projects</Header>
      <div className="text-white m-4 mb-0 text-sm text-center">
        <p className="text-lg">
          Here are some examples of my personal and professional work.
        </p>
        <p className="text-sm">
          Interested in working with me?{" "}
          <Link href={"/contact"} className="underline" title="Contact me">
            Lets connect!
          </Link>
        </p>
      </div>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 p-4 max-w-screen-2xl gap-y-12">
        {PROJECTS.map((project, index) => (
          <ProjectCard key={index} project={project} index={index} />
        ))}
      </div>
    </>
  );
}
