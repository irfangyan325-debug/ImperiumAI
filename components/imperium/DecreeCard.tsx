// components/imperium/DecreeCard.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { Decree } from '@/types/decree';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { useToast } from '@/components/ui/Toast';
import { useSound } from '@/lib/sound';
import clsx from 'clsx';

interface DecreeCardProps {
  decree: Decree;
  onComplete?: (id: string) => void;
}

export function DecreeCard({ decree, onComplete }: DecreeCardProps) {
  const { updateDecreeStatus, addXP } = useAppStore();
  const { showToast } = useToast();
  const { playDecree } = useSound();

  const handleComplete = () => {
    playDecree();
    updateDecreeStatus(decree.id, 'completed');
    addXP(100);
    showToast('Decree completed! +100 XP', 'decree');
    onComplete?.(decree.id);
  };

  const statusColors = {
    active: 'border-imperial-gold',
    pending: 'border-imperial-gold/50',
    completed: 'border-green-600',
  };

  const statusIcons = {
    active: '⚔️',
    pending: '⏳',
    completed: '✓',
  };

  return (
    <motion.div
      layout
      className={clsx(
        'relative p-5 rounded-lg border-2 bg-imperial-black/80 backdrop-blur-sm',
        statusColors[decree.status]
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95 }}
    >
      {/* Status indicator */}
      <div className="absolute -top-3 -right-3 w-8 h-8 rounded-full bg-imperial-black border-2 border-imperial-gold flex items-center justify-center text-lg">
        {statusIcons[decree.status]}
      </div>

      {/* Header */}
      <div className="space-y-2 mb-4">
        <h4 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
          {decree.title}
        </h4>
        
        {/* Mentor badge */}
        <span className="inline-block px-3 py-1 text-xs font-headline bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-imperial-gold uppercase tracking-wider">
          {decree.mentor}
        </span>
      </div>

      {/* Description */}
      <p className="text-sm font-body text-white/70 leading-relaxed mb-4">
        {decree.description}
      </p>

      {/* Footer */}
      <div className="flex items-center justify-between">
        {/* Due date */}
        <span className="text-xs font-body text-white/50">
          Due: {new Date(decree.dueDate).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
          })}
        </span>

        {/* Action button */}
        {decree.status === 'active' && (
          <Button size="sm" onClick={handleComplete}>
            Complete
          </Button>
        )}
        {decree.status === 'completed' && (
          <span className="text-sm font-headline text-green-600 uppercase tracking-wider">
            Done
          </span>
        )}
      </div>
    </motion.div>
  );
}

// Daily Command variant (featured decree)
export function DailyCommandCard({ decree }: { decree: Decree }) {
  return (
    <motion.div
      className="relative p-6 rounded-lg border-2 border-imperial-gold bg-gradient-to-br from-imperial-red/20 to-imperial-black backdrop-blur-sm shadow-gold-intense overflow-hidden"
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      whileHover={{ scale: 1.02 }}
    >
      {/* Background decoration */}
      <div className="absolute top-0 right-0 text-6xl opacity-10">📜</div>

      {/* Label */}
      <div className="mb-4">
        <span className="text-xs font-headline text-imperial-gold uppercase tracking-[0.2em]">
          Daily Command
        </span>
      </div>

      {/* Content */}
      <h3 className="text-xl font-headline text-imperial-gold mb-3 tracking-wider uppercase">
        {decree.title}
      </h3>
      
      <p className="text-sm font-body text-white/80 leading-relaxed mb-4">
        {decree.description}
      </p>

      {/* Action */}
      <DecreeCard decree={decree} />
    </motion.div>
  );
}