// app/(main)/journal/[id]/page.tsx
'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { MENTORS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { fadeIn } from '@/lib/motion';

export default function JournalEntryDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { journalEntries, deleteJournalEntry } = useAppStore();
  
  const entryId = params.id as string;
  const entry = journalEntries.find((e) => e.id === entryId);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

  if (!entry) {
    return (
      <MarbleBackground withVignette>
        <div className="min-h-screen flex items-center justify-center px-6">
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
            className="text-center space-y-6"
          >
            <div className="text-6xl">❌</div>
            <h2 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
              Entry Not Found
            </h2>
            <Button onClick={() => router.push(ROUTES.JOURNAL)}>
              Back to Journal
            </Button>
          </motion.div>
        </div>
      </MarbleBackground>
    );
  }

  const mentor = MENTORS.find((m) => m.id === entry.mentor);
  const mentorColor = mentor?.color || '#A48D60';

  const handleDelete = () => {
    deleteJournalEntry(entry.id);
    showToast('Entry deleted', 'success');
    router.push(ROUTES.JOURNAL);
  };

  const handleToggleFavorite = () => {
    // TODO: Implement favorite toggle in store
    showToast(entry.isFavorite ? 'Removed from favorites' : 'Added to favorites', 'info');
  };

  return (
    <MarbleBackground withVignette>
      <div className="min-h-screen safe-area-top safe-area-bottom">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-imperial-gold/30 bg-imperial-black/80 backdrop-blur-sm"
        >
          <button
            onClick={() => router.push(ROUTES.JOURNAL)}
            className="text-imperial-gold hover:text-imperial-gold-light transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <h1 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
            Journal Entry
          </h1>

          <button
            onClick={() => setShowDeleteModal(true)}
            className="text-red-400 hover:text-red-300 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </motion.div>

        {/* Content */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="px-6 py-8 space-y-6 max-w-3xl mx-auto"
        >
          {/* Mentor Badge */}
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-headline"
              style={{ borderColor: mentorColor }}
            >
              {entry.mentor === 'council' ? '🏛️' : mentor?.name.charAt(0)}
            </div>
            <div>
              <p className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
                {entry.mentor === 'council' ? 'Council Debate' : mentor?.name}
              </p>
              <p className="text-xs font-body text-white/50">
                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                  weekday: 'long',
                  month: 'long',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </p>
            </div>
          </div>

          {/* Title */}
          <div
            className="border-l-4 pl-6"
            style={{ borderLeftColor: mentorColor }}
          >
            <h2 className="text-3xl font-headline text-imperial-gold tracking-wider uppercase mb-4">
              {entry.title}
            </h2>
          </div>

          {/* Tags */}
          {entry.tags.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {entry.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-headline bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-imperial-gold uppercase tracking-wider"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="divider-gold" />

          {/* Content */}
          <div className="prose prose-invert max-w-none">
            <div className="text-base font-body text-white/80 leading-relaxed whitespace-pre-wrap">
              {entry.content}
            </div>
          </div>

          <div className="divider-gold" />

          {/* Actions */}
          <div className="flex gap-4">
            <Button
              onClick={handleToggleFavorite}
              variant="ghost"
              fullWidth
            >
              {entry.isFavorite ? '⭐ Unfavorite' : '☆ Favorite'}
            </Button>
            <Button
              onClick={() => navigator.share?.({ title: entry.title, text: entry.content })}
              variant="ghost"
              fullWidth
            >
              Share
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        title="Delete Entry?"
        size="sm"
      >
        <div className="space-y-4">
          <p className="text-sm font-body text-white/70">
            Are you sure you want to delete this journal entry? This action cannot be undone.
          </p>
          
          <ModalFooter>
            <Button
              variant="ghost"
              onClick={() => setShowDeleteModal(false)}
              fullWidth
            >
              Cancel
            </Button>
            <Button
              variant="secondary"
              onClick={handleDelete}
              fullWidth
            >
              Delete
            </Button>
          </ModalFooter>
        </div>
      </Modal>
    </MarbleBackground>
  );
}