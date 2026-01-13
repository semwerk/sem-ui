/**
 * Token storage abstraction for browser environments
 */

const DEFAULT_TOKEN_KEY = "semcontext_token";
const DEFAULT_REFRESH_TOKEN_KEY = "semcontext_refresh_token";

export interface TokenStorage {
  getToken(): string | null;
  setToken(token: string): void;
  removeToken(): void;
  getRefreshToken(): string | null;
  setRefreshToken(token: string): void;
  removeRefreshToken(): void;
  clear(): void;
}

/**
 * Creates a localStorage-based token storage
 */
export function createLocalStorage(
  tokenKey: string = DEFAULT_TOKEN_KEY,
  refreshTokenKey: string = DEFAULT_REFRESH_TOKEN_KEY
): TokenStorage {
  const isClient = typeof window !== "undefined";

  return {
    getToken() {
      if (!isClient) return null;
      return localStorage.getItem(tokenKey);
    },

    setToken(token: string) {
      if (!isClient) return;
      localStorage.setItem(tokenKey, token);
    },

    removeToken() {
      if (!isClient) return;
      localStorage.removeItem(tokenKey);
    },

    getRefreshToken() {
      if (!isClient) return null;
      return localStorage.getItem(refreshTokenKey);
    },

    setRefreshToken(token: string) {
      if (!isClient) return;
      localStorage.setItem(refreshTokenKey, token);
    },

    removeRefreshToken() {
      if (!isClient) return;
      localStorage.removeItem(refreshTokenKey);
    },

    clear() {
      if (!isClient) return;
      localStorage.removeItem(tokenKey);
      localStorage.removeItem(refreshTokenKey);
    },
  };
}

/**
 * Creates an in-memory token storage (for SSR or testing)
 */
export function createMemoryStorage(): TokenStorage {
  let token: string | null = null;
  let refreshToken: string | null = null;

  return {
    getToken: () => token,
    setToken: (t: string) => {
      token = t;
    },
    removeToken: () => {
      token = null;
    },
    getRefreshToken: () => refreshToken,
    setRefreshToken: (t: string) => {
      refreshToken = t;
    },
    removeRefreshToken: () => {
      refreshToken = null;
    },
    clear: () => {
      token = null;
      refreshToken = null;
    },
  };
}

/**
 * Default storage instance using localStorage
 */
export const defaultStorage = createLocalStorage();
