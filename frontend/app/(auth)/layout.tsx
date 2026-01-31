// app/(auth)/layout.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAppStore } from '@/store/useAppStore';
import { ROUTES } from '@/lib/routes';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const hasCompletedOnboarding = useAppStore(
    (state) => state.hasCompletedOnboarding
  );

  // Redirect to Selection Hall if already onboarded
  useEffect(() => {
    if (hasCompletedOnboarding) {
      router.push(ROUTES.SELECTION_HALL);
    }
  }, [hasCompletedOnboarding, router]);

  return <>{children}</>;
}