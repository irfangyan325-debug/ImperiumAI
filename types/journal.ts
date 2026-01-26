
// // types/journal.ts
// export interface JournalEntry {
//   id: string;
//   mentor: string;
//   title: string;
//   content: string;
//   createdAt: string;
//   tags: string[];
//   isFavorite?: boolean;
// }



// types/journal.ts
export interface JournalEntry {
  id: string;
  mentor: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date | string;
  isFavorite: boolean; // <--- ADD THIS LINE
}