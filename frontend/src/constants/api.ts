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
    PARTNER_BY_ID: (id: number) => `/partners/${id}`,
    TRANSLATIONS: (id: number) => `/partners/${id}/translations`,
    TRANSLATION_BY_LANGUAGE: (id: number, language: string) =>
      `/partners/${id}/translations/${language}`,
  },
  PROJECTS: {
    PROJECTS: '/projects',
    PROJECT_BY_ID: (id: number) => `/projects/${id}`,
    TRANSLATIONS: (id: number) => `/projects/${id}/translations`,
    TRANSLATION_BY_LANGUAGE: (id: number, language: string) =>
      `/projects/${id}/translations/${language}`,
  },
} as const
