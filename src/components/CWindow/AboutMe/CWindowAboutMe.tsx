import Link from "next/link";
import CWindow from "../CWindow";
import { Octocat } from "@/app/icons/Octocat";
import { ABOUT_ME_WINDOW_ID } from "@/configs/constants";
import { useWindowManagerCtx } from "@/contexts/WindowManagerCtx";

type Me = {
  [key: string]: any;
};

const me: Me = {
  currentRole: "Principal Software Engineer",
  industries: ["E-commerce", "Cybersecurity", "Finance", "Healthcare"],
  location: "United States (EST)",
  languages: ["English (Native)"],
  hobbies: ["Gaming", "Music", "Computers", "Technology", "Learning"],
};

export const CWindowAboutMe = () => {
  const { isOpen, close } = useWindowManagerCtx();
  return (
  <CWindow
    title="About Calvin Ellis"
    defaultOpen={isOpen(ABOUT_ME_WINDOW_ID)}
    onClose={() => close(ABOUT_ME_WINDOW_ID)}
  >
    <code className="code">
      <div className="p-2 md:p-6 text-xs md:text-sm">
        <p>
          <span className="color-0">const </span>
          <span className="color-2">CALVIN_ELLIS</span> = <span>{`{`}</span>
        </p>

        {Object.keys(me).map((key: string) => {
          const value = me[key];
          let type = typeof value;
          const isArray = Array.isArray(value);
          return (
            <p className="property" key={key}>
              <span className="color-2">{key}</span>
              <span>: </span>
              <span className={`color-${type === "string" ? 1 : 0}`}>
                {(() => {
                  switch (type) {
                    case "string":
                      return <span className="color-1">{`"${value}"`}</span>;
                    case "boolean":
                      return <span className="color-3">{String(value)}</span>;
                    case "number":
                      return <span className="color-2">{String(value)}</span>;
                    case "object":
                      if (isArray) {
                        return (
                          <span className="color-4">
                            {`[`}
                            <span className="color-1">
                              {value.map((v: any) => `"${v}"`).join(", ")}
                            </span>
                            {`]`}
                          </span>
                        );
                      }
                      return <span className="color-4">{String(value)}</span>;
                    default:
                      return <span className="color-1">{String(value)}</span>;
                  }
                })()}
              </span>
              ,
            </p>
          );
        })}
        {/** Github Link */}
        <p className="property">
          <Link
            href="https://github.com/Cellis9421"
            target="_blank"
            className="flex group"
            title="Cellis9421's GitHub Profile"
          >
            <span className="color-2">github</span>
            <span>: </span>
            <span className="flex ml-2 space-x-2">
              <span className="color-4">Cellis9421</span>
              <span className="text-editor.comment hidden group-hover:flex ">
                {"// Check out my GitHub!"}
                <Octocat className="pl-2" />
              </span>
            </span>
          </Link>
        </p>
        {/** LinkedIn Link */}
        <p className="property">
          <Link
            href="https://www.linkedin.com/in/calvin-ellis-ma/"
            target="_blank"
            className="flex group"
            title="Cellis9421's LinkedIn Profile"
          >
            <span className="color-2">linkedin</span>
            <span>: </span>
            <span className="flex ml-2 space-x-2">
              <span className="color-4">Calvin Ellis</span>
              <span className="text-editor.comment hidden group-hover:flex ">
                {"// Connect with me on LinkedIn!"}
              </span>
            </span>
          </Link>
        </p>
        <span>{`}`}</span>
      </div>
    </code>
  </CWindow>
)};
