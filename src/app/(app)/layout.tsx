
'use client';

import { useState } from 'react';
import { SplashScreen } from '@/components/splash-screen';

export default function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isAuthenticating, setIsAuthenticating] = useState(false); // No longer authenticating, but keeping for structure

  // The authentication logic that was causing the error has been removed.

  if (isAuthenticating) {
    return <SplashScreen />;
  }

  // The main UI components like Header and Footer are now rendered by the root layout.
  // This layout is now just a pass-through for its children.
  return <>{children}</>;
}
