import React, { ReactElement, useMemo } from "react";
import IProject from "../../../@types/IProject";

// Used for alternating colors of project cards
const projectCardColors = [
  "blue-500",
  "red-500",
  "cyan-500",
  "yellow-500",
  "fuchsia-500",
  "orange-500",
  "green-500",
  "purple-500",
];

export default function ProjectCard({
  project,
  index,
}: {
  project: IProject;
  index: number;
}) {
  const {
    title = "Example title",
    subtitle = "Example subtitle",
    description = "Example description",
    viewLink,
    codeLink,
    iconElement,
  } = project;
  const color = useMemo(
    () =>
      project.color ||
      projectCardColors[index % projectCardColors.length] ||
      "blue-500",
    [project.color, index]
  );
  const headerClasses = useMemo(
    () =>
      `min-h-44 flex flex-col justify-center items-center bg-${color} rounded-xl p-1`,
    [color]
  );
  const subtitleClasses = useMemo(
    () => `block mb-1 text-xs font-semibold uppercase text-${color}`,
    [color]
  );
  const linkClasses = useMemo(
    () =>
      `w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium first:rounded-bl-xl last:rounded-br-xl shadow-sm border-editor.background focus:outline-none focus:ring-1 focus:ring-gray-600`,
    []
  );
  const activeLinkClasses = useMemo(
    () => `cursor-pointer text-white bg-${color} hover:bg-${color}/90`,
    [color]
  );
  const inactiveLinkClasses = useMemo(
    () =>
      `cursor-not-allowed text-editor.tag bg-editor.background hover:bg-editor.background/50 `,
    []
  );
  return (
    <div className="group flex flex-col h-full shadow-sm rounded-xl bg-editor.backgroundMedium border-editor.backgroundMedium shadow-slate-700/[.7] hover:scale-[1.01] transition-all duration-500">
      <div className={headerClasses}>{iconElement}</div>
      <div className="p-4 md:p-6 bg-editor.backgroundMedium flex flex-col">
        <span className={subtitleClasses}>{subtitle}</span>
        <h3 className="text-xl font-semibold text-gray-300 hover:text-white">
          {title}
        </h3>
        <p className="mt-3 text-gray-500">{description}</p>
      </div>
      <div className="mt-auto flex border-t divide-x border-editor.backgroundMedium divide-editor.backgroundMedium">
        <a
          className={`${linkClasses} ${
            !!viewLink ? activeLinkClasses : inactiveLinkClasses
          }`}
          href={viewLink}
          target="_blank"
        >
          View Project
        </a>
        <a
          className={`${linkClasses} ${
            !!codeLink ? activeLinkClasses : inactiveLinkClasses
          }`}
          href={codeLink}
          target="_blank"
        >
          View Code
        </a>
      </div>
    </div>
  );
}
