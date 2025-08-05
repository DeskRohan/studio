
'use client';

import Link from "next/link";
import { useRouter } from "next/navigation";
import { usePathname } from "next/navigation";
import { GraduationCap, Mic, Library, Rocket, Home, BookText, DraftingCompass, LogOut, User, Loader2 } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { auth } from "@/lib/firebase";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";

const navItems = [
  { href: "/dashboard", icon: Home, label: "Dashboard" },
  { href: "/study-plan", icon: Rocket, label: "Roadmap" },
  { href: "/question-bank", icon: BookText, label: "Questions" },
  { href: "/resources", icon: Library, label: "Resources" },
  { href: "/ai-interviewer", icon: Mic, label: "Interviewer" },
];

const desktopNavItems = [
  { href: "/dashboard", label: "Dashboard" },
  { href: "/study-plan", label: "My Roadmap" },
  { href: "/question-bank", label: "Question Bank"},
  { href: "/resources", label: "Resources" },
  { href: "/ai-interviewer", label: "AI Interviewer" },
];

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const user = auth.currentUser;

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
        await auth.signOut();
        toast({
            title: "Logged Out",
            description: "You have been successfully logged out.",
        });
        router.push('/');
    } catch (error) {
        console.error("Logout Error:", error);
        toast({
            title: "Logout Failed",
            description: "Could not log you out. Please try again.",
            variant: "destructive",
        });
    } finally {
        setIsLoggingOut(false);
    }
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
                       <Link href="/architect" className="p-2 flex items-center justify-center rounded-full hover:bg-accent hover:text-accent-foreground">
                          <DraftingCompass className="h-5 w-5" />
                          <span className="sr-only">The Architect</span>
                       </Link>
                    </TooltipTrigger>
                    <TooltipContent>
                        <p>The Architect</p>
                    </TooltipContent>
                </Tooltip>
            </TooltipProvider>
            <ThemeToggle />
             <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                        <Avatar className="h-9 w-9">
                            <AvatarImage src={user?.photoURL || ''} alt={user?.displayName || 'User'} />
                            <AvatarFallback>
                                <User />
                            </AvatarFallback>
                        </Avatar>
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                    <DropdownMenuLabel className="font-normal">
                        <div className="flex flex-col space-y-1">
                            <p className="text-sm font-medium leading-none">{user?.displayName}</p>
                            <p className="text-xs leading-none text-muted-foreground">
                                {user?.email}
                            </p>
                        </div>
                    </DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                         <Link href="/profile">
                            <User className="mr-2 h-4 w-4" />
                            <span>Profile</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handleLogout} disabled={isLoggingOut}>
                       {isLoggingOut ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <LogOut className="mr-2 h-4 w-4" />}
                       <span>Log out</span>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>
        </div>
      </div>
    </header>
  );
}


export function MobileNav() {
    const pathname = usePathname();

    const mobileNavItems = navItems.map(item => ({...item, href: item.href.startsWith('/') ? item.href : `/${item.href}`}));


    return (
        <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden">
            <div className="border-t bg-background/[.96] p-2">
                <TooltipProvider>
                    <nav className="grid grid-cols-5 items-center justify-around gap-1">
                        {mobileNavItems.map((item) => (
                            <Tooltip key={item.href}>
                                <TooltipTrigger asChild>
                                    <Link
                                        href={item.href}
                                        className={cn(
                                            "flex flex-col items-center justify-center gap-1 rounded-md p-2 transition-colors",
                                            pathname === item.href
                                            ? "bg-primary/10 text-primary font-semibold"
                                            : "text-muted-foreground hover:bg-muted"
                                        )}
                                    >
                                        <item.icon className="h-5 w-5" />
                                        <span className="text-center text-[10px] leading-none">{item.label}</span>
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
