import Link from "next/link";
import CWindow from "../CWindow";
import { Octocat } from "@/app/icons/Octocat";
import { LinkedInIcon } from "@/app/icons/LinkedInIcon";
import JSComments from "@/components/JSComments/JSComments";

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

export const CWindowAboutMe = () => (
  <CWindow
    title="About Calvin Ellis"
    defaultOpen={true}
    inline
    isCloseable={false}
  >
    <code className="code">
      <div className="p-2 md:p-6 text-xs md:text-sm">
        <JSComments
          // color="white"
          linesOfText={[
            <span className="group" key="welcome">
              Welcome to my portfolio!
              <span className="animate-spin">🥳</span>
            </span>,
            " ",
            "I am a Software Engineer with over 10 years experience building",
            "full-stack solutions in the cybersecurity/e-commerce domains.",
            "I have a passion for problem-solving and creating efficient,",
            "scalable solutions through code and infrastructure.",
            "I enjoy collaborating with teams on difficult problems,",
            "learning new technologies, and staying up-to-date with trends.",
            " ",
            "Some of my favorite tech I've worked with professionally includes:",
            "Typescript, React, Java, Next.js, TailwindCSS, PHP, Python,",
            "Node.js, PostgreSQL, Kubernetes, GCP, and Firebase.",
            " ",
            "- Calvin Ellis",
            " ",
            <Link
              href="https://github.com/Cellis9421"
              target="_blank"
              className="flex group space-x-1"
              title="Calvin's GitHub Profile"
              key="ghlink"
            >
              <Octocat className="w-4" />
              <span>cellis9421</span>
            </Link>,
            " ",
            <Link
              href="https://www.linkedin.com/in/calvin-ellis-ma"
              target="_blank"
              className="flex group space-x-1"
              title="Calvin's LinkedIn Profile"
              key="linkedinlink"
            >
              <LinkedInIcon className="w-4" />
              <span>linkedin.com/in/calvin-ellis-ma</span>
            </Link>,
          ]}
        />
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
);
