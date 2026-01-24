// components/imperium/MentorCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '@/lib/motion';
import { useSound } from '@/lib/sound';
import { Mentor } from '@/types/mentor';
import clsx from 'clsx';

interface MentorCardProps {
  mentor: Mentor;
  isActive?: boolean;
  isSelected?: boolean;
  onClick?: () => void;
  variant?: 'compact' | 'full';
}

export function MentorCard({
  mentor,
  isActive = false,
  isSelected = false,
  onClick,
  variant = 'full',
}: MentorCardProps) {
  const { playTap } = useSound();

  const handleClick = () => {
    playTap();
    onClick?.();
  };

  if (variant === 'compact') {
    return (
      <motion.button
        variants={cardHover}
        initial="rest"
        whileHover="hover"
        onClick={handleClick}
        className={clsx(
          'relative flex flex-col items-center gap-2 p-4 rounded-lg border-2 transition-all',
          isActive
            ? 'border-imperial-gold bg-imperial-gold/10 shadow-gold-intense'
            : 'border-imperial-gold/30 bg-imperial-black/50 hover:border-imperial-gold/60'
        )}
      >
        {/* Active pulse indicator */}
        {isActive && (
          <motion.div
            className="absolute -top-1 -right-1 w-3 h-3 bg-imperial-gold rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [1, 0.6, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
            }}
          />
        )}

        {/* Mentor initial or icon */}
        <div
          className="w-12 h-12 rounded-full border-2 border-imperial-gold flex items-center justify-center text-xl font-headline"
          style={{ borderColor: mentor.color }}
        >
          {mentor.name.charAt(0)}
        </div>

        <span className="text-xs font-headline text-imperial-gold uppercase tracking-wider">
          {mentor.name.split(' ')[0]}
        </span>
      </motion.button>
    );
  }

  return (
    <motion.div
      variants={cardHover}
      initial="rest"
      whileHover="hover"
      onClick={handleClick}
      className={clsx(
        'relative cursor-pointer rounded-lg border-2 overflow-hidden backdrop-blur-sm transition-all',
        isSelected
          ? 'border-imperial-gold shadow-gold-intense'
          : 'border-imperial-gold/30 shadow-gold'
      )}
    >
      {/* Background gradient */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background: `linear-gradient(135deg, ${mentor.color} 0%, transparent 100%)`,
        }}
      />

      {/* Content */}
      <div className="relative p-6 space-y-4">
        {/* Header */}
        <div className="space-y-2">
          <h3 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
            {mentor.name}
          </h3>
          <p className="text-sm font-headline text-white/60 tracking-wider uppercase">
            {mentor.title}
          </p>
        </div>

        {/* Divider */}
        <div className="divider-gold" />

        {/* Philosophy */}
        <p className="text-sm font-body text-white/70 leading-relaxed">
          {mentor.philosophy}
        </p>

        {/* Selected indicator */}
        {isSelected && (
          <div className="flex items-center gap-2 text-imperial-gold">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-xs font-headline uppercase tracking-wider">
              Selected
            </span>
          </div>
        )}
      </div>

      {/* Hover glow effect */}
      <motion.div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle at center, ${mentor.color}20 0%, transparent 70%)`,
        }}
        initial={{ opacity: 0 }}
        whileHover={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      />
    </motion.div>
  );
}