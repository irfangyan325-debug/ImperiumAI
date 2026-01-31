
// app/page.tsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { ROUTES } from '@/lib/routes';

export default function RootPage() {
  const router = useRouter();
  const { user, hasCompletedOnboarding } = useAppStore();

  useEffect(() => {
    // Check if user has a name (logged in)
    if (!user.name || user.name === 'Imperator') {
      // Not logged in or guest, go to login
      router.push(ROUTES.LOGIN);
    } else if (hasCompletedOnboarding) {
      // Logged in and onboarded, go to empire
      router.push(ROUTES.EMPIRE);
    } else {
      // Logged in but not onboarded, go to onboarding
      router.push(ROUTES.ONBOARDING);
    }
  }, [user, hasCompletedOnboarding, router]);

  // Show loading while redirecting
  return (
    <div className="min-h-screen bg-[#1A1916] flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-6xl animate-pulse">🏛️</div>
        <h1 className="text-2xl font-bold text-[#A48D60] tracking-wider uppercase" style={{ fontFamily: 'serif' }}>
          Imperium AI
        </h1>
        <p className="text-sm text-white/60">Loading...</p>
      </div>
    </div>
  );
}