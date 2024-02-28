import { useMemo } from "react";

/**
 * For rendering a block of JS comments with a given array of lines of text
 * @param param0
 * @returns
 */
const JSComments = ({
  linesOfText,
  color = "editor.comment",
}: {
  linesOfText: (string | JSX.Element)[];
  color?: string;
}) => {
  const textColor = useMemo(() => `text-${color}`, [color]);
  return (
    <div>
      <p className="flex flex-col">
        <span className={textColor}>{`/**`}</span>
        {linesOfText.map((line, index) => (
          <span key={index} className={`flex pl-1 md:pl-2 ${textColor}`}>
            <div className="md:pl-2 pl-1 min-h-4">{line}</div>
          </span>
        ))}
        <span className={`${textColor} pl-2`}>{`*/`}</span>
      </p>
    </div>
  );
};

export default JSComments;
