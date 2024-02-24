"use client";
import HTMLText from "@/components/HTMLText/HTMLText";
import Header from "@/components/Header/Header";
import { ROLES } from "@/configs/constants";
import { TypeAnimation } from "react-type-animation";




export default function Home() {
  return (
    <>
      <Header as="h1" className="text-white pb-4">
        Calvin Ellis
      </Header>
      <HTMLText
        componentName="CalvinEllis"
        propertyNameValuePairs={{
          role: ROLES,
        }}
        className="text-xl hidden md:text-3xl sm:flex"
      />
      <TypeAnimation
        sequence={ROLES}
        wrapper="p"
        speed={15}
        style={{}}
        repeat={Infinity}
        className="text-xl sm:hidden text-editor.propertyValue"
      />
    </>
  );
}
