// lib/motion.ts
import { Variants } from 'framer-motion';

// Page Transitions
export const pageTransition = {
  initial: { opacity: 0, y: 12 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -12 },
  transition: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1],
  },
};

// Fade In
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: 'easeOut',
    },
  },
};

// Slide Up
export const slideUp: Variants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Scale In
export const scaleIn: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: {
      duration: 0.4,
      ease: 'easeOut',
    },
  },
};

// Stagger Children
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Glow Pulse (for active elements)
export const glowPulse = {
  animate: {
    boxShadow: [
      '0 0 20px rgba(164, 141, 96, 0.3)',
      '0 0 40px rgba(164, 141, 96, 0.6)',
      '0 0 20px rgba(164, 141, 96, 0.3)',
    ],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: 'easeInOut',
    },
  },
};

// Hover Scale (for interactive elements)
export const hoverScale = {
  rest: { scale: 1 },
  hover: {
    scale: 1.02,
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
  tap: {
    scale: 0.98,
  },
};

// Parallax Scroll Effect
export const parallaxScroll = (offset: number = 0.5) => ({
  y: offset,
  transition: {
    type: 'spring',
    stiffness: 100,
    damping: 30,
  },
});

// Modal Backdrop
export const modalBackdrop: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3,
    },
  },
};

// Modal Content
export const modalContent: Variants = {
  hidden: {
    opacity: 0,
    scale: 0.95,
    y: 20,
  },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

// Card Hover Effect
export const cardHover = {
  rest: {
    scale: 1,
    boxShadow: '0 0 20px rgba(164, 141, 96, 0.3)',
  },
  hover: {
    scale: 1.02,
    boxShadow: '0 0 40px rgba(164, 141, 96, 0.6)',
    transition: {
      duration: 0.3,
      ease: 'easeOut',
    },
  },
};

// Mentor Panel Blend Effect
export const mentorPanelVariants: Variants = {
  hidden: { opacity: 0, x: -50 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.2,
      duration: 0.8,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

// Gold Shimmer
export const shimmer = {
  animate: {
    backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
    transition: {
      duration: 3,
      repeat: Infinity,
      ease: 'linear',
    },
  },
};

// Floating Animation (for dust particles)
export const floatingParticle = (delay: number = 0) => ({
  animate: {
    y: [0, -20, 0],
    opacity: [0.3, 0.6, 0.3],
    transition: {
      duration: 6,
      repeat: Infinity,
      ease: 'easeInOut',
      delay,
    },
  },
});

// Decree Completion Effect
export const decreeComplete: Variants = {
  initial: { scale: 1, opacity: 1 },
  complete: {
    scale: [1, 1.05, 0.95, 1],
    opacity: [1, 1, 1, 0],
    transition: {
      duration: 0.8,
      ease: 'easeInOut',
    },
  },
};