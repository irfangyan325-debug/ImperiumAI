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
