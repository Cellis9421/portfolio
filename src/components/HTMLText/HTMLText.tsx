import { Inconsolata } from "next/font/google";
import { useMemo } from "react";
import { TypeAnimation } from "react-type-animation";
import { twMerge } from "tailwind-merge";

const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "500"] });

/**
 * HTMLText Component to render HTML content with TailwindCSS styles to match the theme of my VSCode
 * @param componentName The name of the component to render
 * @param className The classes to add to the component
 */
function HTMLText({
  className,
  componentName,
  propertyNameValuePairs = {},
}: {
  componentName: string;
  className?: string;
  propertyNameValuePairs?: { [key: string]: string | Array<string | number> };
}) {
  const wrapperClasses = useMemo(
    () => twMerge(inconsolata.className, "flex space-x-1 flex-wrap justify-center", className),
    [className]
  );
  return (
    <span className={wrapperClasses}>
      <span className="text-editor.tag">{"<"}</span>
      <span className="text-editor.component">{componentName}</span>
      {Object.keys(propertyNameValuePairs).map((key) => {
        const value = propertyNameValuePairs[key];
        return (
          <span key={key} className="px-1 flex flex-nowrap">
            <span className="text-editor.property">{key}</span>
            <span className="text-white">=</span>
            {(() => {
              // If the value is an array, animate it as a list
              if (Array.isArray(value)) {
                return (
                  <span className="text-editor.propertyValue">
                    {`"`}
                    <TypeAnimation
                      sequence={value}
                      wrapper="span"
                      speed={15}
                      style={{ display: "inline-block" }}
                      repeat={Infinity}
                    />
                    <span className="-ml-1.5">{`"`}</span>
                  </span>
                );
              } else {
                // Otherwise, just render the value
                return (
                  <span className="text-editor.propertyValue">{`"${value}"`}</span>
                );
              }
            })()}
          </span>
        );
      })}
      <span className="text-editor.tag">{" />"}</span>
    </span>
  );
}

export default HTMLText;
