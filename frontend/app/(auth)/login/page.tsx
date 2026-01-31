// app/(auth)/login/page.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { ROUTES } from '@/lib/routes';
import { fadeIn, slideUp } from '@/lib/motion';

export default function LoginPage() {
  const router = useRouter();
  const { setUser } = useAppStore();
  const [name, setName] = useState('');

  const handleLogin = () => {
    if (!name.trim()) return;

    // Set user name
    setUser({ name: name.trim() });

    // Redirect to onboarding
    router.push(ROUTES.ONBOARDING);
  };

  const handleGuest = () => {
    // Set default guest name
    setUser({ name: 'Imperator' });
    router.push(ROUTES.ONBOARDING);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && name.trim()) {
      handleLogin();
    }
  };

  return (
    <MarbleBackground withVignette withParticles>
      <div className="min-h-screen flex flex-col items-center justify-center px-6 py-12 safe-area-top safe-area-bottom">
        <div className="w-full max-w-md space-y-12">
          
          {/* Logo & Title */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
              className="text-8xl mb-4"
            >
              🏛️
            </motion.div>
            
            <h1 className="text-4xl md:text-5xl font-headline text-imperial-gold text-glow tracking-[0.15em] uppercase">
              Imperium AI
            </h1>
            
            <p className="text-lg font-headline text-white/60 tracking-wider uppercase">
              Counsel from the Masters
            </p>
            
            <div className="divider-gold my-6" />
            
            <p className="text-sm font-body text-white/50 max-w-md mx-auto leading-relaxed">
              Enter your name to begin your journey of power, strategy, and discipline.
            </p>
          </motion.div>

          {/* Login Form */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="space-y-6"
          >
            {/* Name Input */}
            <div className="space-y-2">
              <label className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
                Your Name
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Enter your name..."
                className="w-full px-4 py-3 bg-imperial-black border-2 border-imperial-gold/30 rounded-lg text-white placeholder:text-white/40 font-body focus:outline-none focus:border-imperial-gold transition-colors"
                autoFocus
              />
            </div>

            {/* Login Button */}
            <Button
              onClick={handleLogin}
              disabled={!name.trim()}
              fullWidth
              size="lg"
            >
              Enter the Imperium
            </Button>

            {/* Divider */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-imperial-gold/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-imperial-black px-2 text-white/40 font-headline tracking-wider">
                  Or
                </span>
              </div>
            </div>

            {/* Guest Button */}
            <Button
              onClick={handleGuest}
              variant="ghost"
              fullWidth
            >
              Continue as Guest
            </Button>
          </motion.div>

          {/* Footer */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center space-y-4"
          >
            <p className="text-xs font-body text-white/30">
              By continuing, you agree to our Terms of Service
            </p>
            <p className="text-xs font-body text-white/40">
              Imperium AI © 2026
            </p>
          </motion.div>
        </div>
      </div>
    </MarbleBackground>
  );
}