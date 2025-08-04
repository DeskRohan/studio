
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { Header, MobileNav } from '@/components/header';
import { Footer } from '@/components/footer';
import { NivaFab } from '@/components/niva-fab';
import { useIsMobile } from '@/hooks/use-mobile';


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const isMobile = useIsMobile();

  return (
    <html lang="en" suppressHydrationWarning>
      <head />
      <body className="font-sans">
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen w-full flex-col bg-background">
            <Header />
            <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8 pb-24 md:pb-8">
              {children}
            </main>
            <NivaFab />
            {isMobile && <MobileNav />}
            <div className="hidden md:block">
              <Footer />
            </div>
          </div>
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
