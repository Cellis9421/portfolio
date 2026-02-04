import DefaultProjectIcon from '@/components/DefaultProjectIcon/DefaultProjectIcon';
import { useMemo } from 'react';
import IProject from '../../../@types/IProject';

// Used for alternating colors of project cards (header remains solid)
const projectCardColors = ['blue-500', 'red-500', 'cyan-500', 'fuchsia-500', 'orange-500', 'green-500', 'purple-500'];

/* Gradient [from, to] hex pairs – same palette as About skill chips */
const CARD_GRADIENTS: [string, string][] = [
  ['#3b82f6', '#06b6d4'],
  ['#ef4444', '#f97316'],
  ['#06b6d4', '#22c55e'],
  ['#d946ef', '#a855f7'],
  ['#f97316', '#ef4444'],
  ['#22c55e', '#06b6d4'],
  ['#a855f7', '#d946ef'],
];

export default function ProjectCard({ project, index }: { project: IProject; index: number }) {
  const { title = 'Example title', subtitle = 'Example subtitle', description = 'Example description', viewLink, codeLink, iconElement, tags } = project;
  const color = useMemo(() => project.color || projectCardColors[index % projectCardColors.length] || 'blue-500', [project.color, index]);
  const headerClasses = useMemo(() => `h-24 flex flex-col justify-center items-center bg-${color} overflow-hidden`, [color]);
  const subtitleClasses = useMemo(() => `block mb-1 text-xs font-semibold uppercase text-${color}`, [color]);
  const linkClasses = useMemo(
    () => 'w-full min-h-[44px] py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-medium shadow-sm border-editor.background focus-ring',
    []
  );
  const cardGradient = useMemo(() => CARD_GRADIENTS[index % CARD_GRADIENTS.length], [index]);
  const activeLinkClasses = useMemo(() => 'cursor-pointer text-white border-white/20 hover:opacity-90 transition-opacity duration-normal', []);
  const inactiveLinkClasses = useMemo(() => `cursor-not-allowed text-editor.tag bg-editor.background hover:bg-editor.background/50 `, []);
  return (
    <div className="group flex flex-col h-full shadow-sm bg-section-lighter border border-editor.backgroundLight shadow-slate-700/[.7] hover:scale-[1.01] transition-transform duration-normal motion-reduce:transition-none motion-reduce:hover:scale-100">
      <div className={headerClasses}>{iconElement || <DefaultProjectIcon color={color} />}</div>
      <div className="p-4 md:p-6 flex flex-col">
        <span className={subtitleClasses}>{subtitle}</span>
        <h3 className="text-xl font-semibold text-white hover:text-white">{title}</h3>
        {/** Add chips for each tag */}
        <div className="flex flex-wrap gap-2 mt-2">
          {tags?.map((tag, tagIndex) => {
            const [from, to] = CARD_GRADIENTS[(index + tagIndex) % CARD_GRADIENTS.length];
            return (
              <span
                key={tagIndex}
                className="px-2 py-1 text-white text-xs border border-white/20"
                style={{
                  background: `linear-gradient(135deg, ${from}, ${to})`,
                }}
              >
                {tag}
              </span>
            );
          })}
        </div>
        <p className="mt-3 text-gray-300">{description}</p>
      </div>
      <div className="mt-auto flex border-t divide-x border-editor.backgroundLight divide-editor.backgroundLight">
        {viewLink ? (
          <a
            className={`${linkClasses} ${activeLinkClasses}`}
            href={viewLink}
            target="_blank"
            style={{
              background: `linear-gradient(135deg, ${cardGradient[0]}, ${cardGradient[1]})`,
            }}
          >
            View Project
          </a>
        ) : (
          <div className={`${linkClasses} ${inactiveLinkClasses}`}>No Preview Available</div>
        )}
        {codeLink ? (
          <a
            className={`${linkClasses} ${activeLinkClasses}`}
            href={codeLink}
            target="_blank"
            style={{
              background: `linear-gradient(135deg, ${cardGradient[0]}, ${cardGradient[1]})`,
            }}
          >
            View Code
          </a>
        ) : (
          <div className={`${linkClasses} ${inactiveLinkClasses}`}>No Code Available</div>
        )}
      </div>
    </div>
  );
}
