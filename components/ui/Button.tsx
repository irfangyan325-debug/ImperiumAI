// components/ui/Button.tsx
import React from 'react';
import { motion } from 'framer-motion';
import { hoverScale } from '@/lib/motion';
import { useSound } from '@/lib/sound';
import clsx from 'clsx';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  fullWidth?: boolean;
  loading?: boolean;
  children: React.ReactNode;
}

export function Button({
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  loading = false,
  disabled,
  children,
  onClick,
  className,
  ...props
}: ButtonProps) {
  const { playTap } = useSound();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!disabled && !loading) {
      playTap();
      onClick?.(e);
    }
  };

  const baseStyles = clsx(
    'font-headline uppercase tracking-[0.1em] rounded-sm',
    'transition-all duration-300',
    'disabled:opacity-50 disabled:cursor-not-allowed',
    'flex items-center justify-center gap-2',
    fullWidth && 'w-full'
  );

  const variants = {
    primary: clsx(
      'bg-imperial-black border-2 border-imperial-gold text-imperial-gold',
      'shadow-gold hover:shadow-gold-intense',
      'disabled:shadow-none'
    ),
    secondary: clsx(
      'bg-imperial-red border-2 border-imperial-gold text-imperial-gold',
      'shadow-gold hover:shadow-gold-intense',
      'disabled:shadow-none'
    ),
    ghost: clsx(
      'bg-transparent border-2 border-imperial-gold/50 text-imperial-gold',
      'hover:border-imperial-gold hover:bg-imperial-gold/10'
    ),
  };

  const sizes = {
    sm: 'px-4 py-2 text-xs',
    md: 'px-6 py-3 text-sm',
    lg: 'px-8 py-4 text-base',
  };

  // Remove event props that conflict with Framer Motion's types
  const {
    onAnimationStart,
    onAnimationEnd,
    onAnimationIteration,
    onDrag,
    onDragStart,
    onDragEnd,
    onDragOver,
    onDragEnter,
    onDragLeave,
    onDrop,
    ...safeProps
  } = props;

  return (
    <motion.button
      variants={hoverScale}
      initial="rest"
      whileHover={!disabled && !loading ? "hover" : "rest"}
      whileTap={!disabled && !loading ? "tap" : "rest"}
      className={clsx(baseStyles, variants[variant], sizes[size], className)}
      onClick={handleClick}
      disabled={disabled || loading}
      {...safeProps}
    >
      {loading ? (
        <>
          <div className="w-4 h-4 border-2 border-imperial-gold border-t-transparent rounded-full animate-spin" />
          <span>Loading...</span>
        </>
      ) : (
        children
      )}
    </motion.button>
  );
}