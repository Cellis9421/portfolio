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
  isCloseable = true,
  defaultOpen = false,
  inline = false,
}: Readonly<{
  title: string;
  children: React.ReactNode;
  onClose?: () => void;
  isCloseable?: boolean;
  defaultOpen?: boolean;
  inline?: boolean;
}>) {
  const [isDragging, setIsDragging] = useState(false);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState({ x: 40, y: 150 });
  const windowRef = useRef<HTMLDivElement>(null);
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const moveTo = (x: number, y: number) => {
    // clamp to the following to keep the window within the viewport:
    // x >= 0
    // y >= 150
    // x <= window.innerWidth - windowRef.current.clientWidth
    // y <= window.innerHeight - windowRef.current.clientHeight
    const clampedX = Math.max(
      0,
      Math.min(x, window.innerWidth - (windowRef?.current?.clientWidth || 0))
    );
    const clampedY = Math.max(
      150,
      Math.min(y, window.innerHeight - (windowRef?.current?.clientHeight || 0))
    );
    setPosition({
      x: clampedX,
      y: clampedY,
    });
  };

  useEffect(() => {
    const newX =
      window.innerWidth / 2 - (windowRef?.current?.clientWidth || 0) / 2;
    const newY =
      window.innerHeight / 2 - (windowRef?.current?.clientHeight || 0) / 2;
    moveTo(newX, newY);
    setIsOpen(defaultOpen);
  }, [defaultOpen]);

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
      // Remove event listeners when dragging is done
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };

    if (isDragging) {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("touchmove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      window.addEventListener("touchend", handleMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
      window.removeEventListener("touchend", handleMouseUp);
    };
  }, [isDragging, offset]);

  const handleMouseDown = useMemo(
    () => (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
      e.preventDefault(); // Prevent scrolling the page
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
      e.preventDefault(); // Prevent scrolling the page
      setIsDragging(true);
      setOffset({
        x: e.touches[0].clientX - position.x,
        y: e.touches[0].clientY - position.y,
      });
    },
    [position.x, position.y]
  );

  const handleOnClose = () => {
    if (isCloseable) {
      setIsOpen(false);
      onClose?.();
    }
  };

  const containerClasses = useMemo(
    () =>
      `text-white code-editor md:min-w-[400px] md:max-w-[800px] min-h-[200px] bg-editor.backgroundMedium rounded-lg ${
        inline ? "" : "absolute"
      } z-1000 overflow-hidden m-2`,
    [inline]
  );

  const buttonClasses = useMemo(
    () =>
      `text-white/70 hover:text-white/100 ${
        !isCloseable ? "cursor-not-allowed" : ""
      }`,
    [isCloseable]
  );

  const headerClasses = useMemo(
    () =>
      `${
        !inline ? "cursor-pointer" : ""
      } flex items-center justify-between p-2 pl-4 bg-editor.backgroundLight`,
    [inline]
  );

  if (!isOpen) return null;

  return (
    <div
      className={containerClasses}
      ref={windowRef}
      style={{
        left: position.x,
        top: position.y,
        boxShadow: "0px 4px 30px rgba(0, 0, 0, 0.5)",
      }}
    >
      <div
        className={headerClasses}
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        <div style={{ letterSpacing: "1.57px" }}>{title}</div>
        <button className={buttonClasses} onClick={handleOnClose}>
          X
        </button>
      </div>
      <div className="editor-content">{children}</div>
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
