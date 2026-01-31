// app/(main)/mentor/[id]/page.tsx
'use client';

import React, { useState, useRef, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { MarbleBackground } from '@/components/imperium/MarbleBackground';
import { Button } from '@/components/ui/Button';
import { Modal, ModalFooter } from '@/components/ui/Modal';
import { useToast } from '@/components/ui/Toast';
import { useAppStore } from '@/store/useAppStore';
import { soundManager } from '@/lib/sound';
import { MENTORS } from '@/lib/constants';
import { ROUTES } from '@/lib/routes';
import { slideUp, fadeIn } from '@/lib/motion';
import clsx from 'clsx';

interface Message {
  id: string;
  type: 'user' | 'mentor';
  content: string;
  principle?: string;
  analysis?: string;
  directive?: string;
  timestamp: Date;
}

export default function MentorChatPage() {
  const params = useParams();
  const router = useRouter();
  const { showToast } = useToast();
  const { addJournalEntry, addDecree, soundEnabled } = useAppStore();
  
  const mentorId = params.id as string;
  const mentor = MENTORS.find((m) => m.id === mentorId);

  const [messages, setMessages] = useState<Message[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [showCompareModal, setShowCompareModal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!mentor) {
      router.push(ROUTES.SELECTION_HALL);
      return;
    }

    // Play mentor ambience
    if (soundEnabled) {
      soundManager.playAmbient(mentorId);
    }

    // Add greeting message
    if (messages.length === 0) {
      setMessages([
        {
          id: '1',
          type: 'mentor',
          content: mentor.greeting,
          principle: 'Power begins with understanding.',
          analysis: 'You have chosen wisely to seek counsel. The path ahead requires both strategy and conviction.',
          directive: 'State your dilemma, and I shall provide guidance.',
          timestamp: new Date(),
        },
      ]);
    }

    return () => {
      soundManager.fadeOutAmbient(500);
    };
  }, [mentor, mentorId, soundEnabled]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    // Simulate mentor response (replace with API call later)
    setTimeout(() => {
      const mentorResponse: Message = {
        id: (Date.now() + 1).toString(),
        type: 'mentor',
        content: `Response to: ${userMessage.content}`,
        principle: getMockPrinciple(mentorId),
        analysis: getMockAnalysis(mentorId, userMessage.content),
        directive: getMockDirective(mentorId),
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, mentorResponse]);
      setIsLoading(false);
    }, 2000);
  };

  const handleSaveToJournal = (message: Message) => {
    if (message.type !== 'mentor') return;

    addJournalEntry({
      id: Date.now().toString(),
      mentor: mentorId,
      title: message.principle || 'Counsel',
      content: `${message.analysis}\n\n${message.directive}`,
      createdAt: new Date().toISOString(),
      tags: [mentorId],
    });

    showToast('Saved to Journal', 'success');
  };

  const handleMarkAsDecree = (message: Message) => {
    if (message.type !== 'mentor' || !message.directive) return;

    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);

    addDecree({
      id: Date.now().toString(),
      title: message.principle || 'New Decree',
      mentor: mentorId,
      description: message.directive,
      status: 'active',
      dueDate: tomorrow.toISOString(),
      createdAt: new Date().toISOString(),
    });

    showToast('Decree created', 'decree');
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  if (!mentor) return null;

  return (
    <MarbleBackground variant={mentorId as any} withVignette>
      <div className="flex flex-col h-screen safe-area-top safe-area-bottom">
        {/* Header */}
        <motion.div
          variants={fadeIn}
          initial="hidden"
          animate="visible"
          className="flex items-center justify-between px-6 py-4 border-b border-imperial-gold/30 bg-imperial-black/80 backdrop-blur-sm"
        >
          <button
            onClick={() => router.push(ROUTES.EMPIRE)}
            className="text-imperial-gold hover:text-imperial-gold-light transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>

          <div className="text-center">
            <h1 className="text-lg font-headline text-imperial-gold tracking-wider uppercase">
              {mentor.name}
            </h1>
            <p className="text-xs font-headline text-white/50 uppercase tracking-wider">
              {mentor.title}
            </p>
          </div>

          <button
            onClick={() => router.push(ROUTES.SETTINGS)}
            className="text-imperial-gold hover:text-imperial-gold-light transition-colors"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
            </svg>
          </button>
        </motion.div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-6 py-6 space-y-6">
          <AnimatePresence>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                variants={slideUp}
                initial="hidden"
                animate="visible"
                exit="hidden"
              >
                {message.type === 'user' ? (
                  <UserMessage message={message} />
                ) : (
                  <MentorMessage
                    message={message}
                    mentor={mentor}
                    onSave={() => handleSaveToJournal(message)}
                    onDecree={() => handleMarkAsDecree(message)}
                    onCompare={() => {
                      setSelectedMessage(message);
                      setShowCompareModal(true);
                    }}
                  />
                )}
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && <LoadingIndicator mentor={mentor} />}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Bar */}
        <div className="px-6 py-4 border-t border-imperial-gold/30 bg-imperial-black/80 backdrop-blur-sm">
          <div className="flex gap-3">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask for counsel..."
              className="flex-1 px-4 py-3 bg-imperial-black border border-imperial-gold/30 rounded-lg text-white placeholder:text-white/40 font-body focus:outline-none focus:border-imperial-gold transition-colors"
            />
            <Button onClick={handleSendMessage} disabled={!inputValue.trim() || isLoading}>
              Send
            </Button>
          </div>
        </div>
      </div>

      {/* Compare Counsel Modal */}
      <Modal
        isOpen={showCompareModal}
        onClose={() => setShowCompareModal(false)}
        title="Compare Counsel"
        size="lg"
      >
        <div className="space-y-4">
          <p className="text-sm font-body text-white/70">
            Here's how other mentors would approach this situation:
          </p>
          {MENTORS.filter((m) => m.id !== mentorId).map((m) => (
            <div key={m.id} className="p-4 rounded-lg border border-imperial-gold/30 bg-imperial-black/50">
              <h3 className="text-sm font-headline text-imperial-gold uppercase tracking-wider mb-2">
                {m.name}
              </h3>
              <p className="text-sm font-body text-white/70">
                {getMockAlternative(m.id)}
              </p>
            </div>
          ))}
        </div>
        <ModalFooter>
          <Button variant="ghost" onClick={() => setShowCompareModal(false)}>
            Close
          </Button>
        </ModalFooter>
      </Modal>
    </MarbleBackground>
  );
}

// User Message Bubble
function UserMessage({ message }: { message: Message }) {
  return (
    <div className="flex justify-end">
      <div className="max-w-[80%] px-4 py-3 bg-imperial-gold/20 border border-imperial-gold/30 rounded-lg">
        <p className="text-sm font-body text-white">{message.content}</p>
        <span className="text-xs font-body text-white/40 mt-1 block">
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>
    </div>
  );
}

// Mentor Message (3-part format)
function MentorMessage({
  message,
  mentor,
  onSave,
  onDecree,
  onCompare,
}: {
  message: Message;
  mentor: typeof MENTORS[number];
  onSave: () => void;
  onDecree: () => void;
  onCompare: () => void;
}) {
  return (
    <div className="flex justify-start">
      <div className="max-w-[85%] space-y-3">
        {/* Mentor avatar */}
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-full border-2 flex items-center justify-center text-sm font-headline"
            style={{ borderColor: mentor.color }}
          >
            {mentor.name.charAt(0)}
          </div>
          <span className="text-xs font-headline text-white/60 uppercase tracking-wider">
            {mentor.name}
          </span>
        </div>

        {/* Message content */}
        <div className="px-4 py-4 bg-imperial-black/80 border border-imperial-gold/30 rounded-lg space-y-4 backdrop-blur-sm">
          {/* Principle */}
          {message.principle && (
            <div>
              <h4 className="text-xs font-headline text-imperial-gold uppercase tracking-wider mb-2">
                Principle
              </h4>
              <p className="text-sm font-body text-white italic">
                "{message.principle}"
              </p>
            </div>
          )}

          {/* Analysis */}
          {message.analysis && (
            <div>
              <h4 className="text-xs font-headline text-imperial-gold uppercase tracking-wider mb-2">
                Analysis
              </h4>
              <p className="text-sm font-body text-white/80 leading-relaxed">
                {message.analysis}
              </p>
            </div>
          )}

          {/* Directive */}
          {message.directive && (
            <div className="pt-3 border-t border-imperial-gold/20">
              <h4 className="text-xs font-headline text-imperial-gold uppercase tracking-wider mb-2">
                Directive
              </h4>
              <p className="text-sm font-body text-white/90 font-medium">
                {message.directive}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
          <button
            onClick={onSave}
            className="text-xs font-headline text-imperial-gold hover:text-imperial-gold-light uppercase tracking-wider transition-colors"
          >
            📖 Save to Journal
          </button>
          <button
            onClick={onDecree}
            className="text-xs font-headline text-imperial-gold hover:text-imperial-gold-light uppercase tracking-wider transition-colors"
          >
            📜 Mark as Decree
          </button>
          <button
            onClick={onCompare}
            className="text-xs font-headline text-imperial-gold hover:text-imperial-gold-light uppercase tracking-wider transition-colors"
          >
            ⚖️ Compare
          </button>
        </div>
      </div>
    </div>
  );
}

// Loading Indicator
function LoadingIndicator({ mentor }: { mentor: typeof MENTORS[number] }) {
  return (
    <div className="flex justify-start">
      <div className="flex items-center gap-3 px-4 py-3 bg-imperial-black/50 border border-imperial-gold/30 rounded-lg">
        <div
          className="w-6 h-6 rounded-full border-2 flex items-center justify-center text-xs font-headline"
          style={{ borderColor: mentor.color }}
        >
          {mentor.name.charAt(0)}
        </div>
        <div className="flex gap-1">
          <motion.div
            className="w-2 h-2 bg-imperial-gold rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-2 h-2 bg-imperial-gold rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-2 h-2 bg-imperial-gold rounded-full"
            animate={{ opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
      </div>
    </div>
  );
}

// Mock response generators (replace with real API)
function getMockPrinciple(mentorId: string): string {
  const principles: Record<string, string> = {
    machiavelli: 'Power is seized, not granted.',
    napoleon: 'Victory belongs to the decisive.',
    aurelius: 'Control yourself, not the world.',
  };
  return principles[mentorId] || 'Wisdom comes through action.';
}

function getMockAnalysis(mentorId: string, userInput: string): string {
  return `Your situation regarding "${userInput.substring(0, 30)}..." requires careful consideration. The path forward demands both strategy and resolve.`;
}

function getMockDirective(mentorId: string): string {
  const directives: Record<string, string> = {
    machiavelli: 'Identify who holds leverage and act accordingly.',
    napoleon: 'Take immediate action. Hesitation is defeat.',
    aurelius: 'Begin with your morning ritual. Discipline precedes all victory.',
  };
  return directives[mentorId] || 'Take the first step today.';
}

function getMockAlternative(mentorId: string): string {
  const alternatives: Record<string, string> = {
    machiavelli: 'I would advise you to assess the power dynamics first before acting.',
    napoleon: 'I would say strike now while momentum is on your side.',
    aurelius: 'I would counsel you to reflect deeply before deciding your path.',
  };
  return alternatives[mentorId] || 'A different perspective on your situation.';
}