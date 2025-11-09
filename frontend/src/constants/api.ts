export const API_ENDPOINTS = {
  AUTH: {
    SIGNIN: '/auth/signin',
    SIGNUP: '/auth/signup',
    SIGNOUT: '/auth/signout',
    ME: '/auth/me',
    REFRESH_TOKEN: '/auth/refresh-token',
  },
  PARTNERS: {
    PARTNERS: '/partners',
  },
  PROJECTS: {
    PROJECTS: '/projects',
  },
} as const
