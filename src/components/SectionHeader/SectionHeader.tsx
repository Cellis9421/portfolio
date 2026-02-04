import Header from '@/components/Header/Header';

/**
 * Centered section header with green underline accent.
 * Used across About, Skills, Work History, Projects, Education sections.
 */
export default function SectionHeader({ id, children, className = '' }: { id: string; children: React.ReactNode; className?: string }) {
  return (
    <div className="text-center">
      <Header as="h2" id={id} className={`inline-block pb-2 border-b-2 border-editor.component ${className}`}>
        {children}
      </Header>
    </div>
  );
}
