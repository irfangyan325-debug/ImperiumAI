// components/imperium/RelicShelf.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { staggerContainer, slideUp } from '@/lib/motion';
import { Relic } from '@/types/relic';
import clsx from 'clsx';

interface RelicShelfProps {
  relics: Relic[];
  onRelicClick?: (relic: Relic) => void;
}

export function RelicShelf({ relics, onRelicClick }: RelicShelfProps) {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
          Relics & Achievements
        </h3>
        <span className="text-sm font-body text-white/50">
          {relics.filter((r) => r.unlocked).length} / {relics.length}
        </span>
      </div>

      {/* Shelf */}
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="visible"
        className="flex gap-4 overflow-x-auto no-scrollbar pb-4"
      >
        {relics.map((relic) => (
          <RelicItem
            key={relic.id}
            relic={relic}
            onClick={() => onRelicClick?.(relic)}
          />
        ))}
      </motion.div>
    </div>
  );
}

function RelicItem({
  relic,
  onClick,
}: {
  relic: Relic;
  onClick?: () => void;
}) {
  const relicIcons: Record<string, string> = {
    seal: '🔱',
    sword: '⚔️',
    scroll: '📜',
    crown: '👑',
  };

  return (
    <motion.button
      variants={slideUp}
      onClick={onClick}
      className={clsx(
        'relative flex-shrink-0 w-24 h-28 rounded-lg border-2 transition-all',
        'flex flex-col items-center justify-center gap-2',
        relic.unlocked
          ? 'border-imperial-gold bg-imperial-gold/10 shadow-gold hover:shadow-gold-intense'
          : 'border-imperial-gold/20 bg-imperial-black/50 opacity-40'
      )}
      whileHover={relic.unlocked ? { scale: 1.05 } : {}}
      whileTap={relic.unlocked ? { scale: 0.95 } : {}}
    >
      {/* Lock indicator for locked relics */}
      {!relic.unlocked && (
        <div className="absolute inset-0 flex items-center justify-center bg-imperial-black/60 rounded-lg">
          <span className="text-2xl">🔒</span>
        </div>
      )}

      {/* Icon */}
      <span className="text-3xl">{relicIcons[relic.id] || '💎'}</span>

      {/* Name */}
      <span className="text-xs font-headline text-imperial-gold text-center uppercase tracking-wider px-2">
        {relic.name}
      </span>

      {/* Glow effect for unlocked relics */}
      {relic.unlocked && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            boxShadow: [
              '0 0 10px rgba(164, 141, 96, 0.3)',
              '0 0 20px rgba(164, 141, 96, 0.5)',
              '0 0 10px rgba(164, 141, 96, 0.3)',
            ],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}
    </motion.button>
  );
}

// Full Relic Display Modal Content
export function RelicDetails({ relic }: { relic: Relic }) {
  const relicIcons: Record<string, string> = {
    seal: '🔱',
    sword: '⚔️',
    scroll: '📜',
    crown: '👑',
  };

  return (
    <div className="space-y-6 text-center">
      {/* Icon */}
      <div className="text-8xl">{relicIcons[relic.id] || '💎'}</div>

      {/* Name */}
      <h2 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
        {relic.name}
      </h2>

      {/* Description */}
      {relic.description && (
        <p className="text-base font-body text-white/70 leading-relaxed max-w-md mx-auto">
          {relic.description}
        </p>
      )}

      {/* Unlock date */}
      {relic.unlocked && relic.unlockedAt && (
        <div className="pt-4 border-t border-imperial-gold/30">
          <p className="text-sm font-body text-white/50">
            Unlocked on {new Date(relic.unlockedAt).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Locked state */}
      {!relic.unlocked && (
        <div className="pt-4">
          <span className="inline-block px-4 py-2 bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-sm font-headline text-imperial-gold uppercase tracking-wider">
            🔒 Locked
          </span>
        </div>
      )}
    </div>
  );
}