
// app/(main)/path/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { CinematicHeader } from '@/components/imperium/CinematicHeader';
import { TabContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { ProgressBar } from '@/components/ui/ProgressBar';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { PATH_NODES } from '@/lib/constants';
import { slideUp, fadeIn } from '@/lib/motion';
import { PathNode, Quest } from '@/types/path';
import clsx from 'clsx';

export default function PathPage() {
  const { showToast } = useToast();
  const { addXP } = useAppStore();
  const [selectedNode, setSelectedNode] = useState<PathNode | null>(null);
  const [completedQuests, setCompletedQuests] = useState<Set<string>>(new Set());

  const handleNodeClick = (node: PathNode) => {
    if (node.status !== 'locked') {
      setSelectedNode(node);
    }
  };

  const handleCompleteQuest = (questId: string) => {
    setCompletedQuests((prev) => new Set([...prev, questId]));
    addXP(50);
    showToast('Quest completed! +50 XP', 'success');
  };

  const currentRealm = PATH_NODES.find((n) => n.status === 'active')?.realm || 'Foundation';
  const completedCount = PATH_NODES.filter((n) => n.status === 'completed').length;
  const progress = (completedCount / PATH_NODES.length) * 100;

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
              title="The Path"
              subtitle={`Current Realm: ${currentRealm}`}
              description="Your journey to mastery through trials and conquests"
              centered
            />
          </motion.div>

          {/* Overall Progress */}
          <motion.div variants={slideUp} initial="hidden" animate="visible">
            <div className="space-y-2">
              <div className="flex justify-between text-sm font-body">
                <span className="text-white/70">Path Progress</span>
                <span className="text-imperial-gold">{Math.round(progress)}%</span>
              </div>
              <ProgressBar
                value={progress}
                label=""
                showPercentage={false}
                color="gold"
                size="lg"
              />
              <div className="text-xs font-body text-white/50 text-right">
                {completedCount} of {PATH_NODES.length} realms completed
              </div>
            </div>
          </motion.div>

          {/* Path Map */}
          <div className="relative py-8">
            {/* Vertical connecting line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-imperial-gold via-imperial-gold/50 to-imperial-gold/20" />

            {/* Path Nodes */}
            <div className="space-y-12">
              {PATH_NODES.map((node, index) => (
                <PathNodeCard
                  key={node.id}
                  node={node}
                  index={index}
                  onClick={() => handleNodeClick(node)}
                />
              ))}
            </div>
          </div>
        </div>
      </TabContent>

      {/* Quest Detail Modal */}
      <Modal
        isOpen={!!selectedNode}
        onClose={() => setSelectedNode(null)}
        title={selectedNode?.title || ''}
        size="md"
      >
        {selectedNode && (
          <QuestDetails
            node={selectedNode}
            completedQuests={completedQuests}
            onCompleteQuest={handleCompleteQuest}
          />
        )}
      </Modal>
    </MarbleBackground>
  );
}

// Path Node Card
function PathNodeCard({
  node,
  index,
  onClick,
}: {
  node: PathNode;
  index: number;
  onClick: () => void;
}) {
  const statusIcons = {
    completed: '✓',
    active: '⚔️',
    locked: '🔒',
  };

  const statusColors = {
    completed: 'border-green-600 bg-green-900/20',
    active: 'border-imperial-gold bg-imperial-gold/10',
    locked: 'border-imperial-gold/20 bg-imperial-black/30',
  };

  const isClickable = node.status !== 'locked';

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      custom={index}
      className="relative pl-20"
    >
      {/* Node indicator on timeline */}
      <div
        className={clsx(
          'absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-4 flex items-center justify-center text-lg z-10',
          node.status === 'completed'
            ? 'border-green-600 bg-green-900'
            : node.status === 'active'
            ? 'border-imperial-gold bg-imperial-black shadow-gold-intense'
            : 'border-imperial-gold/30 bg-imperial-black/50'
        )}
      >
        {statusIcons[node.status]}
      </div>

      {/* Active pulse effect */}
      {node.status === 'active' && (
        <motion.div
          className="absolute left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full border-2 border-imperial-gold"
          animate={{
            scale: [1, 1.5, 1],
            opacity: [0.5, 0, 0.5],
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      )}

      {/* Card */}
      <motion.button
        onClick={isClickable ? onClick : undefined}
        className={clsx(
          'w-full text-left p-5 rounded-lg border-2 transition-all',
          statusColors[node.status],
          isClickable && 'hover:border-imperial-gold hover:shadow-gold cursor-pointer',
          !isClickable && 'opacity-50 cursor-not-allowed'
        )}
        whileHover={isClickable ? { scale: 1.02 } : {}}
        whileTap={isClickable ? { scale: 0.98 } : {}}
      >
        {/* Realm badge */}
        <span className="inline-block px-3 py-1 mb-3 text-xs font-headline bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-imperial-gold uppercase tracking-wider">
          {node.realm}
        </span>

        {/* Title */}
        <h3 className="text-xl font-headline text-imperial-gold tracking-wider uppercase mb-2">
          {node.title}
        </h3>

        {/* Description */}
        <p className="text-sm font-body text-white/70 mb-4">
          {node.description}
        </p>

        {/* Quest count */}
        {node.quests.length > 0 && (
          <div className="flex items-center gap-2 text-xs font-body text-white/60">
            <span>📋</span>
            <span>
              {node.quests.filter((q) => q.completed).length} / {node.quests.length} Quests
            </span>
          </div>
        )}

        {/* XP reward badge */}
        {node.xpReward && node.status !== 'completed' && (
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-imperial-black/50 border border-imperial-gold/30 rounded-full text-xs font-headline text-imperial-gold">
            <span>💎</span>
            <span>+{node.xpReward} XP</span>
          </div>
        )}

        {/* Completed badge */}
        {node.status === 'completed' && (
          <div className="mt-3 inline-flex items-center gap-1 px-3 py-1 bg-green-900/30 border border-green-600/30 rounded-full text-xs font-headline text-green-400">
            <span>✓</span>
            <span>Completed</span>
          </div>
        )}
      </motion.button>
    </motion.div>
  );
}

// Quest Details Modal Content
function QuestDetails({
  node,
  completedQuests,
  onCompleteQuest,
}: {
  node: PathNode;
  completedQuests: Set<string>;
  onCompleteQuest: (questId: string) => void;
}) {
  const completedQuestCount = node.quests.filter(q => 
    q.completed || completedQuests.has(q.id)
  ).length;
  const totalQuestCount = node.quests.length;

  return (
    <div className="space-y-6">
      {/* Realm & Status */}
      <div className="flex items-center justify-between">
        <span className="px-3 py-1 text-xs font-headline bg-imperial-gold/10 border border-imperial-gold/30 rounded-full text-imperial-gold uppercase tracking-wider">
          {node.realm}
        </span>
        <span
          className={clsx(
            'px-3 py-1 text-xs font-headline rounded-full uppercase tracking-wider',
            node.status === 'completed'
              ? 'bg-green-900/50 border border-green-600 text-green-400'
              : node.status === 'active'
              ? 'bg-imperial-gold/10 border border-imperial-gold text-imperial-gold'
              : 'bg-imperial-black/50 border border-imperial-gold/30 text-white/50'
          )}
        >
          {node.status}
        </span>
      </div>

      {/* Description */}
      <p className="text-base font-body text-white/80 leading-relaxed">
        {node.description}
      </p>

      {/* XP Reward */}
      {node.xpReward && node.status !== 'completed' && (
        <div className="p-4 bg-imperial-gold/5 border border-imperial-gold/30 rounded-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-xl">💎</span>
              <span className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
                Completion Reward
              </span>
            </div>
            <span className="text-lg font-bold text-imperial-gold">
              +{node.xpReward} XP
            </span>
          </div>
        </div>
      )}

      {node.quests.length > 0 && (
        <>
          <div className="divider-gold" />

          {/* Quests Progress */}
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-headline text-imperial-gold uppercase tracking-wider">
              Quests
            </h4>
            <span className="text-xs font-body text-white/60">
              {completedQuestCount} / {totalQuestCount}
            </span>
          </div>
          
          {/* Quests List */}
          <div className="space-y-3">
            {node.quests.map((quest) => {
              const isCompleted = quest.completed || completedQuests.has(quest.id);
              
              return (
                <div
                  key={quest.id}
                  className={clsx(
                    'flex items-center justify-between p-4 rounded-lg border transition-all',
                    isCompleted
                      ? 'border-green-600/30 bg-green-900/10'
                      : 'border-imperial-gold/30 bg-imperial-black/30'
                  )}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={clsx(
                        'w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs',
                        isCompleted
                          ? 'border-green-600 bg-green-900 text-green-400'
                          : 'border-imperial-gold/50 bg-imperial-black'
                      )}
                    >
                      {isCompleted ? '✓' : ''}
                    </div>
                    <span
                      className={clsx(
                        'text-sm font-body',
                        isCompleted ? 'text-white/50 line-through' : 'text-white/80'
                      )}
                    >
                      {quest.title}
                    </span>
                  </div>

                  {!isCompleted && node.status === 'active' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => onCompleteQuest(quest.id)}
                    >
                      Complete
                    </Button>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* Locked message */}
      {node.status === 'locked' && (
        <div className="text-center p-4 bg-imperial-black/50 border border-imperial-gold/20 rounded-lg">
          <div className="text-2xl mb-2">🔒</div>
          <p className="text-sm font-body text-white/60 mb-2">
            Complete previous realms to unlock this path
          </p>
          <p className="text-xs font-body text-white/40">
            Focus on your current challenges first
          </p>
        </div>
      )}

      <ModalFooter>
        <Button variant="ghost" onClick={() => {}}>
          Close
        </Button>
      </ModalFooter>
    </div>
  );
}