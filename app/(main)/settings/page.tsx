// app/(main)/settings/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { CinematicHeader } from '@/components/imperium/CinematicHeader';
import { TabContent } from '@/components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { soundManager } from '@/lib/sound';
import { ROUTES } from '@/lib/routes';
import { fadeIn, slideUp, staggerContainer } from '@/lib/motion';
import clsx from 'clsx';

export default function SettingsPage() {
  const router = useRouter();
  const { showToast } = useToast();
  const {
    user,
    soundEnabled,
    notificationsEnabled,
    toggleSound,
    toggleNotifications,
    energy,
    decrees,
    journalEntries,
  } = useAppStore();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    toggleSound();
    soundManager.setEnabled(newValue);
    showToast(newValue ? 'Sound enabled' : 'Sound disabled', 'info');
  };

  const handleNotificationsToggle = () => {
    toggleNotifications();
    showToast(
      !notificationsEnabled ? 'Notifications enabled' : 'Notifications disabled',
      'info'
    );
  };

  const handleLogout = () => {
    // Clear state and redirect to onboarding
    localStorage.removeItem('imperium-storage');
    router.push(ROUTES.ONBOARDING);
    showToast('Logged out successfully', 'success');
  };

  const handleResetProgress = () => {
    // Reset user progress (keep this careful - you might want partial reset)
    localStorage.removeItem('imperium-storage');
    router.push(ROUTES.ONBOARDING);
    showToast('Progress reset', 'info');
  };

  const stats = {
    totalDecrees: decrees.length,
    completedDecrees: decrees.filter((d) => d.status === 'completed').length,
    journalEntries: journalEntries.length,
    daysActive: Math.floor(
      (Date.now() - new Date(user.joinedDate).getTime()) / (1000 * 60 * 60 * 24)
    ),
  };

  return (
    <MarbleBackground withVignette>
      <TabContent>
        <div className="px-6 py-8 space-y-8 safe-area-top">
          
          {/* Header */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <CinematicHeader
              title="Profile & Settings"
              centered
            />
          </motion.div>

          {/* Profile Section */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="bordered">
              <div className="text-center space-y-6">
                {/* Profile Seal */}
                <motion.div
                  className="w-24 h-24 mx-auto rounded-full border-4 border-imperial-gold bg-imperial-black/80 flex items-center justify-center shadow-gold-intense"
                  whileHover={{ scale: 1.05, rotate: 5 }}
                >
                  <span className="text-5xl">🔱</span>
                </motion.div>

                {/* User Info */}
                <div className="space-y-2">
                  <h2 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
                    {user.name}
                  </h2>
                  <div className="flex items-center justify-center gap-2 text-sm font-headline text-white/60 uppercase tracking-wider">
                    <span>Level {user.level}</span>
                    <span>•</span>
                    <span>{user.streak} Day Streak</span>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-4 pt-4">
                  <div className="space-y-1">
                    <div className="text-2xl font-headline text-imperial-gold">
                      {stats.totalDecrees}
                    </div>
                    <div className="text-xs font-headline text-white/50 uppercase tracking-wider">
                      Total Decrees
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-headline text-imperial-gold">
                      {stats.completedDecrees}
                    </div>
                    <div className="text-xs font-headline text-white/50 uppercase tracking-wider">
                      Completed
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-headline text-imperial-gold">
                      {stats.journalEntries}
                    </div>
                    <div className="text-xs font-headline text-white/50 uppercase tracking-wider">
                      Journal Entries
                    </div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-2xl font-headline text-imperial-gold">
                      {stats.daysActive}
                    </div>
                    <div className="text-xs font-headline text-white/50 uppercase tracking-wider">
                      Days Active
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Settings Section */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
              Preferences
            </h3>

            {/* Sound Toggle */}
            <motion.div variants={slideUp}>
              <SettingToggle
                icon="🔊"
                title="Sound Effects"
                description="UI sounds and mentor ambience"
                checked={soundEnabled}
                onChange={handleSoundToggle}
              />
            </motion.div>

            {/* Notifications Toggle */}
            <motion.div variants={slideUp}>
              <SettingToggle
                icon="🔔"
                title="Daily Notifications"
                description="Reminders for decrees and counsel"
                checked={notificationsEnabled}
                onChange={handleNotificationsToggle}
              />
            </motion.div>
          </motion.div>

          {/* App Info Section */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            <Card variant="glass">
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm font-body">
                  <span className="text-white/60">App Version</span>
                  <span className="text-white/80">1.0.0</span>
                </div>
                <div className="divider-gold" />
                <div className="flex items-center justify-between text-sm font-body">
                  <span className="text-white/60">Member Since</span>
                  <span className="text-white/80">
                    {new Date(user.joinedDate).toLocaleDateString('en-US', {
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Action Buttons */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            <Button
              onClick={() => router.push(ROUTES.SELECTION_HALL)}
              variant="secondary"
              fullWidth
            >
              Change Mentor
            </Button>

            <Button
              onClick={() => setShowResetModal(true)}
              variant="ghost"
              fullWidth
            >
              Reset Progress
            </Button>

            <Button
              onClick={() => setShowLogoutModal(true)}
              variant="ghost"
              fullWidth
            >
              Log Out
            </Button>
          </motion.div>

          {/* Footer */}
          <div className="text-center pt-8">
            <p className="text-xs font-body text-white/40">
              Imperium AI © 2026
            </p>
          </div>
        </div>
      </TabContent>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        title="Log Out?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm font-body text-white/70">
            Are you sure you want to log out? Your progress is saved locally.
          </p>
          
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setShowLogoutModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleLogout}
              fullWidth
            >
              Log Out
            </Button>
          </ModalFooter>
        </div>
      </Modal>

      {/* Reset Progress Modal */}
      <Modal
        isOpen={showResetModal}
        onClose={() => setShowResetModal(false)}
        title="Reset Progress?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm font-body text-white/70">
            This will delete all your progress, decrees, and journal entries. This action cannot be undone.
          </p>
          
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setShowResetModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleResetProgress}
              fullWidth
            >
              Reset
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </MarbleBackground>
  );
}

// Setting Toggle Component
function SettingToggle({
  icon,
  title,
  description,
  checked,
  onChange,
}: {
  icon: string;
  title: string;
  description: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <Card hover onClick={onChange}>
      <div className="flex items-center gap-4">
        {/* Icon */}
        <div className="text-3xl">{icon}</div>

        {/* Content */}
        <div className="flex-1">
          <h4 className="text-base font-headline text-imperial-gold tracking-wider uppercase mb-1">
            {title}
          </h4>
          <p className="text-xs font-body text-white/60">
            {description}
          </p>
        </div>

        {/* Toggle Switch */}
        <div
          className={clsx(
            'relative w-12 h-6 rounded-full transition-colors',
            checked ? 'bg-imperial-gold' : 'bg-white/20'
          )}
        >
          <motion.div
            className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md"
            animate={{ x: checked ? 24 : 0 }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          />
        </div>
      </div>
    </Card>
  );
}