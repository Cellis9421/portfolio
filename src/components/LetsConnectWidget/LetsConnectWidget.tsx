"use client";
/* eslint-disable @next/next/no-img-element */
import { LinkedInIcon } from "@/app/icons/LinkedInIcon";
import { Octocat } from "@/app/icons/Octocat";
import Header from "@/components/Header/Header";
import { useWindowManagerCtx } from "@/contexts/WindowManagerCtx";
import { EnvelopeIcon } from "@heroicons/react/24/outline";
import { CWindowAboutMe } from "../CWindow/AboutMe/CWindowAboutMe";
import { ABOUT_ME_WINDOW_ID } from "@/configs/constants";

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
  return (
    <>
      <div className="relative h-full w-auto flex items-center justify-center mt-8 group">
        <div className="profileCard_container relative p-8 md:p-16 border-2 border-dashed rounded-full border-spacing-4 border-gray-400/50">
          <span className={onlyPhoto ? 'hidden' : ''}>
            {/** Github */}
            <a
              href="https://github.com/Cellis9421"
              target="_blank"
              aria-label="Connect with me on Github"
              className="profile_item -left-4 top-20 absolute rounded-full bg-cover cursor-pointer border border-gray-400/50 p-[2px] active:scale-95 hover:scale-95 transition-all duration-500"
            >
              <span className=" w-[40px] h-[40px] transition-all duration-500 rounded-full z-[2] bg-white p-1 flex items-center justify-center">
                <Octocat classic />
              </span>
            </a>

            {/** LinkedIn */}
            <a
              href="https://www.linkedin.com/in/calvin-ellis-ma"
              target="_blank"
              aria-label="Connect with me on LinkedIn"
              className="profile_item -right-4 top-20 absolute rounded-full bg-cover cursor-pointer border border-gray-400/50 p-[2px] active:scale-95 hover:scale-95 transition-all duration-500"
            >
              <span className="flex items-center justify-center w-[40px] h-[40px] transition-all duration-500 rounded-full z-[2] bg-white p-1">
                <LinkedInIcon classic />
              </span>
            </a>

            {/** Email link to calvin@calvinellis.io */}
            <a
              href="mailto:calvin@calvinellis.io"
              target="_blank"
              aria-label="Connect with me via Email"
              className="profile_item right-[40%] -bottom-4 absolute rounded-full bg-cover cursor-pointer border border-gray-400/50 p-[2px] active:scale-95 hover:scale-95 transition-all duration-500"
            >
              <span className="block w-[40px] h-[40px] transition-all duration-500 rounded-full z-[2] bg-white p-1">
                <EnvelopeIcon className="w-full h-full" />
              </span>
            </a>
          </span>
          {/** Profile Image */}
          <button
            className="profile_item w-[200px] h-[200px] border-2 rounded-full hover:border-gray-400/50 transition-all duration-500 z-0 cursor-pointer group-hover:scale-95"
            onClick={() => toggle(ABOUT_ME_WINDOW_ID)}
          >
            <div className="w-full group-hover:bg-white h-full flex items-center justify-center rounded-full object-cover transition-all duration-500">
              <img
                src="/imgthumb/avatars/calvin_ellis_headshot_transparent.png"
                alt="Calvin Ellis"
                className="w-full h-full rounded-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500 overflow-hidden"
              />
            </div>
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
