import Link from 'next/link';
import { GraduationCap, Linkedin, Instagram, Github } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t bg-background px-4 py-4 md:px-8">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <GraduationCap className="h-5 w-5 text-primary" />
          <span>© {new Date().getFullYear()} NextGenSDE</span>
        </div>
        <div className="text-center text-sm text-muted-foreground">
          Created by{' '}
          <span className="font-semibold text-foreground">
            Rohan Godakhindi
          </span>{' '}
          (CEO & Founder)
        </div>
        <div className="flex items-center gap-4">
          <Link href="https://www.linkedin.com/in/rohan-godakhindi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Linkedin className="h-5 w-5" />
            <span className="sr-only">LinkedIn</span>
          </Link>
          <Link href="https://www.instagram.com/rohan_g_21" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Instagram className="h-5 w-5" />
            <span className="sr-only">Instagram</span>
          </Link>
          <Link href="https://github.com/rohan-godakhindi" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-primary transition-colors">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </Link>
        </div>
      </div>
    </footer>
  );
}
