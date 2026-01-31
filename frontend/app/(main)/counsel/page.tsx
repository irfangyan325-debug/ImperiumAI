// app/(main)/counsel/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { TabContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { MENTORS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { fadeIn } from '@/lib/motion';

export default function CounselPage() {
  const router = useRouter();
  const { activeMentorId, selectedMentorId } = useAppStore();
  
  const mentorId = activeMentorId || selectedMentorId;

  useEffect(() => {
    // If no mentor selected, redirect to selection
    if (!mentorId) {
      router.push(ROUTES.SELECTION_HALL);
    }
  }, [mentorId, router]);

  // Redirect to specific mentor chat room
  useEffect(() => {
    if (mentorId) {
      router.push(ROUTES.MENTOR(mentorId));
    }
  }, [mentorId, router]);

  return (
    <MarbleBackground withVignette>
      <TabContent>
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            <div className="text-6xl">💬</div>
            <h2 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
              Redirecting to Counsel...
            </h2>
          </motion.div>
        </div>
      </TabContent>
    </MarbleBackground>
  );
}