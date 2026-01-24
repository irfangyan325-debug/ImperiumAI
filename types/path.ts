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