// app/(main)/council/page.tsx
'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { CinematicHeader } from '@/components/imperium/CinematicHeader';
import { TabContent } from '@/components/ui/Tabs';
import { Button } from '@/components/ui/Button';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { MENTORS } from '@/lib/constants';
import { slideUp, fadeIn, staggerContainer } from '@/lib/motion';
import clsx from 'clsx';

interface DebateResponse {
  mentorId: string;
  response: string;
}

type CouncilStep = 'input' | 'debating' | 'verdict';

export default function CouncilPage() {
  const { showToast } = useToast();
  const { addJournalEntry } = useAppStore();
  
  const [step, setStep] = useState<CouncilStep>('input');
  const [dilemma, setDilemma] = useState('');
  const [responses, setResponses] = useState<DebateResponse[]>([]);
  const [currentMentorIndex, setCurrentMentorIndex] = useState(0);
  const [verdict, setVerdict] = useState('');

  const handleSummonCouncil = () => {
    if (!dilemma.trim()) return;

    setStep('debating');
    setResponses([]);
    setCurrentMentorIndex(0);

    // Simulate mentor responses one by one
    simulateMentorResponses();
  };

  const simulateMentorResponses = () => {
    let index = 0;

    const addResponse = () => {
      if (index >= MENTORS.length) {
        // All mentors have responded, generate verdict
        setTimeout(() => {
          setVerdict(generateVerdict());
          setStep('verdict');
        }, 1500);
        return;
      }

      const mentor = MENTORS[index];
      const response = getMockMentorResponse(mentor.id, dilemma);

      setTimeout(() => {
        setResponses((prev) => [...prev, { mentorId: mentor.id, response }]);
        setCurrentMentorIndex(index + 1);
        index++;
        addResponse();
      }, 2000);
    };

    addResponse();
  };

  const handleSaveToJournal = () => {
    const content = responses
      .map((r) => {
        const mentor = MENTORS.find((m) => m.id === r.mentorId);
        return `**${mentor?.name}:**\n${r.response}`;
      })
      .join('\n\n');

    const fullContent = `**Your Dilemma:**\n${dilemma}\n\n${content}\n\n**Council Verdict:**\n${verdict}`;

    addJournalEntry({
      id: Date.now().toString(),
      mentor: 'council',
      title: 'Council Debate',
      content: fullContent,
      createdAt: new Date().toISOString(),
      tags: ['council', ...MENTORS.map((m) => m.id)],
    });

    showToast('Council saved to Journal', 'success');
  };

  const handleReset = () => {
    setStep('input');
    setDilemma('');
    setResponses([]);
    setCurrentMentorIndex(0);
    setVerdict('');
  };

  return (
    <MarbleBackground withVignette>
      <TabContent>
        <div className="px-6 py-8 space-y-8 safe-area-top min-h-screen">
          
          {/* Header */}
          <motion.div
            variants={fadeIn}
            initial="hidden"
            animate="visible"
          >
            <CinematicHeader
              title="The Council"
              subtitle="Summon All Three Masters"
              description="Present your dilemma and receive counsel from Machiavelli, Napoleon, and Aurelius"
              icon={<span className="text-6xl">🏛️</span>}
              centered
            />
          </motion.div>

          {/* Council Chamber Scene */}
          <CouncilChamber />

          <AnimatePresence mode="wait">
            {/* Step 1: Input Dilemma */}
            {step === 'input' && (
              <motion.div
                key="input"
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit={{ opacity: 0, y: -20 }}
                className="space-y-6"
              >
                <Card variant="bordered">
                  <CardHeader>
                    <CardTitle>State Your Dilemma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <textarea
                      value={dilemma}
                      onChange={(e) => setDilemma(e.target.value)}
                      placeholder="Describe the situation you face. Be specific about the challenge, the stakes, and what guidance you seek..."
                      className="w-full h-40 px-4 py-3 bg-imperial-black border border-imperial-gold/30 rounded-lg text-white placeholder:text-white/40 font-body focus:outline-none focus:border-imperial-gold transition-colors resize-none"
                    />
                  </CardContent>
                </Card>

                <Button
                  onClick={handleSummonCouncil}
                  disabled={!dilemma.trim()}
                  fullWidth
                  size="lg"
                >
                  Summon the Council
                </Button>
              </motion.div>
            )}

            {/* Step 2: Debating */}
            {step === 'debating' && (
              <motion.div
                key="debating"
                variants={staggerContainer}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* Your Dilemma */}
                <Card variant="glass">
                  <CardHeader>
                    <CardTitle>Your Dilemma</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm font-body text-white/80 leading-relaxed">
                      {dilemma}
                    </p>
                  </CardContent>
                </Card>

                {/* Mentor Responses */}
                <div className="space-y-4">
                  {responses.map((response, index) => (
                    <MentorDebateCard
                      key={response.mentorId}
                      mentorId={response.mentorId}
                      response={response.response}
                      index={index}
                    />
                  ))}

                  {/* Loading next mentor */}
                  {currentMentorIndex < MENTORS.length && (
                    <LoadingMentorCard mentor={MENTORS[currentMentorIndex]} />
                  )}
                </div>
              </motion.div>
            )}

            {/* Step 3: Verdict */}
            {step === 'verdict' && (
              <motion.div
                key="verdict"
                variants={fadeIn}
                initial="hidden"
                animate="visible"
                className="space-y-6"
              >
                {/* All Responses */}
                <div className="space-y-4">
                  {responses.map((response, index) => (
                    <MentorDebateCard
                      key={response.mentorId}
                      mentorId={response.mentorId}
                      response={response.response}
                      index={index}
                    />
                  ))}
                </div>

                {/* Council Verdict */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                >
                  <Card variant="bordered" className="border-imperial-gold shadow-gold-intense">
                    <CardHeader>
                      <div className="text-center space-y-2">
                        <div className="text-4xl">⚖️</div>
                        <CardTitle>Council Verdict</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-base font-body text-white/90 leading-relaxed text-center">
                        {verdict}
                      </p>
                    </CardContent>
                  </Card>
                </motion.div>

                {/* Actions */}
                <div className="flex gap-4">
                  <Button
                    onClick={handleSaveToJournal}
                    fullWidth
                    variant="primary"
                  >
                    📖 Save to Journal
                  </Button>
                  <Button
                    onClick={handleReset}
                    fullWidth
                    variant="secondary"
                  >
                    New Council
                  </Button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </TabContent>
    </MarbleBackground>
  );
}

// Council Chamber Visual
function CouncilChamber() {
  return (
    <motion.div
      variants={fadeIn}
      initial="hidden"
      animate="visible"
      className="relative h-40 rounded-lg overflow-hidden border border-imperial-gold/30"
    >
      {/* Round table background */}
      <div className="absolute inset-0 bg-gradient-to-b from-imperial-black via-imperial-red/10 to-imperial-black" />
      
      {/* Mentor portraits */}
      <div className="relative h-full flex items-center justify-center gap-8">
        {MENTORS.map((mentor, index) => (
          <motion.div
            key={mentor.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.2 }}
            className="flex flex-col items-center gap-2"
          >
            <div
              className="w-16 h-16 rounded-full border-2 flex items-center justify-center text-2xl shadow-gold"
              style={{ borderColor: mentor.color }}
            >
              {mentor.name.charAt(0)}
            </div>
            <span className="text-xs font-headline text-imperial-gold uppercase tracking-wider">
              {mentor.name.split(' ')[0]}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}

// Mentor Debate Card
function MentorDebateCard({
  mentorId,
  response,
  index,
}: {
  mentorId: string;
  response: string;
  index: number;
}) {
  const mentor = MENTORS.find((m) => m.id === mentorId);
  if (!mentor) return null;

  return (
    <motion.div
      variants={slideUp}
      initial="hidden"
      animate="visible"
      custom={index}
    >
      <div style={{ borderLeft: `4px solid ${mentor.color}` }}>
        <Card variant="default" className="relative overflow-hidden">
          <CardHeader>
            <div className="flex items-center gap-3">
              <div
                className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-headline"
                style={{ borderColor: mentor.color }}
              >
                {mentor.name.charAt(0)}
              </div>
              <div>
                <CardTitle>{mentor.name}</CardTitle>
                <p className="text-xs font-headline text-white/50 uppercase tracking-wider">
                  {mentor.title}
                </p>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm font-body text-white/80 leading-relaxed">
              {response}
            </p>
          </CardContent>
        </Card>
      </div>
    </motion.div>
  );
}

// Loading Mentor Card
function LoadingMentorCard({ mentor }: { mentor: typeof MENTORS[number] }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-6 rounded-lg border-2 border-imperial-gold/30 bg-imperial-black/50 backdrop-blur-sm"
    >
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-full border-2 flex items-center justify-center text-lg font-headline"
          style={{ borderColor: mentor.color }}
        >
          {mentor.name.charAt(0)}
        </div>
        <div className="flex-1">
          <p className="text-sm font-headline text-white/60 uppercase tracking-wider">
            {mentor.name} is considering...
          </p>
        </div>
        <div className="flex gap-1">
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="w-2 h-2 bg-imperial-gold rounded-full"
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1,
                repeat: Infinity,
                delay: i * 0.2,
              }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// Mock response generator
function getMockMentorResponse(mentorId: string, dilemma: string): string {
  const responses: Record<string, string> = {
    machiavelli: `In matters of power, one must consider not what is ideal, but what is possible. Your situation demands ruthless pragmatism. Assess who holds leverage, identify their vulnerabilities, and act with calculated precision. Remember: it is better to be feared than loved when both cannot be reconciled.`,
    
    napoleon: `Hesitation is the enemy of victory. While others deliberate, you must act. Seize the initiative, commit fully to your chosen course, and execute with overwhelming force. Fortune favors the audacious. The world belongs to those who dare to take it.`,
    
    aurelius: `Look within before looking without. Your challenge reveals an opportunity to strengthen your character. Accept what you cannot control, master what you can—your thoughts, your reactions, your discipline. The obstacle is the way. Begin with small, consistent actions rooted in virtue.`,
  };

  return responses[mentorId] || 'Consider your options carefully and choose the path of wisdom.';
}

// Generate final verdict
function generateVerdict(): string {
  return `The council has spoken. Each master offers a facet of truth: Machiavelli reminds you of reality's harsh demands, Napoleon calls for decisive action, and Aurelius anchors you in inner strength. Your path forward must balance pragmatism with courage, and both with discipline. Act with clarity, move with conviction, and remain grounded in principle.`;
}