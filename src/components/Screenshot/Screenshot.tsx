import Image from "next/image";

/**
 * Screenshot as a next/image component
 * Makes it easier to use the screenshot styles (100% width, border-radius, pathing)
 * @param alt alt text for the image
 * @param src filename within the /public/screenshots directory
 * @returns next/image component with the screenshot styles and src
 */
const Screenshot = ({ src, alt }: { src: string; alt: string }) => (
  <Image
    src={`/../../../screenshots/${src}`}
    alt={alt}
    width={0}
    height={0}
    sizes="100vw"
    style={{ width: "100%", height: "auto", borderRadius: "10px" }}
  />
);

export default Screenshot;
