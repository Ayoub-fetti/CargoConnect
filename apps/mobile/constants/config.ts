import Constants from 'expo-constants';

const fromExtra =
  (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl;

/**
 * Backend API origin. Prefer `.env` → `EXPO_PUBLIC_API_URL`.
 * Fallback: `app.json` → `expo.extra.apiUrl`. Restart Metro after changing `.env` (`npx expo start -c`).
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ??
  fromExtra ??
  'http://localhost:3000';
