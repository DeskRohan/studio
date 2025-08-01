"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, GraduationCap, LayoutDashboard, MessageSquare } from "lucide-react";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarFooter,
  SidebarTrigger,
} from "@/components/ui/sidebar";


const navItems = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/study-plan", icon: BookOpen, label: "My Roadmap" },
  { href: "/ai-tutor", icon: MessageSquare, label: "AI Tutor" },
];

export function AppSidebar() {
  const pathname = usePathname();

  return (
    <Sidebar collapsible="icon">
        <SidebarHeader>
            <div className="flex items-center gap-2">
                 <Button asChild variant="ghost" size="icon" className="group flex h-9 w-9 shrink-0 items-center justify-center gap-2 rounded-full bg-primary text-lg font-semibold text-primary-foreground md:h-8 md:w-8 md:text-base">
                    <Link href="/dashboard">
                        <GraduationCap className="h-5 w-5 transition-all group-hover:scale-110" />
                    </Link>
                </Button>
                <span className="text-lg font-semibold">Prep Pro</span>
            </div>
        </SidebarHeader>
        <SidebarContent>
            <SidebarMenu>
                 {navItems.map((item) => (
                    <SidebarMenuItem key={item.href}>
                         <SidebarMenuButton
                            asChild
                            isActive={pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href))}
                            tooltip={item.label}
                        >
                            <Link href={item.href}>
                                <item.icon />
                                <span>{item.label}</span>
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                ))}
            </SidebarMenu>
        </SidebarContent>
         <SidebarFooter>
            <SidebarTrigger />
        </SidebarFooter>
    </Sidebar>
  );
}
