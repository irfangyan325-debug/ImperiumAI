// components/ui/Tabs.tsx
'use client';

import React from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MAIN_TABS, isActiveRoute } from '@/lib/routes';
import { useSound } from '@/lib/sound';
import clsx from 'clsx';

export function BottomTabs() {
  const pathname = usePathname();
  const router = useRouter();
  const { playTap } = useSound();

  const handleTabClick = (route: string) => {
    playTap();
    router.push(route);
  };

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 safe-area-bottom">
      {/* Backdrop with gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-imperial-black via-imperial-black to-transparent" />
      
      {/* Tab container */}
      <div className="relative flex items-center justify-around px-4 py-2 border-t border-imperial-gold/30">
        {MAIN_TABS.map((tab) => {
          const isActive = isActiveRoute(pathname, tab.route);
          
          return (
            <button
              key={tab.id}
              onClick={() => handleTabClick(tab.route)}
              className={clsx(
                'flex flex-col items-center gap-1 px-6 py-3 rounded-lg transition-all duration-300 relative',
                isActive
                  ? 'text-imperial-gold'
                  : 'text-white/60 hover:text-white/80'
              )}
            >
              {/* Active indicator glow */}
              {isActive && (
                <motion.div
                  layoutId="activeTab"
                  className="absolute inset-0 bg-imperial-gold/10 border border-imperial-gold/30 rounded-lg"
                  transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
              )}
              
              {/* Icon */}
              <span className="text-2xl relative z-10">{tab.icon}</span>
              
              {/* Label */}
              <span className="text-xs font-headline uppercase tracking-wider relative z-10">
                {tab.label}
              </span>
              
              {/* Active dot */}
              {isActive && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-1 w-1.5 h-1.5 bg-imperial-gold rounded-full"
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

// Tab Content Wrapper (for page content with bottom padding)
export function TabContent({ children }: { children: React.ReactNode }) {
  return (
    <div className="pb-24 min-h-screen">
      {children}
    </div>
  );
}