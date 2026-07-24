export const ROUTES = Object.freeze({
  home: '/',
  today: '/today',
  careTeam: '/care-team',
  caregiverDetail: (caregiverId) => `/care-team/${caregiverId}`,
  settings: '/settings',
  notifications: '/settings/notifications',
  emergency: '/emergency',
});

export const ROUTE_SEGMENTS = Object.freeze({
  caregiverId: ':caregiverId',
  notifications: 'notifications',
});
