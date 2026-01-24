// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  goal: string;
  joinedDate: string;
}

interface Decree {
  id: string;
  title: string;
  mentor: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  dueDate: string;
  createdAt: string;
}

interface JournalEntry {
  isFavorite: boolean;
  id: string;
  mentor: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
}

interface AppState {
  // User
  user: User;
  
  // Mentors
  selectedMentorId: string | null;
  activeMentorId: string | null;
  
  // Settings
  soundEnabled: boolean;
  notificationsEnabled: boolean;
  hasCompletedOnboarding: boolean;
  
  // Data
  decrees: Decree[];
  journalEntries: JournalEntry[];
  energy: number;
  
  // Actions
  setUser: (user: Partial<User>) => void;
  setSelectedMentor: (mentorId: string) => void;
  setActiveMentor: (mentorId: string) => void;
  toggleSound: () => void;
  toggleNotifications: () => void;
  completeOnboarding: () => void;
  
  // Decrees
  addDecree: (decree: Decree) => void;
  updateDecreeStatus: (id: string, status: Decree['status']) => void;
  deleteDecree: (id: string) => void;
  
  // Journal
  addJournalEntry: (entry: JournalEntry) => void;
  deleteJournalEntry: (id: string) => void;
  
  // Energy
  updateEnergy: (amount: number) => void;
  
  // XP and Level
  addXP: (amount: number) => void;
  incrementStreak: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      // Initial State
      user: {
        id: '1',
        name: 'Imperator',
        level: 1,
        xp: 0,
        streak: 0,
        goal: '',
        joinedDate: new Date().toISOString(),
      },
      
      selectedMentorId: null,
      activeMentorId: null,
      soundEnabled: false,
      notificationsEnabled: false,
      hasCompletedOnboarding: false,
      decrees: [],
      journalEntries: [],
      energy: 100,
      
      // Actions
      setUser: (userData) =>
        set((state) => ({
          user: { ...state.user, ...userData },
        })),
      
      setSelectedMentor: (mentorId) =>
        set({ selectedMentorId: mentorId, activeMentorId: mentorId }),
      
      setActiveMentor: (mentorId) =>
        set({ activeMentorId: mentorId }),
      
      toggleSound: () =>
        set((state) => ({ soundEnabled: !state.soundEnabled })),
      
      toggleNotifications: () =>
        set((state) => ({ notificationsEnabled: !state.notificationsEnabled })),
      
      completeOnboarding: () =>
        set({ hasCompletedOnboarding: true }),
      
      // Decrees
      addDecree: (decree) =>
        set((state) => ({
          decrees: [decree, ...state.decrees],
        })),
      
      updateDecreeStatus: (id, status) =>
        set((state) => ({
          decrees: state.decrees.map((d) =>
            d.id === id ? { ...d, status } : d
          ),
        })),
      
      deleteDecree: (id) =>
        set((state) => ({
          decrees: state.decrees.filter((d) => d.id !== id),
        })),
      
      // Journal
      addJournalEntry: (entry) =>
        set((state) => ({
          journalEntries: [entry, ...state.journalEntries],
        })),
      
      deleteJournalEntry: (id) =>
        set((state) => ({
          journalEntries: state.journalEntries.filter((e) => e.id !== id),
        })),
      
      // Energy
      updateEnergy: (amount) =>
        set((state) => ({
          energy: Math.max(0, Math.min(100, state.energy + amount)),
        })),
      
      // XP and Level
      addXP: (amount) =>
        set((state) => {
          const newXP = state.user.xp + amount;
          const xpPerLevel = 1000;
          const newLevel = Math.floor(newXP / xpPerLevel) + 1;
          
          return {
            user: {
              ...state.user,
              xp: newXP,
              level: newLevel,
            },
          };
        }),
      
      incrementStreak: () =>
        set((state) => ({
          user: {
            ...state.user,
            streak: state.user.streak + 1,
          },
        })),
    }),
    {
      name: 'imperium-storage',
    }
  )
);