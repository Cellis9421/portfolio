import Image from "next/image";
import { useMemo } from "react";

/**
 * Screenshot as a next/image component
 * Makes it easier to use the screenshot styles (100% width, border-radius, pathing)
 * @param alt alt text for the image
 * @param src filename within the /public/screenshots directory
 * @returns next/image component with the screenshot styles and src
 */
const Screenshot = ({ src, alt }: { src: string; alt: string }) => {
  // When local development, the path is different than when deployed
  // This is a workaround to make sure the path is correct in both cases
  const normalizedSrc = useMemo(
    () =>
      process.env.NODE_ENV === "development"
        ? `../../../screenshots/${src}`
        : `https://calvinellis.io/screenshots/${src}`,
    [src]
  );
  return (
    <Image
      src={normalizedSrc}
      alt={alt}
      width={0}
      height={0}
      sizes="100vw"
      style={{ width: "100%", height: "auto", borderRadius: "10px" }}
    />
  );
};

export default Screenshot;
