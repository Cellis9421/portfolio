/**
 * CWindow is a component that is used to create a window with a title bar and a close button.
 * This window can be dragged around the screen by clicking and dragging the title bar.
 */

import { Octocat } from "@/app/icons/Octocat";
import Link from "next/link";
import React, { useEffect, useMemo, useRef, useState } from "react";

function CWindow({
  title,
  children,
  onClose,
}: Readonly<{
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
}>) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 40, y: 150 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  const moveTo = (x: number, y: number) => {
    // clamp to the following to keep the window within the viewport:
    // x >= 0
    // y >= 150
    // x <= window.innerWidth - windowRef.current.clientWidth
    // y <= window.innerHeight - windowRef.current.clientHeight
    setPosition({
      x: Math.max(
        0,
        Math.min(x, window.innerWidth - (windowRef?.current?.clientWidth || 0))
      ),
      y: Math.max(
        150,
        Math.min(
          y,
          window.innerHeight - (windowRef?.current?.clientHeight || 0)
        )
      ),
    });
  };

  // On mount move to the bottom center of the screen
  useEffect(() => {
    if (!isOpen) {
      setPosition({
        x: window.innerWidth / 2 - (windowRef?.current?.clientWidth || 0) / 2,
        y: window.innerHeight / 2 - (windowRef?.current?.clientHeight || 0) - 150,
      });
      setIsOpen(true);
    }
  }, []);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent | TouchEvent) => {
      if (isDragging) {
        const clientX =
          e instanceof MouseEvent ? e.clientX : e.touches[0].clientX;
        const clientY =
          e instanceof MouseEvent ? e.clientY : e.touches[0].clientY;
        // Get new position
        const newX = clientX - offset.x;
        const newY = clientY - offset.y;

        moveTo(newX, newY);
      }
    };

    const handleMouseUp = () => {
      setIsDragging(false);
    };

    if (isDragging) {
      console.log("Adding event listeners");
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      console.log("Removing event listeners");
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = useMemo(
    () => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      setIsDragging(true);
      setOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y,
      });
    },
    [position.x, position.y]
  );

  const handleTouchStart = useMemo(
    () => (e: React.TouchEvent<HTMLDivElement>) => {
      setIsDragging(true);
      setOffset({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    },
    [position.x, position.y]
  );

  const handleOnClose = () => {
    setIsOpen(false);
    onClose?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="text-white code-editor md:min-w-[400px] md:max-w-[800px] min-h-[200px] bg-editor.backgroundMedium rounded-lg absolute z-1000 overflow-hidden m-2"
      ref={windowRef}
      style={{
        left: position.x,
        top: position.y,
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className="cursor-pointer flex items-center justify-between p-2 pl-4 mb-4 bg-editor.backgroundLight"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={{ letterSpacing: "1.57px" }}>{title}</div>
        <button className="pr-2 hover:text-white/70" onClick={handleOnClose}>
          X
        </button>
      </div>
      <div className="editor-content px-4 pb-4">{children}</div>
    </div>
  );
}

/**
 * Example usage:
 */
// <CWindow title="Example Window" onClose={() => console.log("Closed!")}>
//   <p>Some content here</p>
// </CWindow>

export default CWindow;

export const CWindowExample = () => (
  <CWindow title="Example Window" onClose={() => console.log("Closed!")}>
    <code className="code">
      <p>
        <span className="color-0">.code-editor </span> <span>{`{`}</span>
      </p>
      <p className="property">
        <span className="color-2">max-width</span>
        <span>: </span>
        <span className="color-1">300px</span>;
      </p>
      <p className="property">
        <span className="color-2">background-color</span>
        <span>: </span>
        <span className="color-preview-1"></span>
        <span className="">#1d1e22</span>;
      </p>
      <p className="property">
        <span className="color-2"> box-shadow</span>
        <span>: </span>
        <span className="color-1">
          0px 4px 30px <span className="color-preview-2"></span>
          <span className="color-3">rgba(</span>0, 0, 0, 0.5
          <span className="color-3">)</span>
        </span>
        ;
      </p>
      <p className="property">
        <span className="color-2">border-radius</span>
        <span>: </span>
        <span className="color-1">8px</span>;
      </p>
      <span>{`}`}</span>
    </code>
  </CWindow>
);
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

/**
 * Welcome to my portfolio! 🥳
 */
export const CWindowAboutMe = () => (
  <CWindow title="About Calvin Ellis">
    <code className="code">
      <p className="flex flex-col">
        <span className="text-editor.comment">{`/**`}</span>
        <span className="text-editor.comment pl-2">
          {`* 🥳 Welcome to my portfolio!`}
        </span>
        <span className="text-editor.comment pl-2">
          {`* Here is a short "About Me" to get you started!`}
        </span>
        <span className="text-editor.comment pl-2">
          {`* (You can drag this window around, or close it)`}
        </span>
        <span className="text-editor.comment pl-2">{`*/`}</span>
      </p>
      <p>
        <span className="color-0">const </span>
        <span className="color-2">CALVIN_ELLIS</span> = <span>{`{`}</span>
      </p>

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
      <span>{`}`}</span>
    </code>
  </CWindow>
);
