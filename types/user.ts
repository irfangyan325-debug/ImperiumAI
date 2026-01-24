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