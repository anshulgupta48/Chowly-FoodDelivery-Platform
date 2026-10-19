import axios, { AxiosError, AxiosInstance } from 'axios';
import Constants from 'expo-constants';
import { Platform } from 'react-native';
import {
  clearAccessToken,
  getAccessToken,
} from '@/features/auth/token-storage';

/**
 * EXPO_PUBLIC_API_URL overrides the development default. Native Expo clients
 * use the Metro host so localhost doesn't incorrectly point back to the device.
 */
const developmentHost = Constants.expoConfig?.hostUri?.split(':')[0];
const baseURL =
  process.env.EXPO_PUBLIC_API_URL?.trim() ||
  (__DEV__ && Platform.OS !== 'web' && developmentHost
    ? `http://${developmentHost}:8000/api/v1`
    : 'http://localhost:8000/api/v1');

/** The shape the API's error handler returns for every failure. */
export type ApiErrorBody = {
  success: false;
  errorCode: string;
  message: string;
  errors?: { field: string; message: string }[];
};

export class ApiError extends Error {
  public readonly status: number;
  public readonly errorCode: string;
  public readonly fieldErrors: { field: string; message: string }[];

  constructor(
    message: string,
    status: number,
    errorCode: string,
    fieldErrors: ApiError['fieldErrors'] = [],
  ) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errorCode = errorCode;
    this.fieldErrors = fieldErrors;
  }
}

export const API: AxiosInstance = axios.create({
  baseURL,
  timeout: 20_000,
  headers: { 'Content-Type': 'application/json' },
});

API.interceptors.request.use(async (config) => {
  const token = await getAccessToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
});

API.interceptors.response.use(
  // Callers receive the parsed body directly, so no `.data.data` chains upstream.
  (response) => response.data,
  async (error: AxiosError<ApiErrorBody>) => {
    const body = error.response?.data;
    const status = error.response?.status ?? 0;
    // A rejected token is dead weight: drop it so the app returns to signed-out.
    if (status === 401) await clearAccessToken();
    if (!error.response) {
      throw new ApiError(
        "Can't reach Chowly right now. Check your connection and try again.",
        0,
        'ERR_NETWORK',
      );
    }

    throw new ApiError(
      body?.message ?? 'Something went wrong. Please try again.',
      status,
      body?.errorCode ?? 'ERR_INTERNAL',
      body?.errors ?? [],
    );
  },
);
