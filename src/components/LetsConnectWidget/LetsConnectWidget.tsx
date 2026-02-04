"use client";
/* eslint-disable @next/next/no-img-element */
import { LinkedInIcon } from "@/app/icons/LinkedInIcon";
import { Octocat } from "@/app/icons/Octocat";
import Header from "@/components/Header/Header";
import { ABOUT_ME_WINDOW_ID } from "@/configs/constants";
import { useWindowManagerCtx } from "@/contexts/WindowManagerCtx";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { CWindowAboutMe } from "../CWindow/AboutMe/CWindowAboutMe";

/**
 * Widget with links to connect with me on Github, LinkedIn, and Email.
 * @returns
 */
export const LetsConnectWidget = ({
  showEmail,
  onlyPhoto,
}: {
  showEmail?: boolean;
  onlyPhoto?: boolean;
}) => {
  const { toggle } = useWindowManagerCtx();
  const iconLinkBase =
    "group flex flex-1 min-h-[44px] min-w-[44px] items-center justify-center border border-white/20 text-white transition-all duration-normal motion-reduce:transition-none active:scale-95 motion-reduce:active:scale-100 focus-ring";

  return (
    <>
      <div className="flex items-center justify-center">
        <div className="flex items-center gap-4">
          {!onlyPhoto && (
            <div className="flex flex-col h-[200px] w-12 shrink-0 gap-4">
              <a
                href="https://github.com/Cellis9421"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with me on Github"
                className={`${iconLinkBase} bg-purple-500 hover:bg-purple-600 border-purple-400/50`}
              >
                <Octocat className="w-6 h-6 shrink-0 transition-transform duration-normal group-hover:scale-110" />
              </a>
              <a
                href="https://www.linkedin.com/in/calvin-ellis-ma"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Connect with me on LinkedIn"
                className={`${iconLinkBase} bg-[#0A66C2] hover:bg-[#004182] border-blue-400/50`}
              >
                <LinkedInIcon className="w-6 h-6 shrink-0 transition-transform duration-normal group-hover:scale-110" />
              </a>
              <a
                href="mailto:calvin@calvinellis.io"
                target="_blank"
                aria-label="Connect with me via Email"
                className={`${iconLinkBase} bg-cyan-500 hover:bg-cyan-600 border-cyan-400/50`}
              >
                <EnvelopeIcon className="w-6 h-6 shrink-0 transition-transform duration-normal group-hover:scale-110" />
              </a>
            </div>
          )}
          <button
            type="button"
            className="w-[200px] h-[200px] min-w-[44px] min-h-[44px] shrink-0 border-2 border-stone-500/50 overflow-hidden transition-colors duration-normal motion-reduce:transition-none hover:border-stone-400/60 active:scale-[0.98] motion-reduce:active:scale-100 cursor-pointer group/btn focus-ring rounded"
            onClick={() => toggle(ABOUT_ME_WINDOW_ID)}
            aria-label="Open about me"
          >
            <img
              src="/imgthumb/avatars/calvin_ellis_headshot_transparent.png"
              alt="Calvin Ellis"
              className="w-full h-full object-cover"
            />
          </button>
        </div>
      </div>
      {showEmail && (
        <div className="text-center p-4 mt-4">
          <Header as="h2">calvin@calvinellis.io</Header>
        </div>
      )}

      <CWindowAboutMe />
    </>
  );
};
