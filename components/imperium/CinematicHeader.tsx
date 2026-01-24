// components/imperium/CinematicHeader.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/lib/motion';
import clsx from 'clsx';

interface CinematicHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  icon?: React.ReactNode;
  centered?: boolean;
  withDivider?: boolean;
}

export function CinematicHeader({
  title,
  subtitle,
  description,
  icon,
  centered = false,
  withDivider = true,
}: CinematicHeaderProps) {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className={clsx(
        'space-y-4',
        centered && 'text-center'
      )}
    >
      {/* Icon */}
      {icon && (
        <div className={clsx('text-4xl', centered && 'flex justify-center')}>
          {icon}
        </div>
      )}

      {/* Title */}
      <h1 className="text-3xl md:text-4xl font-headline text-imperial-gold text-glow tracking-[0.15em] uppercase">
        {title}
      </h1>

      {/* Subtitle */}
      {subtitle && (
        <p className="text-lg font-headline text-white/80 tracking-wider uppercase">
          {subtitle}
        </p>
      )}

      {/* Description */}
      {description && (
        <p className="text-base font-body text-white/60 max-w-2xl">
          {description}
        </p>
      )}

      {/* Divider */}
      {withDivider && (
        <div className="pt-4">
          <div className="divider-gold" />
        </div>
      )}
    </motion.div>
  );
}

// Compact version for sub-pages
export function PageHeader({
  title,
  action,
}: {
  title: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-6">
      <h2 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
        {title}
      </h2>
      {action && <div>{action}</div>}
    </div>
  );
}