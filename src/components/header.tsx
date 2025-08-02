
'use client';

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { LogOut, User, GraduationCap, Mic, Library, Rocket, Home, BookText, UserCircle } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

const AUTH_KEY = 'authenticated_v2';


const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/study-plan", icon: Rocket, label: "Roadmap" },
  { href: "/question-bank", icon: BookText, label: "Questions" },
  { href: "/resources", icon: Library, label: "Resources" },
  { href: "/ai-interviewer", icon: Mic, label: "Interviewer" },
  { href: "/profile", icon: User, label: "Profile" },
];

const desktopNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study-plan", label: "My Roadmap" },
  { href: "/question-bank", label: "Question Bank"},
  { href: "/resources", label: "Resources" },
  { href: "/ai-interviewer", label: "AI Interviewer" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem(AUTH_KEY);
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-30 flex h-16 items-center gap-4 border-b bg-background/[.96] px-4 sm:px-8">
       <div className="flex w-full items-center justify-between">
         <nav className="hidden flex-col gap-6 text-lg font-medium md:flex md:flex-row md:items-center md:gap-5 md:text-sm lg:gap-6">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold md:text-base">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="text-xl font-bold text-primary font-headline">NextGenSDE</span>
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
        
        <div className="flex w-full items-center justify-between md:hidden">
            <Link href="/dashboard" className="flex items-center gap-2 text-lg font-semibold">
                <GraduationCap className="h-6 w-6 text-primary" />
                <span className="font-bold text-primary font-headline">NextGenSDE</span>
            </Link>
        </div>

        <div className="flex flex-1 items-center justify-end gap-2">
            <TooltipProvider>
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <Button variant="ghost" size="icon" asChild>
                          <Link href="/profile">
                              <User className="h-5 w-5" />
                              <span className="sr-only">Profile</span>
                          </Link>
                       </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>My Profile</p>
                    </TooltipContent>
                </Tooltip>
                 <Tooltip>
                    <TooltipTrigger asChild>
                       <Button variant="ghost" size="icon" asChild>
                          <Link href="/architect">
                              <UserCircle className="h-5 w-5" />
                              <span className="sr-only">The Architect</span>
                          </Link>
                       </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>The Architect</p>
                    </TooltipContent>
                </Tooltip>
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button variant="ghost" size="icon" onClick={handleLogout}>
                            <LogOut className="h-5 w-5" />
                            <span className="sr-only">Logout</span>
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>Logout</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <ThemeToggle />
        </div>
      </div>
    </header>
  );
}


export function MobileNav() {
    const pathname = usePathname();

    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
            <div className="border-t bg-background/[.96] p-2">
                <TooltipProvider>
                    <nav className="grid grid-cols-5 items-center justify-around gap-1">
                        {navItems.filter(i => i.href !== '/profile').map((item) => (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors",
                                            pathname.startsWith(item.href)
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="hidden text-center text-[10px] leading-none xs:block">{item.label}</span>
                                    </Link>
                                </TooltipTrigger>
                                <TooltipContent side="top" className="mb-2 block xs:hidden">
                                    <p>{item.label}</p>
                                </TooltipContent>
                            </Tooltip>
                        ))}
                    </nav>
                </TooltipProvider>
            </div>
        </div>
    );
}
