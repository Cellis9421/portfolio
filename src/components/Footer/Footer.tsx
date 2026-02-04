"use client";

import NAVIGATION from "@/configs/NAVIGATION";
import Link from "next/link";

export default function Footer() {
  return (
    <section
      className="w-full py-8 md:py-10 bg-section-dark px-4"
      aria-label="Site navigation"
    >
      <div className="flex flex-col items-center gap-4 max-w-6xl mx-auto">
        <nav
          className="flex flex-wrap items-center justify-center gap-x-2 gap-y-2 text-sm text-white/90"
          aria-label="Footer"
        >
          {NAVIGATION.items.map((item, index) => {
            const isExternal = item.href?.startsWith("http") ?? false;
            const linkClass =
              "text-white/90 hover:text-editor.component transition-colors duration-normal focus-ring rounded px-0.5 text-center inline-block";
            return (
              <span
                key={`${item.label}-${index}`}
                className="flex items-center justify-center gap-x-2"
              >
                {index > 0 && (
                  <span className="text-editor.tag px-3" aria-hidden>
                    |
                  </span>
                )}
                {isExternal ? (
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={linkClass}
                    title={item.label}
                  >
                    {item.label}
                  </a>
                ) : (
                  <Link href={item.href ?? "/"} className={linkClass} title={item.label}>
                    {item.label}
                  </Link>
                )}
              </span>
            );
          })}
        </nav>
        <p className="text-sm text-white/90 text-center">
          &copy; {new Date().getFullYear()} Calvin Ellis. All rights reserved.
        </p>
      </div>
    </section>
  );
}
