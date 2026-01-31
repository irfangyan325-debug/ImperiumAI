// app/(main)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { BottomTabs } from '@/components/ui/Tabs';
import { ToastProvider } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { soundManager } from '@/lib/sound';
import { ROUTES } from '@/lib/routes';

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const { hasCompletedOnboarding, soundEnabled } = useAppStore();

  // Redirect to onboarding if not completed
  useEffect(() => {
    if (!hasCompletedOnboarding) {
      router.push(ROUTES.ONBOARDING);
    }
  }, [hasCompletedOnboarding, router]);

  // Initialize sound manager with user preference
  useEffect(() => {
    soundManager.setEnabled(soundEnabled);
  }, [soundEnabled]);

  // Hide bottom tabs on selection hall
  const showBottomTabs = pathname !== ROUTES.SELECTION_HALL;

  return (
    <ToastProvider>
      <div className="relative min-h-screen">
        {/* Main content */}
        <main className={showBottomTabs ? 'pb-20' : ''}>
          {children}
        </main>

        {/* Bottom Navigation Tabs */}
        {showBottomTabs && <BottomTabs />}
      </div>
    </ToastProvider>
  );
}