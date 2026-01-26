// app/(main)/journal/page.tsx
'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { CinematicHeader } from '@/components/imperium/CinematicHeader';
import { TabContent } from '@/components/ui/Tabs';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useAppStore } from '@/store/useAppStore';
import { MENTORS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { slideUp, fadeIn, staggerContainer } from '@/lib/motion';
import { JournalEntry } from '@/types/journal';
import clsx from 'clsx';

export default function JournalPage() {
  const router = useRouter();
  const { journalEntries } = useAppStore();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<string | 'all'>('all');

  // Filter entries
  const filteredEntries = useMemo(() => {
    let entries = [...journalEntries];

    // Filter by mentor
    if (selectedMentor !== 'all') {
      entries = entries.filter((e) => e.mentor === selectedMentor);
    }

    // Filter by search query
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(query) ||
          e.content.toLowerCase().includes(query) ||
          e.tags.some((tag) => tag.toLowerCase().includes(query))
      );
    }

    // Sort by date (newest first)
    entries.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return entries;
  }, [journalEntries, searchQuery, selectedMentor]);

  const handleEntryClick = (entryId: string) => {
    router.push(`/journal/${entryId}`);
  };

  // Calculate favorites count
  // Note: This now works correctly because we added 'isFavorite' to the type definition
  const favoritesCount = useMemo(() => {
    return journalEntries.filter((e) => e.isFavorite).length;
  }, [journalEntries]);

  return (
    <MarbleBackground withVignette>
      <TabContent>
        <div className="px-6 py-8 space-y-8 safe-area-top">
          
          {/* Header */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <CinematicHeader
              title="Journal"
              subtitle="Your Archive of Wisdom"
              description="Saved counsel, insights, and reflections from your mentors"
              icon={<span className="text-6xl">📖</span>}
              centered
            />
          </motion.div>

          {/* Stats */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-3 gap-4"
          >
            <StatCard
              icon="📝"
              label="Total Entries"
              value={journalEntries.length}
            />
            <StatCard
              icon="💬"
              label="This Week"
              value={getEntriesThisWeek(journalEntries)}
            />
            <StatCard
              icon="⭐"
              label="Favorites"
              value={favoritesCount}
            />
          </motion.div>

          {/* Search & Filter */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search journal..."
                className="w-full px-4 py-3 pl-12 bg-imperial-black border border-imperial-gold/30 rounded-lg text-white placeholder:text-white/40 font-body focus:outline-none focus:border-imperial-gold transition-colors"
              />
              <svg
                className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/40"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </div>

            {/* Mentor filter */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <FilterButton
                label="All"
                active={selectedMentor === 'all'}
                onClick={() => setSelectedMentor('all')}
              />
              {MENTORS.map((mentor) => (
                <FilterButton
                  key={mentor.id}
                  label={mentor.name.split(' ')[0]}
                  active={selectedMentor === mentor.id}
                  onClick={() => setSelectedMentor(mentor.id)}
                />
              ))}
              <FilterButton
                label="Council"
                active={selectedMentor === 'council'}
                onClick={() => setSelectedMentor('council')}
              />
            </div>
          </motion.div>

          {/* Entries List */}
          <motion.div
            variants={staggerContainer}
            initial="hidden"
            animate="visible"
            className="space-y-4"
          >
            {filteredEntries.length > 0 ? (
              filteredEntries.map((entry) => (
                <JournalEntryCard
                  key={entry.id}
                  entry={entry}
                  onClick={() => handleEntryClick(entry.id)}
                />
              ))
            ) : (
              <EmptyState
                searchQuery={searchQuery}
                selectedMentor={selectedMentor}
              />
            )}
          </motion.div>
        </div>
      </TabContent>
    </MarbleBackground>
  );
}

// Stat Card
function StatCard({
  icon,
  label,
  value,
}: {
  icon: string;
  label: string;
  value: number;
}) {
  return (
    <Card variant="glass" className="text-center p-4">
      <div className="text-2xl mb-2">{icon}</div>
      <div className="text-2xl font-headline text-imperial-gold mb-1">
        {value}
      </div>
      <div className="text-xs font-headline text-white/50 uppercase tracking-wider">
        {label}
      </div>
    </Card>
  );
}

// Filter Button
function FilterButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={clsx(
        'px-4 py-2 rounded-full text-xs font-headline uppercase tracking-wider whitespace-nowrap transition-all',
        active
          ? 'bg-imperial-gold text-imperial-black'
          : 'bg-imperial-black/50 border border-imperial-gold/30 text-imperial-gold hover:border-imperial-gold'
      )}
    >
      {label}
    </button>
  );
}

// Journal Entry Card
function JournalEntryCard({
  entry,
  onClick,
}: {
  entry: JournalEntry;
  onClick: () => void;
}) {
  const mentor = MENTORS.find((m) => m.id === entry.mentor);
  const mentorColor = mentor?.color || '#A48D60';

  return (
    <motion.div variants={slideUp}>
      <div
        onClick={onClick}
        className="cursor-pointer border-l-4 rounded-lg border border-imperial-gold/30 bg-imperial-black/80 p-6 hover:border-imperial-gold hover:shadow-gold transition-all"
        style={{ borderLeftColor: mentorColor }}
      >
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-2">
            {/* Title */}
            <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
              {entry.title}
            </h3>

            {/* Metadata */}
            <div className="flex items-center gap-3 text-xs font-body text-white/50">
              <span>
                {mentor?.name || entry.mentor === 'council' ? '🏛️ Council' : 'Unknown'}
              </span>
              <span>•</span>
              <span>
                {new Date(entry.createdAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </span>
            </div>

            {/* Preview */}
            <p className="text-sm font-body text-white/70 line-clamp-2">
              {entry.content.substring(0, 120)}...
            </p>

            {/* Tags */}
            {entry.tags.length > 0 && (
              <div className="flex gap-2 flex-wrap pt-2">
                {entry.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-2 py-1 text-xs font-headline bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-imperial-gold uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

// Empty State
function EmptyState({
  searchQuery,
  selectedMentor,
}: {
  searchQuery: string;
  selectedMentor: string;
}) {
  return (
    <Card variant="glass">
      <CardContent className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        {searchQuery || selectedMentor !== 'all' ? (
          <>
            <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase mb-2">
              No Entries Found
            </h3>
            <p className="text-sm font-body text-white/60">
              Try adjusting your search or filters
            </p>
          </>
        ) : (
          <>
            <h3 className="text-lg font-headline text-imperial-gold tracking-wider uppercase mb-2">
              Your Journal is Empty
            </h3>
            <p className="text-sm font-body text-white/60 mb-6">
              Save counsel from your mentors to build your archive of wisdom
            </p>
            <Button variant="secondary">
              Seek Counsel
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}

// Helper function
function getEntriesThisWeek(entries: JournalEntry[]): number {
  const now = new Date();
  const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  
  return entries.filter((e) => new Date(e.createdAt) >= weekAgo).length;
}