// components/ui/ProgressBar.tsx
import React from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';

interface ProgressBarProps {
  value: number; // 0-100
  max?: number;
  label?: string;
  showPercentage?: boolean;
  color?: 'gold' | 'red' | 'green';
  size?: 'sm' | 'md' | 'lg';
  animated?: boolean;
}

export function ProgressBar({
  value,
  max = 100,
  label,
  showPercentage = false,
  color = 'gold',
  size = 'md',
  animated = true,
}: ProgressBarProps) {
  const percentage = Math.min(Math.max((value / max) * 100, 0), 100);

  const colors = {
    gold: 'bg-imperial-gold',
    red: 'bg-imperial-red',
    green: 'bg-green-600',
  };

  const glowColors = {
    gold: 'shadow-gold',
    red: 'shadow-[0_0_20px_rgba(90,24,24,0.5)]',
    green: 'shadow-[0_0_20px_rgba(34,197,94,0.5)]',
  };

  const sizes = {
    sm: 'h-2',
    md: 'h-3',
    lg: 'h-4',
  };

  return (
    <div className="w-full">
      {/* Label and percentage */}
      {(label || showPercentage) && (
        <div className="flex justify-between items-center mb-2">
          {label && (
            <span className="text-sm font-headline text-white/80 uppercase tracking-wider">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm font-body text-imperial-gold">
              {Math.round(percentage)}%
            </span>
          )}
        </div>
      )}

      {/* Progress bar container */}
      <div
        className={clsx(
          'w-full bg-imperial-black/50 border border-imperial-gold/30 rounded-full overflow-hidden',
          sizes[size]
        )}
      >
        {/* Progress fill */}
        <motion.div
          className={clsx(
            'h-full rounded-full',
            colors[color],
            glowColors[color]
          )}
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={
            animated
              ? {
                  duration: 0.8,
                  ease: [0.22, 1, 0.36, 1],
                }
              : { duration: 0 }
          }
        />
      </div>
    </div>
  );
}

// XP Bar with level display
export function XPBar({ xp, level }: { xp: number; level: number }) {
  const xpPerLevel = 1000;
  const currentLevelXP = xp % xpPerLevel;
  const percentage = (currentLevelXP / xpPerLevel) * 100;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <span className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
          Level {level}
        </span>
        <span className="text-xs font-body text-white/60">
          {currentLevelXP} / {xpPerLevel} XP
        </span>
      </div>
      
      <div className="relative h-3 bg-imperial-black/50 border border-imperial-gold/30 rounded-full overflow-hidden">
        <motion.div
          className="absolute inset-y-0 left-0 bg-gradient-to-r from-imperial-gold to-imperial-gold-light shadow-gold-intense"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: 0.8,
            ease: [0.22, 1, 0.36, 1],
          }}
        />
        
        {/* Shimmer effect */}
        <motion.div
          className="absolute inset-y-0 left-0 w-full bg-gradient-to-r from-transparent via-white/20 to-transparent"
          animate={{
            x: ['-100%', '200%'],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'linear',
          }}
        />
      </div>
    </div>
  );
}

// Energy Bar (circular or linear)
export function EnergyBar({ energy }: { energy: number }) {
  const getColor = () => {
    if (energy > 66) return 'gold';
    if (energy > 33) return 'gold';
    return 'red';
  };

  return (
    <ProgressBar
      value={energy}
      max={100}
      label="Empire Energy"
      showPercentage
      color={getColor()}
      size="lg"
      animated
    />
  );
}