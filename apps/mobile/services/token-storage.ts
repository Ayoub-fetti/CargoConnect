import * as SecureStore from 'expo-secure-store';
import { Platform } from 'react-native';

const ACCESS = 'cargo_access_token';
const REFRESH = 'cargo_refresh_token';
const USER = 'cargo_user_json';

// Platform-aware storage: use SecureStore for native, localStorage for web
const isWeb = Platform.OS === 'web';

// Fallback web storage implementation
const webStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return typeof window !== 'undefined' ? window.localStorage.getItem(key) : null;
    } catch {
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.setItem(key, value);
      }
    } catch {
      console.warn(`Failed to save ${key} to localStorage`);
    }
  },
  async removeItem(key: string): Promise<void> {
    try {
      if (typeof window !== 'undefined') {
        window.localStorage.removeItem(key);
      }
    } catch {
      console.warn(`Failed to remove ${key} from localStorage`);
    }
  },
};

const storage = isWeb ? webStorage : SecureStore;

export async function getAccessToken(): Promise<string | null> {
  return storage.getItem(ACCESS);
}

export async function getRefreshToken(): Promise<string | null> {
  return storage.getItem(REFRESH);
}

export async function getUserJson(): Promise<string | null> {
  return storage.getItem(USER);
}

export async function setAccessToken(token: string): Promise<void> {
  await storage.setItem(ACCESS, token);
}

export async function saveSession(
  accessToken: string,
  refreshToken: string,
  userJson: string,
): Promise<void> {
  await storage.setItem(ACCESS, accessToken);
  await storage.setItem(REFRESH, refreshToken);
  await storage.setItem(USER, userJson);
}

export async function clearAll(): Promise<void> {
  await storage.removeItem(ACCESS).catch(() => {});
  await storage.removeItem(REFRESH).catch(() => {});
  await storage.removeItem(USER).catch(() => {});
}
