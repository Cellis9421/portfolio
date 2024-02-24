import type { Metadata } from "next";
import { Work_Sans } from "next/font/google";
import "./globals.css";
import Navigation from "@/components/Navigation/Navigation";
import NavigationProvider from "@/contexts/NavigationCtx";

const workSans = Work_Sans({ subsets: ["latin"], weight: "500" });

export const metadata: Metadata = {
  title: "Calvin Ellis | Protfolio",
  description:
    "I am a a software engineer based in the United States. I specialize in front-end development, with experience in back-end development and DevOps. I am passionate about creating beautiful, accessible, and performant web applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NavigationProvider>
        <body className={`${workSans.className} bg-editor.background text-editor.text`}>
          <Navigation />
          <main className="flex min-h-screen flex-col items-center justify-center p-4 lg:p-36 mx-auto pt-24 md:pt-36">
            {children}
          </main>
        </body>
      </NavigationProvider>
    </html>
  );
}
