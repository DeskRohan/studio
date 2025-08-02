
'use client';

import { GraduationCap } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function SplashScreen() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className={cn(
            "flex h-screen w-full flex-col items-center justify-center bg-background text-primary transition-opacity duration-500",
            isMounted ? "opacity-100" : "opacity-0"
        )}>
            <div className="relative">
                <div className={cn("transition-all duration-1000", isMounted ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-4")}>
                    <GraduationCap className="h-24 w-24 mb-4" />
                </div>
            </div>
            <div className={cn("transition-all duration-1000 delay-500", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                <h1 className="text-4xl font-bold font-headline">
                    NextGenSDE
                </h1>
            </div>
        </div>
    );
}
