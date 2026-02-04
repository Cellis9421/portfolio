import Footer from '@/components/Footer/Footer';
import Navigation from '@/components/Navigation/Navigation';
import NavigationProvider from '@/contexts/NavigationCtx';
import WindowManagerProvider from '@/contexts/WindowManagerCtx';
import type { Metadata } from 'next';
import { Work_Sans } from 'next/font/google';
import './globals.css';

const workSans = Work_Sans({ subsets: ['latin'], weight: '500' });

export const metadata: Metadata = {
  title: 'Calvin Ellis | Portfolio',
  description:
    'Software engineer based in the United States. I specialize in front-end development, with experience in back-end development and DevOps. I build accessible, performant web applications.',
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
