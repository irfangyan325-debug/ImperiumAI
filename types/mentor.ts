// types/mentor.ts
export interface Mentor {
  id: 'machiavelli' | 'napoleon' | 'aurelius';
  name: string;
  title: string;
  subtitle: string;
  philosophy: string;
  color: string;
  greeting: string;
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
