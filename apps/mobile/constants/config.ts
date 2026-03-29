import Constants from 'expo-constants';
import { Platform } from 'react-native';

const DEFAULT_PROD_API_URL =
  'https://cargoconnect-api-fccka4c4g2afe6dm.francecentral-01.azurewebsites.net/api';
const DEFAULT_PROD_WEB_URL = 'https://cargoconnect-beryl.vercel.app';

type ExpoConstantsLike = {
  expoConfig?: { hostUri?: string };
  expoGoConfig?: { debuggerHost?: string; hostUri?: string };
  manifest?: { debuggerHost?: string; hostUri?: string };
  manifest2?: { extra?: { expoGo?: { debuggerHost?: string } } };
};

function hostFromUri(candidate: string | undefined) {
  if (!candidate) return '';

  const withoutProtocol = candidate.replace(/^https?:\/\//, '');
  const withoutPath = withoutProtocol.split('/')[0] || '';
  const host = withoutPath.split(':')[0] || '';
  return host.trim();
}

function inferApiBaseUrl() {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  if (explicit) return explicit;

  // Use production backend by default outside development.
  if (!__DEV__) return DEFAULT_PROD_API_URL;

  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const protocol = window.location.protocol === 'https:' ? 'https' : 'http';
    const host = window.location.hostname;
    return `${protocol}://${host}:3000/api`;
  }

  const c = Constants as unknown as ExpoConstantsLike;
  const host =
    hostFromUri(c.expoConfig?.hostUri) ||
    hostFromUri(c.expoGoConfig?.debuggerHost) ||
    hostFromUri(c.expoGoConfig?.hostUri) ||
    hostFromUri(c.manifest?.debuggerHost) ||
    hostFromUri(c.manifest?.hostUri) ||
    hostFromUri(c.manifest2?.extra?.expoGo?.debuggerHost);

  if (host) {
    return `http://${host}:3000/api`;
  }

  // Final local fallbacks.
  if (Platform.OS === 'android') return 'http://10.0.2.2:3000/api';
  return 'http://localhost:3000/api';
}

export const CONFIG = {
  API_BASE_URL: inferApiBaseUrl(),
  WEB_BASE_URL: process.env.EXPO_PUBLIC_WEB_URL?.trim() || DEFAULT_PROD_WEB_URL,
};
