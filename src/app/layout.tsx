
'use client';

import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';
import { SplashScreen } from '@/components/splash-screen';
import { useState, useEffect } from 'react';

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // This logic now only applies to the very first load of the entire app in a session.
    // The post-login splash is handled in the page.tsx itself.
    const hasVisited = sessionStorage.getItem('splashScreenShown');
    if (hasVisited) {
      setIsLoading(false);
      return;
    }
    
    // For the very first visit, show the splash screen, then mark it as shown.
    const timer = setTimeout(() => {
      setIsLoading(false);
      sessionStorage.setItem('splashScreenShown', 'true');
    }, 2500); 

    return () => clearTimeout(timer);
  }, []);

  // Show a splash screen only on the initial load of the application
  if (isLoading) {
    return (
       <html lang="en" suppressHydrationWarning>
        <head />
        <body>
          <SplashScreen />
        </body>
      </html>
    )
  }

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
          {children}
          <Toaster />
        </ThemeProvider>
      </body>
    </html>
  );
}
