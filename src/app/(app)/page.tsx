// src/app/(app)/page.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const router = useRouter();
  useEffect(() => {
    router.replace('/study-plan');
  }, [router]);
  return null;
}
