/**
 * Centered section description text.
 * Used across Skills, Work History, Projects, Education sections.
 */
export default function SectionDescription({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={`text-center text-white/90 text-lg max-w-2xl mx-auto ${className}`}>
      {children}
    </p>
  );
}
