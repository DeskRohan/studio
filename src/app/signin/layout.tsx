
import { Toaster } from '@/components/ui/toaster';
import { ThemeProvider } from '@/components/theme-provider';

export default function SignInLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      {children}
    </>
  );
}
