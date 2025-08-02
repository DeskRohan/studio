
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { LogOut, User, MessageSquare, GraduationCap, Mic, Library, Rocket, Home, BookText } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/study-plan", icon: Rocket, label: "Roadmap" },
  { href: "/question-bank", icon: BookText, label: "Questions" },
  { href: "/resources", icon: Library, label: "Resources" },
  { href: "/ai-interviewer", icon: Mic, label: "Interviewer" },
  { href: "/architect", icon: User, label: "Architect" },
];

const desktopNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study-plan", label: "My Roadmap" },
  { href: "/question-bank", label: "Question Bank"},
  { href: "/resources", label: "Resources" },
  { href: "/ai-tutor", label: "AI Tutor" },
  { href: "/ai-interviewer", label: "AI Interviewer" },
  { href: "/architect", label: "The Architect" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/95 backdrop-blur-sm px-4 md:px-8">
      {/* Desktop Navigation */}
      <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
        <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold text-primary">NextGenSDE</span>
        </Link>
        {desktopNavItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={cn(
              "transition-colors hover:text-foreground",
              pathname === item.href ? "text-foreground font-semibold" : "text-muted-foreground"
            )}
          >
            {item.label}
          </Link>
        ))}
      </nav>
      
      {/* Mobile Header */}
       <div className="flex w-full items-center md:hidden">
         <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold text-primary">NextGenSDE</span>
        </Link>
      </div>


      <div className="flex items-center gap-4 md:ml-auto md:gap-2 lg:gap-4">
        <div className="ml-auto flex-1 sm:flex-initial">
          <ThemeToggle />
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" size="icon" className="rounded-full">
              <User className="h-5 w-5" />
              <span className="sr-only">Toggle user menu</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
             <DropdownMenuLabel>My Account</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleLogout}>
              <LogOut className="mr-2 h-4 w-4" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}


export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-40">
            <div className="bg-background/95 backdrop-blur-sm border-t p-2">
                <nav className="grid grid-cols-6 items-center justify-around gap-1">
                    {navItems.map((item) => (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={cn(
                                "flex flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors",
                                pathname.startsWith(item.href)
                                ? "bg-primary/10 text-primary font-semibold"
                                : "text-muted-foreground hover:bg-muted"
                            )}
                        >
                            <item.icon className="h-5 w-5" />
                            <span className="text-[10px] leading-none text-center">{item.label}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
}
