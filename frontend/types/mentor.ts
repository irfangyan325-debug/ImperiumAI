
// types/mentor.ts
export interface Mentor {
  id: 'machiavelli' | 'napoleon' | 'aurelius';
  name: string;
  title: string;
  subtitle: string;
  philosophy: string;
  color: string;
  greeting: string;
  image?: string;
}

export interface MentorMessage {
  id: string;
  mentorId: string;
  timestamp: string;
  principle: string;
  analysis: string;
  directive: string;
}

// types/decree.ts
export interface Decree {
  id: string;
  title: string;
  mentor: string;
  description: string;
  status: 'active' | 'completed' | 'pending';
  dueDate: string;
  createdAt: string;
  priority?: 'low' | 'medium' | 'high';
}

// types/user.ts
export interface User {
  id: string;
  name: string;
  level: number;
  xp: number;
  streak: number;
  goal: string;
  joinedDate: string;
}

export interface UserProgress {
  totalDecrees: number;
  completedDecrees: number;
  journalEntries: number;
  councilSessions: number;
  currentRealm: string;
}

// types/journal.ts
export interface JournalEntry {
  id: string;
  mentor: string;
  title: string;
  content: string;
  createdAt: string;
  tags: string[];
  isFavorite?: boolean;
}

// types/path.ts
export interface Quest {
  id: string;
  title: string;
  completed: boolean;
}

export interface PathNode {
  id: string;
  title: string;
  realm: string;
  status: 'locked' | 'active' | 'completed';
  description: string;
  quests: Quest[];
  xpReward?: number;
}

// types/council.ts
export interface CouncilDebate {
  id: string;
  dilemma: string;
  createdAt: string;
  mentorResponses: {
    machiavelli: string;
    napoleon: string;
    aurelius: string;
  };
  verdict: string;
}

// types/relic.ts
export interface Relic {
  id: string;
  name: string;
  description?: string;
  unlocked: boolean;
  unlockedAt?: string;
  category?: 'power' | 'wisdom' | 'conquest' | 'discipline';
}