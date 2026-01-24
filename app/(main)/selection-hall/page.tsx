// app/(main)/selection-hall/page.tsx
'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { ScrollIndicator } from '@/components/imperium/GoldenChevron';
import { useAppStore } from '@/store/useAppStore';
import { soundManager } from '@/lib/sound';
import { MENTORS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { fadeIn, mentorPanelVariants } from '@/lib/motion';
import { Button } from '@/components/ui/Button';

export default function SelectionHallPage() {
  const router = useRouter();
  const { setSelectedMentor, soundEnabled } = useAppStore();

  useEffect(() => {
    // Play hall ambience when entering
    if (soundEnabled) {
      soundManager.playHallAmbient();
    }

    return () => {
      soundManager.fadeOutAmbient(1000);
    };
  }, [soundEnabled]);

  const handleSelectMentor = (mentorId: string) => {
    setSelectedMentor(mentorId);
    
    // Navigate to Empire (main dashboard)
    router.push(ROUTES.EMPIRE);
  };

  const handleScrollDown = () => {
    window.scrollTo({ top: window.innerHeight, behavior: 'smooth' });
  };

  return (
    <MarbleBackground withVignette withParticles>
      {/* Main Selection View */}
      <div className="relative min-h-screen flex flex-col">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="absolute top-0 left-0 right-0 z-20 pt-12 px-6 text-center safe-area-top"
        >
          <h1 className="text-4xl md:text-5xl font-headline text-imperial-gold text-glow tracking-[0.15em] uppercase">
            Choose Your Mentor
          </h1>
          <p className="mt-4 text-sm font-headline text-white/60 tracking-wider uppercase">
            Three Masters Await Your Command
          </p>
        </motion.div>

        {/* Three Mentor Panels */}
        <div className="flex-1 flex flex-col md:flex-row relative">
          {MENTORS.map((mentor, index) => (
            <MentorPanel
              key={mentor.id}
              mentor={mentor}
              index={index}
              onSelect={handleSelectMentor}
            />
          ))}

          {/* Blend Fade Overlays */}
          <div className="absolute inset-y-0 left-0 w-20 md:w-32 bg-gradient-to-r from-imperial-black/80 to-transparent pointer-events-none z-10" />
          <div className="absolute inset-y-0 right-0 w-20 md:w-32 bg-gradient-to-l from-imperial-black/80 to-transparent pointer-events-none z-10" />
        </div>

        {/* Scroll Indicator at Bottom */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 safe-area-bottom">
          <ScrollIndicator onClick={handleScrollDown} />
        </div>
      </div>

      {/* Additional Info Section (optional scroll down content) */}
      <div className="min-h-screen flex items-center justify-center px-6 py-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="max-w-4xl text-center space-y-8"
        >
          <h2 className="text-3xl font-headline text-imperial-gold tracking-wider uppercase">
            The Path of Power
          </h2>
          
          <div className="divider-gold my-6" />
          
          <p className="text-lg font-body text-white/70 leading-relaxed max-w-2xl mx-auto">
            Each mentor offers a unique perspective on power, strategy, and mastery. 
            Choose wisely, for their counsel will shape your empire.
          </p>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            {MENTORS.map((mentor) => (
              <div
                key={mentor.id}
                className="p-6 rounded-lg border border-imperial-gold/30 bg-imperial-black/50 backdrop-blur-sm"
              >
                <div className="text-4xl mb-3">
                  {mentor.id === 'machiavelli' ? '🔴' : mentor.id === 'napoleon' ? '⚔️' : '🏛️'}
                </div>
                <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase mb-2">
                  {mentor.title}
                </h3>
                <p className="text-sm font-body text-white/60">
                  {mentor.philosophy}
                </p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </MarbleBackground>
  );
}

// Individual Mentor Panel
function MentorPanel({
  mentor,
  index,
  onSelect,
}: {
  mentor: typeof MENTORS[number];
  index: number;
  onSelect: (mentorId: string) => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={mentorPanelVariants}
      initial="hidden"
      animate="visible"
      className="relative flex-1 flex flex-col items-center justify-center px-6 py-20 min-h-screen"
      style={{
        background: `linear-gradient(180deg, ${mentor.color}20 0%, transparent 40%, ${mentor.color}15 100%)`,
      }}
    >
      {/* Top decorative line */}
      <motion.div
        className="absolute top-12 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-imperial-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
      />

      {/* Content Container */}
      <div className="space-y-8 text-center max-w-sm z-10">
        {/* Mentor Portrait Circle */}
        <motion.div
          className="relative mx-auto"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          <div
            className="w-40 h-40 md:w-52 md:h-52 rounded-full border-4 flex items-center justify-center shadow-gold-intense"
            style={{ borderColor: mentor.color }}
          >
            {/* Placeholder - Replace with actual image */}
            <div className="text-7xl md:text-8xl font-headline text-imperial-gold">
              {mentor.name.charAt(0)}
            </div>
          </div>
          
          {/* Glow effect */}
          <motion.div
            className="absolute inset-0 rounded-full pointer-events-none"
            animate={{
              boxShadow: [
                `0 0 30px ${mentor.color}40`,
                `0 0 50px ${mentor.color}60`,
                `0 0 30px ${mentor.color}40`,
              ],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </motion.div>

        {/* Name */}
        <div className="space-y-2">
          <h2 className="text-2xl md:text-3xl font-headline text-imperial-gold text-glow tracking-[0.15em] uppercase">
            {mentor.name}
          </h2>
          <p className="text-xs md:text-sm font-headline text-white/60 tracking-wider uppercase">
            {mentor.subtitle}
          </p>
        </div>

        {/* Title Badge */}
        <div className="py-3">
          <div className="inline-block px-6 py-2 border border-imperial-gold/50 rounded-full backdrop-blur-sm bg-imperial-black/30">
            <p className="text-xs font-headline text-imperial-gold uppercase tracking-[0.2em]">
              {mentor.title}
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <p className="text-sm font-body text-white/70 leading-relaxed px-4">
          {mentor.philosophy}
        </p>

        {/* Consult Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.2 + 0.8 }}
        >
          <Button
            onClick={() => onSelect(mentor.id)}
            fullWidth
            size="lg"
            variant="primary"
          >
            Consult {mentor.name.split(' ')[0]}
          </Button>
        </motion.div>

        {/* Decorative quote (optional) */}
        <motion.p
          className="text-xs font-body text-white/40 italic pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.2 + 1 }}
        >
          "{mentor.greeting}"
        </motion.p>
      </div>

      {/* Bottom decorative line */}
      <motion.div
        className="absolute bottom-12 left-1/2 -translate-x-1/2 w-32 h-0.5 bg-gradient-to-r from-transparent via-imperial-gold to-transparent"
        initial={{ scaleX: 0 }}
        animate={{ scaleX: 1 }}
        transition={{ delay: index * 0.2 + 0.5, duration: 0.8 }}
      />

      {/* Background ambient effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at 50% 50%, ${mentor.color}15 0%, transparent 70%)`,
        }}
        animate={{
          opacity: [0.3, 0.5, 0.3],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />
    </motion.div>
  );
}