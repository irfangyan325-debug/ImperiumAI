// types/relic.ts
export interface Relic {
  id: string;
  name: string;
  description?: string;
  unlocked: boolean;
  unlockedAt?: string;
  category?: 'power' | 'wisdom' | 'conquest' | 'discipline';
}