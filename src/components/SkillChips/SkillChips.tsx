import Link from 'next/link';

/* Gradient [from, to] hex pairs – project-section palette for skill/tag chips */
const CHIP_GRADIENTS: [string, string][] = [
  ['#3b82f6', '#06b6d4'], // blue → cyan
  ['#ef4444', '#f97316'], // red → orange
  ['#06b6d4', '#22c55e'], // cyan → green
  ['#d946ef', '#a855f7'], // fuchsia → purple
  ['#f97316', '#ef4444'], // orange → red
  ['#22c55e', '#06b6d4'], // green → cyan
  ['#a855f7', '#d946ef'], // purple → fuchsia
];

/**
 * Skill/tag chips with gradient backgrounds and optional filtering.
 * Used on: Skills section (main page) and Projects page (tag filters).
 */
export default function SkillChips({ tags, selectedTag, className = '' }: { tags: string[]; selectedTag?: string | null; className?: string }) {
  return (
    <div className={`flex flex-wrap justify-center gap-2 max-w-4xl mx-auto py-4 ${className}`}>
      {tags.map((tag, index) => {
        const [from, to] = CHIP_GRADIENTS[index % CHIP_GRADIENTS.length];
        const isActive = selectedTag === tag;
        return (
          <Link
            key={tag}
            href={`/projects?tag=${encodeURIComponent(tag)}`}
            className={`px-4 py-2 md:px-2 md:py-1 text-white text-sm md:text-xs border transition-all duration-normal focus-ring hover:-translate-y-1 motion-reduce:hover:translate-y-0 ${
              isActive ? 'border-editor.component ring-2 ring-editor.component/50' : 'border-white/20 hover:border-white/40'
            }`}
            style={{
              background: `linear-gradient(135deg, ${from}, ${to})`,
            }}
          >
            {tag}
          </Link>
        );
      })}
    </div>
  );
}
