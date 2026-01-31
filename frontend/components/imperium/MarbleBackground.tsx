
'use client';

import React from 'react';
import { motion } from 'framer-motion';

interface MarbleBackgroundProps {
  children: React.ReactNode;
  variant?: 'default' | 'machiavelli' | 'napoleon' | 'aurelius';
  withVignette?: boolean;
  withParticles?: boolean;
}

export function MarbleBackground({
  children,
  variant = 'default',
  withVignette = true,
  withParticles = false,
}: MarbleBackgroundProps) {
  const gradients = {
    default: 'from-imperial-black via-imperial-black to-imperial-black',
    machiavelli: 'from-imperial-red/20 via-imperial-black to-imperial-black',
    napoleon: 'from-gray-900/30 via-imperial-black to-imperial-black',
    aurelius: 'from-imperial-gold/10 via-imperial-black to-imperial-black',
  };

  return (
    <div className="relative min-h-screen w-full overflow-hidden">
      {/* Base marble texture */}
      <div className="absolute inset-0 marble-bg" />

      {/* Variant gradient overlay */}
      <div
        className={`absolute inset-0 bg-gradient-to-b ${gradients[variant]}`}
      />

      {/* Vignette effect */}
      {withVignette && (
        <div className="absolute inset-0 vignette" />
      )}

      {/* Floating particles (optional) */}
      {withParticles && <FloatingParticles />}

      {/* Content */}
      <div className="relative z-10">
        {children}
      </div>
    </div>
  );
}

// Floating dust particles
function FloatingParticles() {
  const particles = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    delay: Math.random() * 6,
    duration: 6 + Math.random() * 4,
  }));

  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-1 h-1 bg-imperial-gold/30 rounded-full"
          style={{
            left: particle.left,
            top: '100%',
          }}
          animate={{
            y: [0, -1200],
            opacity: [0, 0.6, 0.6, 0],
          }}
          transition={{
            duration: particle.duration,
            repeat: Infinity,
            delay: particle.delay,
            ease: 'linear',
          }}
        />
      ))}
    </div>
  );
}