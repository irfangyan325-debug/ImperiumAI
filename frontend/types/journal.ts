
// types/journal.ts
export interface JournalEntry {
  id: string;
  mentor: string;
  title: string;
  content: string;
  createdAt: string | Date;
  tags: string[];
  isFavorite?: boolean;
}



