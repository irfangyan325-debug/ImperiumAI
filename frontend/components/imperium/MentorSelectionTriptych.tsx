// components/imperium/MentorSelectionTriptych.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { mentorPanelVariants } from '@/lib/motion';
import { Mentor } from '@/types/mentor';
import { Button } from '@/components/ui/Button';
import { useSound } from '@/lib/sound';
import clsx from 'clsx';

interface MentorSelectionTriptychProps {
  mentors: Mentor[];
  onSelectMentor: (mentorId: string) => void;
}

export function MentorSelectionTriptych({
  mentors,
  onSelectMentor,
}: MentorSelectionTriptychProps) {
  const { playTap } = useSound();

  const handleSelect = (mentorId: string) => {
    playTap();
    onSelectMentor(mentorId);
  };

  return (
    <div className="relative h-screen w-full overflow-hidden">
      {/* Mentor Panels */}
      <div className="flex h-full">
        {mentors.map((mentor, index) => (
          <MentorPanel
            key={mentor.id}
            mentor={mentor}
            index={index}
            onSelect={handleSelect}
          />
        ))}
      </div>

      {/* Fade edges for blending effect */}
      <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-imperial-black to-transparent pointer-events-none" />
      <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-imperial-black to-transparent pointer-events-none" />
    </div>
  );
}

function MentorPanel({
  mentor,
  index,
  onSelect,
}: {
  mentor: Mentor;
  index: number;
  onSelect: (mentorId: string) => void;
}) {
  return (
    <motion.div
      custom={index}
      variants={mentorPanelVariants}
      initial="hidden"
      animate="visible"
      className="relative flex-1 flex flex-col items-center justify-center px-8"
      style={{
        background: `linear-gradient(180deg, ${mentor.color}15 0%, transparent 50%, ${mentor.color}10 100%)`,
      }}
    >
      {/* Decorative top border */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-imperial-gold to-transparent" />

      {/* Content */}
      <div className="space-y-8 text-center max-w-sm">
        {/* Mentor portrait placeholder (you'll add actual images) */}
        <motion.div
          className="w-48 h-48 mx-auto rounded-full border-4 border-imperial-gold flex items-center justify-center text-8xl shadow-gold"
          whileHover={{ scale: 1.05 }}
          transition={{ type: 'spring', stiffness: 300 }}
        >
          {mentor.name.charAt(0)}
        </motion.div>

        {/* Name */}
        <div className="space-y-2">
          <h2 className="text-3xl font-headline text-imperial-gold text-glow tracking-[0.15em] uppercase">
            {mentor.name}
          </h2>
          <p className="text-sm font-headline text-white/60 tracking-wider uppercase">
            {mentor.subtitle}
          </p>
        </div>

        {/* Title */}
        <div className="py-4">
          <div className="inline-block px-6 py-2 border border-imperial-gold/50 rounded-full">
            <p className="text-xs font-headline text-imperial-gold uppercase tracking-[0.2em]">
              {mentor.title}
            </p>
          </div>
        </div>

        {/* Philosophy */}
        <p className="text-sm font-body text-white/70 leading-relaxed">
          {mentor.philosophy}
        </p>

        {/* Consult button */}
        <Button
          onClick={() => onSelect(mentor.id)}
          fullWidth
          variant="primary"
          size="lg"
        >
          Consult {mentor.name.split(' ')[0]}
        </Button>
      </div>

      {/* Decorative bottom border */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-imperial-gold to-transparent" />
    </motion.div>
  );
}