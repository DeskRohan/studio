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
import { LogOut, User, LayoutDashboard, BookOpen, MessageSquare, GraduationCap } from "lucide-react";
import { ThemeToggle } from "./theme-toggle";
import { cn } from "@/lib/utils";
import { Separator } from "./ui/separator";

const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/study-plan", icon: BookOpen, label: "My Roadmap" },
  { href: "/ai-tutor", icon: MessageSquare, label: "AI Tutor" },
];

export function Header() {
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = () => {
    sessionStorage.removeItem('authenticated');
    router.push('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-card">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Link href="/dashboard" className="mr-6 flex items-center space-x-2">
            <GraduationCap className="h-6 w-6 text-primary" />
            <span className="font-bold">NextGenSDE</span>
          </Link>
          <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
             {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "transition-colors hover:text-foreground/80",
                  pathname === item.href ? "text-foreground" : "text-foreground/60"
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-end space-x-4">
            <div className="hidden md:flex items-center gap-4">
              <Separator orientation="vertical" className="h-6"/>
              <span className="font-semibold text-sm text-muted-foreground">Rohan Godakhindi (CEO & Founder)</span>
            </div>
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                 <Button variant="ghost" size="icon" className="rounded-full">
                  <User className="h-5 w-5" />
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
      </div>
    </header>
  );
}
