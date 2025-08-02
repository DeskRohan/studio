
'use client';

import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useEffect, useState } from 'react';

export function SetupAnimation() {
    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    return (
        <div className={cn(
            "flex h-screen w-full flex-col items-center justify-center bg-background text-primary transition-opacity duration-500",
            isMounted ? "opacity-100" : "opacity-0"
        )}>
            <div className={cn("transition-all duration-1000 delay-500", isMounted ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4")}>
                <div className="flex items-center gap-4">
                    <Loader2 className="h-12 w-12 animate-spin" />
                    <h1 className="text-3xl font-bold font-headline">
                        Setting up your account...
                    </h1>
                </div>
            </div>
        </div>
    );
}
