// app/(auth)/onboarding/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { soundManager } from '@/lib/sound';
import { ROUTES } from '@/lib/routes';
import { GOALS } from '@/lib/constants';
import { fadeIn, slideUp } from '@/lib/motion';
import clsx from 'clsx';

export default function OnboardingPage() {
  const router = useRouter();
  const { setUser, toggleSound, toggleNotifications, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(1);
  const [selectedGoal, setSelectedGoal] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(false);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const handleSoundToggle = () => {
    const newValue = !soundEnabled;
    setSoundEnabled(newValue);
    soundManager.setEnabled(newValue);
    toggleSound();
  };

  const handleNotificationsToggle = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toggleNotifications();
  };

  const handleGoalSelect = (goalId: string) => {
    setSelectedGoal(goalId);
  };

  const handleComplete = () => {
    // Save user preferences
    setUser({ goal: selectedGoal });
    completeOnboarding();
    
    // Navigate to Selection Hall
    router.push(ROUTES.SELECTION_HALL);
  };

  const canProceed = step === 1 || (step === 2 && selectedGoal);

  return (
    <MarbleBackground withVignette withParticles>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 safe-area-top safe-area-bottom">
        <div className="w-full max-w-lg space-y-12">
          
          <AnimatePresence mode="wait">
            {/* Step 1: Welcome & Settings */}
            {step === 1 && (
              <motion.div
                key="step1"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {/* Logo/Title */}
                <div className="text-center space-y-4">
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.2, duration: 0.6 }}
                    className="text-8xl mb-4"
                  >
                    🏛️
                  </motion.div>
                  
                  <h1 className="text-4xl md:text-5xl font-headline text-imperial-gold text-glow tracking-[0.15em] uppercase">
                    Imperium AI
                  </h1>
                  
                  <p className="text-lg font-headline text-white/60 tracking-wider uppercase">
                    Enter the Imperium
                  </p>
                  
                  <div className="divider-gold my-6" />
                  
                  <p className="text-sm font-body text-white/50 max-w-md mx-auto leading-relaxed">
                    Receive counsel from history's greatest masters of power, strategy, and discipline.
                  </p>
                </div>

                {/* Settings */}
                <div className="space-y-6">
                  {/* Sound Toggle */}
                  <ToggleCard
                    icon="🔊"
                    title="Enable Sound"
                    description="Immersive audio and mentor ambience"
                    checked={soundEnabled}
                    onChange={handleSoundToggle}
                  />

                  {/* Notifications Toggle */}
                  <ToggleCard
                    icon="🔔"
                    title="Daily Notifications"
                    description="Reminders for decrees and counsel"
                    checked={notificationsEnabled}
                    onChange={handleNotificationsToggle}
                  />
                </div>

                {/* Continue Button */}
                <Button
                  onClick={() => setStep(2)}
                  fullWidth
                  size="lg"
                >
                  Continue
                </Button>
              </motion.div>
            )}

            {/* Step 2: Goal Selection */}
            {step === 2 && (
              <motion.div
                key="step2"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                exit="hidden"
                className="space-y-8"
              >
                {/* Header */}
                <div className="text-center space-y-4">
                  <h2 className="text-3xl font-headline text-imperial-gold tracking-[0.15em] uppercase">
                    Choose Your Path
                  </h2>
                  
                  <p className="text-sm font-body text-white/60 leading-relaxed">
                    What is your primary pursuit? This will shape your journey.
                  </p>
                </div>

                {/* Goal Grid */}
                <div className="grid grid-cols-2 gap-4">
                  {GOALS.map((goal) => (
                    <GoalCard
                      key={goal.id}
                      goal={goal}
                      selected={selectedGoal === goal.id}
                      onClick={() => handleGoalSelect(goal.id)}
                    />
                  ))}
                </div>

                {/* Navigation Buttons */}
                <div className="flex gap-4">
                  <Button
                    onClick={() => setStep(1)}
                    variant="ghost"
                    fullWidth
                  >
                    Back
                  </Button>
                  
                  <Button
                    onClick={handleComplete}
                    disabled={!selectedGoal}
                    fullWidth
                    size="lg"
                  >
                    Enter the Hall
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Step Indicator */}
          <div className="flex justify-center gap-2">
            {[1, 2].map((i) => (
              <div
                key={i}
                className={clsx(
                  'h-1.5 rounded-full transition-all',
                  i === step
                    ? 'w-8 bg-imperial-gold'
                    : 'w-1.5 bg-imperial-gold/30'
                )}
              />
            ))}
          </div>
        </div>
      </div>
    </MarbleBackground>
  );
}

// Toggle Card Component
function ToggleCard({
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
    <motion.button
      variants={slideUp}
      onClick={onChange}
      className={clsx(
        'w-full p-5 rounded-lg border-2 transition-all text-left',
        'flex items-center gap-4',
        checked
          ? 'border-imperial-gold bg-imperial-gold/10 shadow-gold'
          : 'border-imperial-gold/30 bg-imperial-black/50 hover:border-imperial-gold/60'
      )}
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      {/* Icon */}
      <div className="text-3xl">{icon}</div>

      {/* Content */}
      <div className="flex-1">
        <h3 className="text-base font-headline text-imperial-gold tracking-wider uppercase mb-1">
          {title}
        </h3>
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
    </motion.button>
  );
}

// Goal Card Component
function GoalCard({
  goal,
  selected,
  onClick,
}: {
  goal: { id: string; label: string; icon: string };
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      variants={slideUp}
      onClick={onClick}
      className={clsx(
        'relative p-6 rounded-lg border-2 transition-all',
        'flex flex-col items-center gap-3 text-center',
        selected
          ? 'border-imperial-gold bg-imperial-gold/10 shadow-gold-intense'
          : 'border-imperial-gold/30 bg-imperial-black/50 hover:border-imperial-gold/60'
      )}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {/* Selected indicator */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute -top-2 -right-2 w-6 h-6 bg-imperial-gold rounded-full flex items-center justify-center text-xs"
        >
          ✓
        </motion.div>
      )}

      {/* Icon */}
      <div className="text-4xl">{goal.icon}</div>

      {/* Label */}
      <span className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
        {goal.label}
      </span>
    </motion.button>
  );
}