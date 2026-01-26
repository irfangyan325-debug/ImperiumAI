// lib/constants.ts
export const MENTORS = [
  {
    id: 'machiavelli',
    name: 'Niccolò Machiavelli',
    title: 'The Master of Manipulation',
    subtitle: 'Prince of Political Strategy',
    philosophy: 'Power realism, political strategy, influence',
    color: '#5A1818',
    greeting: 'Power respects only power. What do you seek?',
     image: '/mentors/machiavelli.png',
  },
  {
    id: 'napoleon',
    name: 'Napoleon Bonaparte',
    title: 'The Master of Conquest',
    subtitle: 'Emperor of Action',
    philosophy: 'Action, conquest, ambition, decisive execution',
    color: '#4A5568',
    greeting: 'Victory favors the bold. What battlefield do you face?',
    image: '/mentors/napoleon.png',
  },
  {
    id: 'aurelius',
    name: 'Marcus Aurelius',
    title: 'The Master of Self-Command',
    subtitle: 'Philosopher Emperor',
    philosophy: 'Stoicism, discipline, internal control, virtue under pressure',
    color: '#A48D60',
    greeting: 'True power lies within. What troubles your mind?',
    image: '/mentors/caesar.png',
  },
] as const;

export const SAMPLE_DECREES = [
  {
    id: '1',
    title: 'Master the Morning Ritual',
    mentor: 'aurelius',
    description: 'Rise at dawn, journal for clarity, train your body.',
    status: 'active',
    dueDate: '2026-01-25',
  },
  {
    id: '2',
    title: 'Identify Your Leverage Points',
    mentor: 'machiavelli',
    description: 'Map the power dynamics in your current situation.',
    status: 'pending',
    dueDate: '2026-01-24',
  },
  {
    id: '3',
    title: 'Take One Bold Action Today',
    mentor: 'napoleon',
    description: 'Do the thing you have been avoiding. Strike now.',
    status: 'completed',
    dueDate: '2026-01-23',
  },
];

export const PATH_NODES = [
  {
    id: 'awakening',
    title: 'THE AWAKENING',
    realm: 'Foundation',
    status: 'completed',
    description: 'You have entered the Imperium.',
    quests: [
      { id: 'q1', title: 'Choose Your First Mentor', completed: true },
      { id: 'q2', title: 'Receive Your First Counsel', completed: true },
    ],
  },
  {
    id: 'discipline',
    title: 'THE DISCIPLINE',
    realm: 'Foundation',
    status: 'active',
    description: 'Build the foundation of self-mastery.',
    quests: [
      { id: 'q3', title: 'Complete 7 Day Streak', completed: false },
      { id: 'q4', title: 'Follow 5 Decrees', completed: false },
    ],
  },
  {
    id: 'influence',
    title: 'THE INFLUENCE',
    realm: 'Ascension',
    status: 'locked',
    description: 'Learn to move others and shape outcomes.',
    quests: [],
  },
  {
    id: 'conquest',
    title: 'THE CONQUEST',
    realm: 'Ascension',
    status: 'locked',
    description: 'Take decisive action in the world.',
    quests: [],
  },
  {
    id: 'empire',
    title: 'THE EMPIRE',
    realm: 'Mastery',
    status: 'locked',
    description: 'Build your domain and legacy.',
    quests: [],
  },
];

export const GOALS = [
  { id: 'power', label: 'Power', icon: '👑' },
  { id: 'discipline', label: 'Discipline', icon: '⚔️' },
  { id: 'wealth', label: 'Wealth', icon: '💰' },
  { id: 'social', label: 'Social Dominance', icon: '🎭' },
  { id: 'calm', label: 'Calm Mind', icon: '🧘' },
] as const;

export const RELICS = [
  { id: 'seal', name: 'Imperial Seal', unlocked: true },
  { id: 'sword', name: 'Sword of Action', unlocked: true },
  { id: 'scroll', name: 'Ancient Scroll', unlocked: false },
  { id: 'crown', name: 'Crown of Mastery', unlocked: false },
] as const;


