// // app/(main)/journal/[id]/page.tsx
// 'use client';

// import React, { useState } from 'react';
// import { useParams, useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import { MarbleBackground } from '@/components/imperium/MarbleBackground';
// import { Button } from '@/components/ui/Button';
// import { Modal, ModalFooter } from '@/components/ui/Modal';
// import { useToast } from '@/components/ui/Toast';
// import { useAppStore } from '@/store/useAppStore';
// import { MENTORS } from '@/lib/constants';
// import { ROUTES } from '@/lib/routes';
// import { fadeIn } from '@/lib/motion';

// export default function JournalEntryDetailPage() {
//   const params = useParams();
//   const router = useRouter();
//   const { showToast } = useToast();
//   const { journalEntries, deleteJournalEntry } = useAppStore();
  
//   const entryId = params.id as string;
//   const entry = journalEntries.find((e) => e.id === entryId);

//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   if (!entry) {
//     return (
//       <MarbleBackground withVignette>
//         <div className="min-h-screen flex items-center justify-center px-6">
//           <motion.div
//             variants={fadeIn}
//             initial="hidden"
//             animate="visible"
//             className="text-center space-y-6"
//           >
//             <div className="text-6xl">❌</div>
//             <h2 className="text-2xl font-headline text-imperial-gold tracking-wider uppercase">
//               Entry Not Found
//             </h2>
//             <Button onClick={() => router.push(ROUTES.JOURNAL)}>
//               Back to Journal
//             </Button>
//           </motion.div>
//         </div>
//       </MarbleBackground>
//     );
//   }

//   const mentor = MENTORS.find((m) => m.id === entry.mentor);
//   const mentorColor = mentor?.color || '#A48D60';

//   const handleDelete = () => {
//     deleteJournalEntry(entry.id);
//     showToast('Entry deleted', 'success');
//     router.push(ROUTES.JOURNAL);
//   };

//   const handleToggleFavorite = () => {
//     // TODO: Implement favorite toggle in store
//     showToast(entry.isFavorite ? 'Removed from favorites' : 'Added to favorites', 'info');
//   };

//   return (
//     <MarbleBackground withVignette>
//       <div className="min-h-screen safe-area-top safe-area-bottom">
//         {/* Header */}
//         <motion.div
//           variants={fadeIn}
//           initial="hidden"
//           animate="visible"
//           className="sticky top-0 z-10 flex items-center justify-between px-6 py-4 border-b border-imperial-gold/30 bg-imperial-black/80 backdrop-blur-sm"
//         >
//           <button
//             onClick={() => router.push(ROUTES.JOURNAL)}
//             className="text-imperial-gold hover:text-imperial-gold-light transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
//             </svg>
//           </button>

//           <h1 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
//             Journal Entry
//           </h1>

//           <button
//             onClick={() => setShowDeleteModal(true)}
//             className="text-red-400 hover:text-red-300 transition-colors"
//           >
//             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
//             </svg>
//           </button>
//         </motion.div>

//         {/* Content */}
//         <motion.div
//           variants={fadeIn}
//           initial="hidden"
//           animate="visible"
//           className="px-6 py-8 space-y-6 max-w-3xl mx-auto"
//         >
//           {/* Mentor Badge */}
//           <div className="flex items-center gap-3">
//             <div
//               className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-xl font-headline"
//               style={{ borderColor: mentorColor }}
//             >
//               {entry.mentor === 'council' ? '🏛️' : mentor?.name.charAt(0)}
//             </div>
//             <div>
//               <p className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
//                 {entry.mentor === 'council' ? 'Council Debate' : mentor?.name}
//               </p>
//               <p className="text-xs font-body text-white/50">
//                 {new Date(entry.createdAt).toLocaleDateString('en-US', {
//                   weekday: 'long',
//                   month: 'long',
//                   day: 'numeric',
//                   year: 'numeric',
//                 })}
//               </p>
//             </div>
//           </div>

//           {/* Title */}
//           <div
//             className="border-l-4 pl-6"
//             style={{ borderLeftColor: mentorColor }}
//           >
//             <h2 className="text-3xl font-headline text-imperial-gold tracking-wider uppercase mb-4">
//               {entry.title}
//             </h2>
//           </div>

//           {/* Tags */}
//           {entry.tags.length > 0 && (
//             <div className="flex gap-2 flex-wrap">
//               {entry.tags.map((tag) => (
//                 <span
//                   key={tag}
//                   className="px-3 py-1 text-xs font-headline bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-imperial-gold uppercase tracking-wider"
//                 >
//                   {tag}
//                 </span>
//               ))}
//             </div>
//           )}

//           <div className="divider-gold" />

//           {/* Content */}
//           <div className="prose prose-invert max-w-none">
//             <div className="text-base font-body text-white/80 leading-relaxed whitespace-pre-wrap">
//               {entry.content}
//             </div>
//           </div>

//           <div className="divider-gold" />

//           {/* Actions */}
//           <div className="flex gap-4">
//             <Button
//               onClick={handleToggleFavorite}
//               variant="ghost"
//               fullWidth
//             >
//               {entry.isFavorite ? '⭐ Unfavorite' : '☆ Favorite'}
//             </Button>
//             <Button
//               onClick={() => navigator.share?.({ title: entry.title, text: entry.content })}
//               variant="ghost"
//               fullWidth
//             >
//               Share
//             </Button>
//           </div>
//         </motion.div>
//       </div>

//       {/* Delete Confirmation Modal */}
//       <Modal
//         isOpen={showDeleteModal}
//         onClose={() => setShowDeleteModal(false)}
//         title="Delete Entry?"
//         size="sm"
//       >
//         <div className="space-y-4">
//           <p className="text-sm font-body text-white/70">
//             Are you sure you want to delete this journal entry? This action cannot be undone.
//           </p>
          
//           <ModalFooter>
//             <Button
//               variant="ghost"
//               onClick={() => setShowDeleteModal(false)}
//               fullWidth
//             >
//               Cancel
//             </Button>
//             <Button
//               variant="secondary"
//               onClick={handleDelete}
//               fullWidth
//             >
//               Delete
//             </Button>
//           </ModalFooter>
//         </div>
//       </Modal>
//     </MarbleBackground>
//   );
// }



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
              value={0}
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

          {/* Favorite indicator - removed for now */}
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