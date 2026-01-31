// 'use client';

// import React, { useState, useMemo } from 'react';
// import { useRouter } from 'next/navigation';
// import { motion } from 'framer-motion';
// import clsx from 'clsx';

// import { MarbleBackground } from '@/components/imperium/MarbleBackground';
// import { CinematicHeader } from '@/components/imperium/CinematicHeader';
// import { TabContent } from '@/components/ui/Tabs';
// import { Card, CardContent } from '@/components/ui/Card';
// import { Button } from '@/components/ui/Button';

// import { useAppStore } from '@/store/useAppStore';
// import { MENTORS } from '@/lib/constants';
// import { slideUp, fadeIn, staggerContainer } from '@/lib/motion';
// import { JournalEntry } from '@/types/journal';

// export default function JournalPage() {
//   const router = useRouter();
//   const { journalEntries } = useAppStore();

//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedMentor, setSelectedMentor] = useState<string | 'all'>('all');

//   // ✅ Favorites count (SAFE)
//   const favoritesCount = useMemo(() => {
//     return journalEntries.filter(e => e.isFavorite === true).length;
//   }, [journalEntries]);

//   // Filter entries
//   const filteredEntries = useMemo(() => {
//     let entries = [...journalEntries];

//     if (selectedMentor !== 'all') {
//       entries = entries.filter(e => e.mentor === selectedMentor);
//     }

//     if (searchQuery.trim()) {
//       const query = searchQuery.toLowerCase();
//       entries = entries.filter(
//         e =>
//           e.title.toLowerCase().includes(query) ||
//           e.content.toLowerCase().includes(query) ||
//           e.tags.some(tag => tag.toLowerCase().includes(query))
//       );
//     }

//     entries.sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() -
//         new Date(a.createdAt).getTime()
//     );

//     return entries;
//   }, [journalEntries, searchQuery, selectedMentor]);

//   return (
//     <MarbleBackground withVignette>
//       <TabContent>
//         <div className="px-6 py-8 space-y-8 safe-area-top">

//           {/* Header */}
//           <motion.div variants={fadeIn} initial="hidden" animate="visible">
//             <CinematicHeader
//               title="Journal"
//               subtitle="Your Archive of Wisdom"
//               description="Saved counsel, insights, and reflections"
//               icon={<span className="text-6xl">📖</span>}
//               centered
//             />
//           </motion.div>

//           {/* Stats */}
//           <motion.div
//             variants={slideUp}
//             initial="hidden"
//             animate="visible"
//             className="grid grid-cols-3 gap-4"
//           >
//             <StatCard icon="📝" label="Total" value={journalEntries.length} />
//             <StatCard
//               icon="💬"
//               label="This Week"
//               value={getEntriesThisWeek(journalEntries)}
//             />
//             <StatCard icon="⭐" label="Favorites" value={favoritesCount} />
//           </motion.div>

//           {/* Search */}
//           <input
//             value={searchQuery}
//             onChange={e => setSearchQuery(e.target.value)}
//             placeholder="Search journal..."
//             className="w-full px-4 py-3 bg-imperial-black border border-imperial-gold/30 rounded-lg text-white"
//           />

//           {/* Entries */}
//           <motion.div
//             variants={staggerContainer}
//             initial="hidden"
//             animate="visible"
//             className="space-y-4"
//           >
//             {filteredEntries.length ? (
//               filteredEntries.map(entry => (
//                 <JournalEntryCard
//                   key={entry.id}
//                   entry={entry}
//                   onClick={() => router.push(`/journal/${entry.id}`)}
//                 />
//               ))
//             ) : (
//               <EmptyState />
//             )}
//           </motion.div>
//         </div>
//       </TabContent>
//     </MarbleBackground>
//   );
// }

// /* ---------------- Components ---------------- */

// function StatCard({ icon, label, value }: any) {
//   return (
//     <Card variant="glass" className="text-center p-4">
//       <div className="text-2xl">{icon}</div>
//       <div className="text-xl text-imperial-gold">{value}</div>
//       <div className="text-xs text-white/50">{label}</div>
//     </Card>
//   );
// }

// function JournalEntryCard({
//   entry,
//   onClick,
// }: {
//   entry: JournalEntry;
//   onClick: () => void;
// }) {
//   const mentor = MENTORS.find(m => m.id === entry.mentor);
//   const mentorColor = mentor?.color || '#A48D60';

//   return (
//     <motion.div variants={slideUp}>
//       <div
//         onClick={onClick}
//         style={{ borderLeftColor: mentorColor }}
//         className="border-l-4 cursor-pointer rounded-lg p-6 bg-imperial-black/80 border border-imperial-gold/30"
//       >
//         <h3 className="text-imperial-gold font-headline">
//           {entry.title}
//         </h3>

//         <p className="text-sm text-white/60 mt-2 line-clamp-2">
//           {entry.content}
//         </p>
//       </div>
//     </motion.div>
//   );
// }

// function EmptyState() {
//   return (
//     <Card variant="glass">
//       <CardContent className="text-center py-12">
//         <div className="text-6xl mb-4">📖</div>
//         <p className="text-white/60">Your journal is empty</p>
//         <Button variant="secondary" className="mt-4">
//           Seek Counsel
//         </Button>
//       </CardContent>
//     </Card>
//   );
// }

// /* ---------------- Helpers ---------------- */

// function getEntriesThisWeek(entries: JournalEntry[]) {
//   const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
//   return entries.filter(e => new Date(e.createdAt) >= weekAgo).length;
// }



'use client';

import React, { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import clsx from 'clsx';

import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { CinematicHeader } from '@/components/imperium/CinematicHeader';
import { TabContent } from '@/components/ui/Tabs';
import { Card, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

import { useAppStore } from '@/store/useAppStore';
import type { JournalEntry } from '@/types/journal';

import { MENTORS } from '@/lib/constants';
import { slideUp, fadeIn, staggerContainer } from '@/lib/motion';

export default function JournalPage() {
  const router = useRouter();
  const { journalEntries } = useAppStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMentor, setSelectedMentor] = useState<string | 'all'>('all');

  /* =========================
     Stats
  ========================= */

  const favoritesCount = useMemo(() => {
    return journalEntries.filter(
      (e) => e.isFavorite === true
    ).length;
  }, [journalEntries]);

  /* =========================
     Filtering
  ========================= */

  const filteredEntries = useMemo(() => {
    let entries = [...journalEntries];

    if (selectedMentor !== 'all') {
      entries = entries.filter(
        (e) => e.mentor === selectedMentor
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      entries = entries.filter(
        (e) =>
          e.title.toLowerCase().includes(q) ||
          e.content.toLowerCase().includes(q) ||
          e.tags.some((tag) =>
            tag.toLowerCase().includes(q)
          )
      );
    }

    entries.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );

    return entries;
  }, [journalEntries, searchQuery, selectedMentor]);

  const handleEntryClick = (id: string) => {
    router.push(`/journal/${id}`);
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
              description="Saved counsel, insights, and reflections"
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
              label="Total"
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

          {/* Search */}
          <motion.div
            variants={slideUp}
            initial="hidden"
            animate="visible"
          >
            <input
              value={searchQuery}
              onChange={(e) =>
                setSearchQuery(e.target.value)
              }
              placeholder="Search journal..."
              className="w-full px-4 py-3 bg-imperial-black border border-imperial-gold/30 rounded-lg text-white"
            />
          </motion.div>

          {/* Mentor Filter */}
          <div className="flex gap-2 overflow-x-auto no-scrollbar">
            <FilterButton
              label="All"
              active={selectedMentor === 'all'}
              onClick={() =>
                setSelectedMentor('all')
              }
            />
            {MENTORS.map((mentor) => (
              <FilterButton
                key={mentor.id}
                label={mentor.name.split(' ')[0]}
                active={
                  selectedMentor === mentor.id
                }
                onClick={() =>
                  setSelectedMentor(mentor.id)
                }
              />
            ))}
          </div>

          {/* Entries */}
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
                  onClick={() =>
                    handleEntryClick(entry.id)
                  }
                />
              ))
            ) : (
              <EmptyState />
            )}
          </motion.div>
        </div>
      </TabContent>
    </MarbleBackground>
  );
}

/* =========================
   Components
========================= */

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
    <Card variant="glass" className="p-4 text-center">
      <div className="text-2xl">{icon}</div>
      <div className="text-xl text-imperial-gold">
        {value}
      </div>
      <div className="text-xs text-white/50">
        {label}
      </div>
    </Card>
  );
}

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
        'px-4 py-2 rounded-full text-xs uppercase transition-all',
        active
          ? 'bg-imperial-gold text-imperial-black'
          : 'border border-imperial-gold/30 text-imperial-gold'
      )}
    >
      {label}
    </button>
  );
}

function JournalEntryCard({
  entry,
  onClick,
}: {
  entry: JournalEntry;
  onClick: () => void;
}) {
  const mentor = MENTORS.find(
    (m) => m.id === entry.mentor
  );
  const mentorColor =
    mentor?.color || '#A48D60';

  return (
    <motion.div variants={slideUp}>
      <div
        onClick={onClick}
        style={{ borderLeftColor: mentorColor }}
        className="cursor-pointer border-l-4 rounded-lg border border-imperial-gold/30 bg-imperial-black/80 p-6"
      >
        <h3 className="text-lg font-headline text-imperial-gold">
          {entry.title}
        </h3>

        <p className="text-sm text-white/70 mt-2 line-clamp-2">
          {entry.content}
        </p>
      </div>
    </motion.div>
  );
}

function EmptyState() {
  return (
    <Card variant="glass">
      <CardContent className="text-center py-12">
        <div className="text-6xl mb-4">📖</div>
        <p className="text-white/60 mb-4">
          No journal entries found
        </p>
        <Button variant="secondary">
          Seek Counsel
        </Button>
      </CardContent>
    </Card>
  );
}

/* =========================
   Helpers
========================= */

function getEntriesThisWeek(
  entries: JournalEntry[]
): number {
  const now = new Date();
  const weekAgo = new Date(
    now.getTime() -
      7 * 24 * 60 * 60 * 1000
  );

  return entries.filter(
    (e) => new Date(e.createdAt) >= weekAgo
  ).length;
}
