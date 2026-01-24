// lib/theme.ts
export const colors = {
  black: '#1A1916',
  red: '#5A1818',
  gold: '#A48D60',
  goldLight: '#C4A670',
  goldDark: '#8A7350',
  redLight: '#7A2828',
  redDark: '#3A0808',
} as const;

export const mentorThemes = {
  machiavelli: {
    name: 'Niccolo Machiavelli',
    title: 'The Master of Manipulation',
    primary: colors.red,
    secondary: colors.goldDark,
    ambience: 'fireplace',
    description: 'Power realism, political strategy, influence',
  },
  napoleon: {
    name: 'Napoleon Bonaparte',
    title: 'The Master of Conquest',
    primary: '#4A5568',
    secondary: '#B8860B',
    ambience: 'storm',
    description: 'Action, conquest, ambition, decisive execution',
  },
  aurelius: {
    name: 'Marcus Aurelius',
    title: 'The Master of Self-Command',
    primary: '#F7FAFC',
    secondary: colors.gold,
    ambience: 'temple',
    description: 'Stoicism, discipline, internal control, virtue under pressure',
  },
} as const;

export const spacing = {
  unit: 8,
  pagePadding: 20,
  safeArea: {
    top: 44,
    bottom: 34,
  },
} as const;

export const typography = {
  headline: {
    fontFamily: '"Cinzel", serif',
    letterSpacing: '0.15em',
    textTransform: 'uppercase' as const,
  },
  body: {
    fontFamily: '"Inter", sans-serif',
    letterSpacing: '0.01em',
  },
} as const;

export const motion = {
  pageTransition: {
    duration: 0.5,
    ease: [0.22, 1, 0.36, 1],
  },
  microAnimation: {
    duration: 0.3,
    ease: 'easeOut',
  },
} as const;