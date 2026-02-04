import { CodeBracketIcon } from "@heroicons/react/24/outline";

/**
 * Default icon for projects without screenshots.
 * Shows a code bracket icon on a gradient background.
 */
export default function DefaultProjectIcon({ color = "blue-500" }: { color?: string }) {
  return (
    <div className={`w-full h-full flex items-center justify-center bg-${color}`}>
      <CodeBracketIcon className="w-16 h-16 text-white/80" />
    </div>
  );
}
