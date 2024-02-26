/* eslint-disable @next/next/no-img-element */
import Image from "next/image";
import Link from "next/link";
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
        ? `../../../imgthumb/screenshots/${src}`
        : `https://calvinellis.io/imgthumb/screenshots/${src}`,
    [src]
  );

  return (
    <Link href={normalizedSrc} target="_blank">
      <img
        src={normalizedSrc}
        alt={alt}
        width={300}
        height={160}
        sizes="100vw"
        style={{ width: "100%", height: "auto", borderRadius: "10px" }}
      />
    </Link>
  );
};

export default Screenshot;
