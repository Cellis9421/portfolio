"use client";

import { Crimson_Pro } from "next/font/google";
import { ReactNode } from "react";
import { twMerge } from "tailwind-merge";

const crimsonPro = Crimson_Pro({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
});

/**
 * Renders content in a paper-like block: off-white background, serif type, ink-colored text.
 * Accepts the same lines array as JSComments (strings and JSX); strings become paragraphs, JSX renders inline.
 */
export default function PaperBlock({
  linesOfText,
  className,
}: {
  linesOfText: (string | ReactNode)[];
  className?: string;
}) {
  return (
    <div
      className={twMerge(
        "relative bg-stone-50 text-stone-800 shadow-lg border border-stone-200/80 p-6 md:p-8 max-w-2xl overflow-hidden",
        className
      )}
    >
      <div
        aria-hidden
        className="pointer-events-none absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-stone-200/60 to-transparent"
      />
      <div className="relative flex flex-col gap-4 max-w-prose">
        {linesOfText.map((line, index) => {
          if (line === " " || (typeof line === "string" && line.trim() === "")) {
            return null;
          }
          if (typeof line === "string") {
            return (
              <p key={index} className="leading-relaxed text-stone-800">
                {line}
              </p>
            );
          }
          return (
            <span key={index} className="inline">
              {line}
            </span>
          );
        })}
      </div>
    </div>
  );
}
