import Nav from './_components/Nav/Nav';
import Footer from './_components/Footer/Footer';

import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import './globals.scss';

interface RootLayoutProps {
  children: React.ReactNode;
}

export const metadata: Metadata = {
  title: 'Win Cheng - Portfolio',
  description:
    'Portfolio of Win Cheng, a software engineer based in San Francisco.',
};

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <html lang="en" suppressHydrationWarning>
        <head>
          <link rel="icon" href="/ResumeIcon.ico" />
        </head>
        <body>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            <Nav />
            <div className="flex flex-col items-center justify-center">
              {children}
            </div>
            <Footer />
          </ThemeProvider>
        </body>
      </html>
    </>
  );
}
