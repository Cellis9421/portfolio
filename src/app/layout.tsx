import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
import NavigationProvider from '@/contexts/NavigationCtx';
import WindowManagerProvider from '@/contexts/WindowManagerCtx';
import '@/lib/styles/globals.css';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';

const workSans = Work_Sans({ subsets: ['latin'], weight: '500' });

export const metadata: Metadata = {
  title: 'Portfolio | Calvin Ellis',
  description:
    'Calvin Ellis is a principal software engineer with over 15 years of experience based in the United States. He specializes in agentic solutions and building accessible, performant, scalable web applications.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <NavigationProvider>
        <WindowManagerProvider>
          <body className={`${workSans.className} bg-editor.background text-editor.text`}>
            <Navigation />
            <main className="flex flex-col items-center w-full pt-24 md:pt-32">{children}</main>
            <Footer />
          </body>
        </WindowManagerProvider>
      </NavigationProvider>
    </html>
  );
}
