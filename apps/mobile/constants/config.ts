import Constants from 'expo-constants';

const localApi = 'http://10.0.2.2:3000/api'; // Android emulator
const lanApi = 'http://192.168.1.100:3000/api'; // change to your machine IP for real device

export const CONFIG = {
  API_BASE_URL:
    (Constants.expoConfig?.extra?.apiBaseUrl as string | undefined) ||
    (Constants.executionEnvironment === 'storeClient' ? lanApi : localApi),
};