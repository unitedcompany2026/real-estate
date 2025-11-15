export const LANGUAGES = ['ka', 'en', 'ru', 'ar', 'he'] as const;
export type Language = (typeof LANGUAGES)[number];
