import Link from 'next/link';
import { GraduationCap } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background px-4 py-4 md:px-8">
      <div className="container mx-auto flex items-center justify-center gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span>© {new Date().getFullYear()} NextGenSDE</span>
        </div>
      </div>
    </footer>
  );
}
