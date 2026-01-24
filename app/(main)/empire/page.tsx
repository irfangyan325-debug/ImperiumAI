// app/(main)/empire/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { CinematicHeader } from '@/components/imperium/CinematicHeader';
import { MentorCard } from '@/components/imperium/MentorCard';
import { DecreeCard, DailyCommandCard } from '@/components/imperium/DecreeCard';
import { RelicShelf, RelicDetails } from '@/components/imperium/RelicShelf';
import { EnergyBar, XPBar } from '@/components/ui/ProgressBar';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { TabContent } from '@/components/ui/Tabs';
import { useAppStore } from '@/store/useAppStore';
import { MENTORS, SAMPLE_DECREES, RELICS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { fadeIn, slideUp, staggerContainer } from '@/lib/motion';
import { Relic } from '@/types/relic';

export default function EmpirePage() {
  const router = useRouter();
  const { user, energy, selectedMentorId, activeMentorId, setActiveMentor } = useAppStore();
  const [selectedRelic, setSelectedRelic] = useState<Relic | null>(null);

  const selectedMentor = MENTORS.find((m) => m.id === selectedMentorId);
  const activeDecrees = SAMPLE_DECREES.filter((d) => d.status === 'active');
  const dailyCommand = activeDecrees[0];

  useEffect(() => {
    // Scroll to top on mount
    window.scrollTo(0, 0);
  }, []);

  const handleMentorSwitch = (mentorId: string) => {
    setActiveMentor(mentorId);
  };

  const handleRelicClick = (relic: Relic) => {
    if (relic.unlocked) {
      setSelectedRelic(relic);
    }
  };

  return (
    <MarbleBackground variant={selectedMentor?.id as any} withVignette>
      <TabContent>
        <div className="px-6 py-8 space-y-8 safe-area-top">
          
          {/* Hero Section - Profile & Stats */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            {/* Empire Seal */}
            <motion.div
              className="w-24 h-24 mx-auto rounded-full border-4 border-imperial-gold bg-imperial-black/80 flex items-center justify-center shadow-gold-intense"
              whileHover={{ scale: 1.05, rotate: 5 }}
            >
              <span className="text-5xl">🔱</span>
            </motion.div>

            {/* User Info */}
            <div className="space-y-2">
              <h1 className="text-3xl font-headline text-imperial-gold text-glow tracking-wider uppercase">
                {user.name}
              </h1>
              <p className="text-sm font-headline text-white/60 uppercase tracking-wider">
                {selectedMentor?.title || 'Imperator'}
              </p>
            </div>

            {/* Quick Stats */}
            <div className="flex justify-center gap-8">
              <StatBadge icon="🔥" label="Streak" value={`${user.streak} days`} />
              <StatBadge icon="⚡" label="Level" value={user.level.toString()} />
              <StatBadge icon="💎" label="XP" value={user.xp.toString()} />
            </div>

            {/* XP Progress Bar */}
            <div className="max-w-md mx-auto">
              <XPBar xp={user.xp} level={user.level} />
            </div>
          </motion.div>

          <div className="divider-gold" />

          {/* Mentor Switcher Row */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h2 className="text-lg font-headline text-imperial-gold tracking-wider uppercase text-center">
              Active Mentor
            </h2>
            
            <div className="flex justify-center gap-4">
              {MENTORS.map((mentor) => (
                <MentorCard
                  key={mentor.id}
                  mentor={mentor}
                  variant="compact"
                  isActive={activeMentorId === mentor.id}
                  isSelected={selectedMentorId === mentor.id}
                  onClick={() => handleMentorSwitch(mentor.id)}
                />
              ))}
            </div>
          </motion.div>

          <div className="divider-gold" />

          {/* Main Content Cards */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Empire Energy */}
            <motion.div variants={slideUp}>
              <Card variant="bordered">
                <CardHeader>
                  <CardTitle>Empire Energy</CardTitle>
                </CardHeader>
                <CardContent>
                  <EnergyBar energy={energy} />
                  <p className="text-xs font-body text-white/60 mt-3">
                    Your momentum and drive. Complete decrees to maintain high energy.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Daily Command */}
            {dailyCommand && (
              <motion.div variants={slideUp}>
                <DailyCommandCard decree={dailyCommand} />
              </motion.div>
            )}

            {/* Council Status */}
            <motion.div variants={slideUp}>
              <Card hover onClick={() => router.push(ROUTES.COUNCIL)}>
                <div className="flex items-center justify-between">
                  <div className="space-y-2">
                    <CardTitle>Council Awaits</CardTitle>
                    <p className="text-sm font-body text-white/70">
                      Summon all three masters for collective wisdom
                    </p>
                  </div>
                  <div className="text-4xl">🏛️</div>
                </div>
              </Card>
            </motion.div>

            {/* Active Decrees */}
            <motion.div variants={slideUp} className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
                  Active Decrees
                </h3>
                <Button
                  size="sm"
                  variant="ghost"
                  onClick={() => router.push(ROUTES.PATH)}
                >
                  View All
                </Button>
              </div>

              <div className="space-y-4">
                {activeDecrees.slice(0, 2).map((decree) => (
                  <DecreeCard key={decree.id} decree={decree} />
                ))}
              </div>

              {activeDecrees.length === 0 && (
                <Card variant="glass">
                  <CardContent>
                    <p className="text-sm font-body text-white/60 text-center py-4">
                      No active decrees. Visit your mentor for counsel.
                    </p>
                  </CardContent>
                </Card>
              )}
            </motion.div>

            {/* Relics Shelf */}
            <motion.div variants={slideUp}>
              <RelicShelf relics={[...RELICS]} onRelicClick={handleRelicClick} />
            </motion.div>

            {/* Quick Actions */}
            <motion.div variants={slideUp} className="grid grid-cols-2 gap-4 pt-4">
              <Button
                variant="secondary"
                fullWidth
                onClick={() => router.push(ROUTES.COUNSEL)}
              >
                Seek Counsel
              </Button>
              <Button
                variant="secondary"
                fullWidth
                onClick={() => router.push(ROUTES.JOURNAL)}
              >
                Open Journal
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </TabContent>

      {/* Relic Details Modal */}
      <Modal
        isOpen={!!selectedRelic}
        onClose={() => setSelectedRelic(null)}
        title="Relic"
        size="sm"
      >
        {selectedRelic && <RelicDetails relic={selectedRelic} />}
      </Modal>
    </MarbleBackground>
  );
}

// Stat Badge Component
function StatBadge({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: string;
}) {
  return (
    <div className="flex flex-col items-center gap-1">
      <div className="text-2xl">{icon}</div>
      <div className="text-xs font-headline text-white/50 uppercase tracking-wider">
        {label}
      </div>
      <div className="text-lg font-headline text-imperial-gold">
        {value}
      </div>
    </div>
  );
}