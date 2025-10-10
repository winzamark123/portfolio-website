import { ThemeProvider } from '@/components/theme-provider';
import type { Metadata } from 'next';
import { Lora } from 'next/font/google';
import './globals.scss';

const lora = Lora({
  subsets: ['latin'],
  variable: '--font-lora',
  display: 'swap',
});

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
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="icon" href="/ResumeIcon.ico" />
      </head>
      <body className={lora.variable}>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          disableTransitionOnChange
        >
          <div className="max-w-screen flex flex-col items-center justify-center overflow-hidden">
            {children}
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
