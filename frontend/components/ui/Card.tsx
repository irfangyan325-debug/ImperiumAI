// components/ui/Card.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { cardHover } from '@/lib/motion';
import clsx from 'clsx';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  noPadding?: boolean;
  variant?: 'default' | 'bordered' | 'glass';
}

export function Card({
  children,
  className,
  hover = false,
  onClick,
  noPadding = false,
  variant = 'default',
}: CardProps) {
  const baseStyles = clsx(
    'rounded-lg backdrop-blur-sm',
    !noPadding && 'p-6',
    onClick && 'cursor-pointer'
  );

  const variants = {
    default: 'bg-imperial-black/80 border border-imperial-gold/30 shadow-gold',
    bordered: 'bg-imperial-black/90 border-2 border-imperial-gold shadow-gold-intense',
    glass: 'bg-imperial-black/40 border border-imperial-gold/20 backdrop-blur-md',
  };

  const Component = hover ? motion.div : 'div';
  const motionProps = hover
    ? {
        variants: cardHover,
        initial: 'rest',
        whileHover: 'hover',
      }
    : {};

  return (
    <Component
      className={clsx(baseStyles, variants[variant], className)}
      onClick={onClick}
      {...motionProps}
    >
      {children}
    </Component>
  );
}

// Card Header
export function CardHeader({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mb-4', className)}>
      {children}
    </div>
  );
}

// Card Title
export function CardTitle({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h3 className={clsx('text-lg font-headline text-imperial-gold tracking-wider', className)}>
      {children}
    </h3>
  );
}

// Card Content
export function CardContent({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('text-white/80', className)}>
      {children}
    </div>
  );
}

// Card Footer
export function CardFooter({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={clsx('mt-4 pt-4 border-t border-imperial-gold/20', className)}>
      {children}
    </div>
  );
}