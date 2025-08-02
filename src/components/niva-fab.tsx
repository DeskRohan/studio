
'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { BrainCircuit } from 'lucide-react';

export function NivaFab() {
  return (
    <Link href="/ai-tutor" passHref>
      <Button
        className="fixed bottom-20 right-4 h-16 w-16 rounded-full shadow-lg z-40 flex items-center justify-center flex-col gap-1 md:h-auto md:w-auto md:py-2 md:px-4 md:bottom-6 md:right-6 md:rounded-full"
      >
        <BrainCircuit className="h-6 w-6 md:mr-2" />
        <span className="hidden md:block font-semibold">Ask Niva</span>
        <span className="block text-[10px] leading-none md:hidden">Niva</span>
      </Button>
    </Link>
  );
}
