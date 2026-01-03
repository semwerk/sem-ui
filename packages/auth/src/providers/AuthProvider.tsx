import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
  type ReactNode,
} from "react";
import type {
  AuthState,
  AuthUser,
  AuthConfig,
  LoginCredentials,
  SignupData,
  AuthResponse,
  OAuthProviderName,
} from "../types";
import { createLocalStorage, type TokenStorage } from "../lib/storage";
import { isTokenExpired, extractUserFromToken } from "../lib/jwt";
import { initiateOAuthFlow } from "../lib/pkce";

interface AuthContextValue extends AuthState {
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  signup: (data: SignupData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  loginWithOAuth: (provider: OAuthProviderName) => Promise<void>;
  getToken: () => string | null;
  refreshToken: () => Promise<boolean>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

const defaultConfig: AuthConfig = {
  apiUrl: "",
  tokenStorageKey: "semcontext_token",
  autoRefresh: true,
};

interface AuthProviderProps {
  children: ReactNode;
  config?: AuthConfig;
}

export function AuthProvider({ children, config: userConfig }: AuthProviderProps) {
  const config = useMemo(() => ({ ...defaultConfig, ...userConfig }), [userConfig]);

  const storage = useMemo<TokenStorage>(
    () => createLocalStorage(config.tokenStorageKey, config.refreshTokenStorageKey),
    [config.tokenStorageKey, config.refreshTokenStorageKey]
  );

  const [state, setState] = useState<AuthState>({
    user: null,
    token: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  // Initialize auth state from storage
  useEffect(() => {
    const token = storage.getToken();
    if (token && !isTokenExpired(token)) {
      const user = extractUserFromToken(token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      config.onAuthChange?.(user);
    } else {
      storage.clear();
      setState((prev) => ({ ...prev, isLoading: false }));
    }
  }, [storage, config]);

  const setAuthState = useCallback(
    (token: string, user: AuthUser | null) => {
      storage.setToken(token);
      setState({
        user,
        token,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      });
      config.onAuthChange?.(user);
    },
    [storage, config]
  );

  const clearAuthState = useCallback(() => {
    storage.clear();
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
    });
    config.onAuthChange?.(null);
  }, [storage, config]);

  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`${config.apiUrl}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(credentials),
          credentials: "include",
        });

        const data = await response.json();

        if (!response.ok || !data.success) {
          const error = data.error || "Login failed";
          setState((prev) => ({ ...prev, isLoading: false, error }));
          return { success: false, error };
        }

        const user = extractUserFromToken(data.token);
        setAuthState(data.token, user);
        return { success: true, token: data.token };
      } catch (err) {
        const error = err instanceof Error ? err.message : "Login failed";
        setState((prev) => ({ ...prev, isLoading: false, error }));
        return { success: false, error };
      }
    },
    [config.apiUrl, setAuthState]
  );

  const signup = useCallback(
    async (data: SignupData): Promise<AuthResponse> => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const response = await fetch(`${config.apiUrl}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: data.email,
            password: data.password,
            display_name: data.displayName,
            tenant_id: data.tenantId,
          }),
          credentials: "include",
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          const error = result.error || "Signup failed";
          setState((prev) => ({ ...prev, isLoading: false, error }));
          return { success: false, error };
        }

        const user = extractUserFromToken(result.token);
        setAuthState(result.token, user);
        return { success: true, token: result.token };
      } catch (err) {
        const error = err instanceof Error ? err.message : "Signup failed";
        setState((prev) => ({ ...prev, isLoading: false, error }));
        return { success: false, error };
      }
    },
    [config.apiUrl, setAuthState]
  );

  const logout = useCallback(async () => {
    try {
      await fetch(`${config.apiUrl}/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
    } catch {
      // Ignore errors, clear state anyway
    }
    clearAuthState();
  }, [config.apiUrl, clearAuthState]);

  const loginWithOAuth = useCallback(
    async (provider: OAuthProviderName) => {
      const returnPath = window.location.pathname;
      await initiateOAuthFlow(provider, `${config.apiUrl}/oauth/login`, returnPath);
    },
    [config.apiUrl]
  );

  const getToken = useCallback(() => {
    return storage.getToken();
  }, [storage]);

  const refreshToken = useCallback(async (): Promise<boolean> => {
    // Token refresh would be implemented here if backend supports it
    // For now, just check if current token is still valid
    const token = storage.getToken();
    if (!token || isTokenExpired(token)) {
      clearAuthState();
      return false;
    }
    return true;
  }, [storage, clearAuthState]);

  const value = useMemo<AuthContextValue>(
    () => ({
      ...state,
      login,
      signup,
      logout,
      loginWithOAuth,
      getToken,
      refreshToken,
    }),
    [state, login, signup, logout, loginWithOAuth, getToken, refreshToken]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
}
