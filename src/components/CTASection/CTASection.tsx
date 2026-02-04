import Header from '@/components/Header/Header';
import Link from 'next/link';
import type { ComponentType } from 'react';

/**
 * CTA section with title, description, and prominent button.
 * Used for: Agentic guide, Read my blog, View all projects.
 */
export default function CTASection({
  id,
  title,
  description,
  buttonText,
  buttonHref,
  buttonTitle,
  icon: Icon,
  iconAnimation = false,
  backgroundClass = 'bg-section-gradient',
  target = '_self',
  rel,
  sectionClassName = 'w-full pt-8 pb-16 md:pt-12 md:pb-24',
}: {
  id?: string;
  title: string;
  description: string;
  buttonText: string;
  buttonHref: string;
  buttonTitle?: string;
  icon: ComponentType<{ className?: string }>;
  iconAnimation?: boolean;
  backgroundClass?: string;
  target?: '_blank' | '_self';
  rel?: string;
  sectionClassName?: string;
}) {
  return (
    <section id={id} className={`${sectionClassName} ${backgroundClass} px-4`}>
      <div className="max-w-2xl mx-auto text-center">
        <Header as="h2" className="text-2xl md:text-3xl mb-2">
          {title}
        </Header>
        <p className="text-white/90 text-lg mb-8">{description}</p>
        <Link
          href={buttonHref}
          target={target}
          rel={rel}
          className="inline-flex flex-col sm:flex-row items-center justify-center gap-4 px-10 py-5 text-white border-2 border-editor.component bg-editor.component/20 hover:bg-editor.component/40 transition-colors duration-normal focus-ring min-h-[56px] group"
          title={buttonTitle || buttonText}
        >
          <Icon className={`w-8 h-8 shrink-0 ${iconAnimation ? 'group-hover:translate-x-1 transition-transform duration-normal motion-reduce:transition-none' : ''}`} />
          <span className="font-bold text-lg">{buttonText}</span>
        </Link>
      </div>
    </section>
  );
}
