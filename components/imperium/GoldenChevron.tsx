// components/imperium/GoldenChevron.tsx
import React from 'react';
import { motion } from 'framer-motion';

interface GoldenChevronProps {
  direction?: 'up' | 'down' | 'left' | 'right';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
  onClick?: () => void;
}

export function GoldenChevron({
  direction = 'down',
  size = 'md',
  animated = true,
  onClick,
}: GoldenChevronProps) {
  const sizes = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  const rotations = {
    up: 180,
    down: 0,
    left: 90,
    right: -90,
  };

  return (
    <motion.button
      className={`${sizes[size]} text-imperial-gold cursor-pointer transition-opacity hover:opacity-80`}
      onClick={onClick}
      animate={
        animated
          ? {
              y: direction === 'down' ? [0, 8, 0] : direction === 'up' ? [0, -8, 0] : 0,
              x: direction === 'right' ? [0, 8, 0] : direction === 'left' ? [0, -8, 0] : 0,
            }
          : {}
      }
      transition={
        animated
          ? {
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }
          : {}
      }
      style={{
        rotate: rotations[direction],
      }}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
        className="drop-shadow-[0_0_8px_rgba(164,141,96,0.6)]"
      >
        <path d="M6 9l6 6 6-6" />
      </svg>
    </motion.button>
  );
}

// Scroll indicator with chevron
export function ScrollIndicator({ onClick }: { onClick?: () => void }) {
  return (
    <div className="flex flex-col items-center gap-2 ">
      <motion.p
        className="text-xs font-headline text-imperial-gold/60 uppercase tracking-wider"
        animate={{ opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
      >
        Scroll
      </motion.p>
      <GoldenChevron onClick={onClick} animated />
    </div>
  );
}