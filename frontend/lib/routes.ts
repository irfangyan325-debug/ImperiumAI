// lib/routes.ts

export const ROUTES = {
  // Auth
  ONBOARDING: '/onboarding',
  LOGIN: '/login',
  
  // Main App
  SELECTION_HALL: '/selection-hall',
  EMPIRE: '/empire',
  COUNSEL: '/counsel',
  PATH: '/path',
  
  // Mentor Chambers
  MENTOR: (id: string) => `/mentor/${id}`,
  MACHIAVELLI: '/mentor/machiavelli',
  NAPOLEON: '/mentor/napoleon',
  AURELIUS: '/mentor/aurelius',
  
  // Features
  COUNCIL: '/council',
  JOURNAL: '/journal',
  JOURNAL_ENTRY: (id: string) => `/journal/${id}`,
  
  // Settings
  SETTINGS: '/settings',
  PROFILE: '/profile',
} as const;

// Navigation Items for Bottom Tabs
export const MAIN_TABS = [
  {
    id: 'empire',
    label: 'Empire',
    icon: '🏛️',
    route: ROUTES.EMPIRE,
  },
  {
    id: 'counsel',
    label: 'Counsel',
    icon: '💬',
    route: ROUTES.COUNSEL,
  },
  {
    id: 'path',
    label: 'Path',
    icon: '🗺️',
    route: ROUTES.PATH,
  },
] as const;

// Helper function to check if route is active
export function isActiveRoute(currentPath: string, route: string): boolean {
  if (route === ROUTES.EMPIRE) {
    return currentPath === route;
  }
  return currentPath.startsWith(route);
}